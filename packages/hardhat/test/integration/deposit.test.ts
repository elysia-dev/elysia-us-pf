import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { Controller, ERC20 } from "../../typechain-types";
import { initProject, initProjectInput, repayInput } from "../utils/controller";
import { advanceTimeTo } from "../utils/time";
import { faucetUSDC, getUSDCContract, USDC, WETH9 } from "../utils/tokens";
import { getUniswapV3QuoterContract } from "../utils/uniswap";
import { INITIAL_NFT_ID, VALID_PROJECT_ID } from "./../utils/constants";

export function depositTest(): void {
  const depositAmount = 100n * 10n ** 6n;
  let usdc: ERC20;
  let alice: SignerWithAddress;
  let controller: Controller;

  describe("depositTest", async function () {
    beforeEach("init project and approve", async function () {
      alice = this.accounts.alice;
      controller = this.contracts.controller;

      usdc = await getUSDCContract();

      await initProject(this.contracts.controller);

      await this.contracts.usdc
        .connect(this.accounts.deployer)
        .approve(this.contracts.controller.address, repayInput.finalAmount);
    });

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
        const { nftBond } = this.contracts;

        const tx = await controller
          .connect(alice)
          .deposit(VALID_PROJECT_ID, depositAmount);

        // FIXME: await
        expect(tx)
          .to.emit(nftBond, "TransferSingle")
          .withArgs(0, alice.address, INITIAL_NFT_ID);
      });

      it("should increment the currentAmount of the project by the deposited amount", async function () {
        const beforeAmount = (await controller.projects(VALID_PROJECT_ID))
          .currentAmount;
        await controller
          .connect(alice)
          .deposit(VALID_PROJECT_ID, depositAmount);
        const afterAmount = (await controller.projects(VALID_PROJECT_ID))
          .currentAmount;
        expect(afterAmount.sub(beforeAmount)).to.eq(
          BigNumber.from(depositAmount)
        );
      });

      it("should transfer USDC from the user to itself", async function () {
        await expect(() =>
          controller.connect(alice).deposit(VALID_PROJECT_ID, depositAmount)
        ).to.changeTokenBalance(usdc, alice, -depositAmount);
      });

      it("should increase its USDC balance by depositAmount", async function () {
        await expect(() =>
          controller.connect(alice).deposit(VALID_PROJECT_ID, depositAmount)
        ).to.changeTokenBalance(usdc, controller, depositAmount);
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
            .deposit(VALID_PROJECT_ID, depositAmount, { value: 10n ** 18n })
        ).to.changeEtherBalance(alice, `-${necessaryETHAmount}`);
      });

      it("should increase its USDC balance by depositAmount", async function () {
        await expect(() =>
          controller
            .connect(alice)
            .deposit(VALID_PROJECT_ID, depositAmount, { value: 10n ** 18n })
        ).to.changeTokenBalance(usdc, controller, depositAmount);
      });
    });
  });
}
