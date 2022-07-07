import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { Controller, ERC20 } from "../../../typechain-types";
import { advanceTimeTo } from "../../utils/time";
import { faucetUSDC, USDC, WETH9 } from "../../utils/tokens";
import { getUniswapV3QuoterContract } from "../../utils/uniswap";
import { getUSDCContract } from "./../../utils/tokens";

const INITIAL_NFT_ID = 0;

export function shouldBeAbleToDeposit(): void {
  const projectId = 0;
  const depositAmount = 100n * 10n ** 6n;
  let usdc: ERC20;
  let alice: SignerWithAddress;
  let controller: Controller;

  describe("should be able to deposit", async function () {
    const initProjectInput = {
      targetAmount: ethers.utils.parseEther("10"),
      depositStartTs: Date.now() + 10,
      depositEndTs: Date.now() + 20,
      baseUri: "baseUri",
    };

    this.beforeEach(async function () {
      alice = this.accounts.alice;
      controller = this.contracts.controller;

      usdc = await getUSDCContract();
      await this.contracts.controller.initProject(
        initProjectInput.targetAmount,
        initProjectInput.depositStartTs,
        initProjectInput.depositEndTs,
        initProjectInput.baseUri
      );
    });

    it("should revert if the depositAmount is not divisible by $1", async function () {
      await expect(
        this.contracts.controller.deposit(projectId, 900000)
      ).to.be.revertedWith("Deposit_NotDivisibleByDollar()");
    });

    it("should revert if the project is not initialized", async function () {
      await expect(
        this.contracts.controller.deposit(projectId + 1, depositAmount)
      ).to.be.revertedWith("NotExistingProject()");
    });

    it("should revert if the project has not started yet", async function () {
      await expect(
        this.contracts.controller.deposit(projectId, depositAmount)
      ).to.be.revertedWith("Deposit_NotStarted()");
    });

    it("should revert if the project has finished already", async function () {
      await advanceTimeTo(initProjectInput.depositEndTs);
      await expect(
        this.contracts.controller.deposit(projectId, depositAmount)
      ).to.be.revertedWith("Deposit_Ended()");
    });

    it("should increment the currentAmount of the project by the deposited amount", async function () {});

    context("when a user deposits with USDC", function () {
      beforeEach(
        "advance time to deposit start timestamp and faucet USDC",
        async function () {
          await advanceTimeTo(initProjectInput.depositStartTs);
          await faucetUSDC(alice.address, depositAmount);
          await usdc.connect(alice).approve(controller.address, depositAmount);
        }
      );

      it("should mint NFT", async function () {
        const { nftname } = this.contracts;

        const tx = await controller
          .connect(alice)
          .deposit(projectId, depositAmount);

        expect(tx)
          .to.emit(nftname, "Transfer")
          .withArgs(0, alice.address, INITIAL_NFT_ID);
      });

      it("should transfer USDC from the user to itself", async function () {
        await expect(() =>
          controller.connect(alice).deposit(projectId, depositAmount)
        ).to.changeTokenBalance(usdc, alice, -depositAmount);
      });
    });

    context("when a user deposits with ETH", async function () {
      let quoterContract: Contract;

      beforeEach("advance time to deposit start timestamp", async function () {
        await advanceTimeTo(initProjectInput.depositStartTs);
        quoterContract = getUniswapV3QuoterContract(ethers.provider);
      });

      it("should swap ETH to USDC and refund remaining ETH", async function () {
        const necessaryETHAmount =
          await quoterContract.callStatic.quoteExactOutputSingle(
            WETH9.address,
            USDC.address,
            500,
            depositAmount,
            0
          );

        await expect(() =>
          controller
            .connect(alice)
            .deposit(projectId, depositAmount, { value: 10n ** 18n })
        ).to.changeEtherBalance(alice, `-${necessaryETHAmount}`);
      });
    });
  });
}
