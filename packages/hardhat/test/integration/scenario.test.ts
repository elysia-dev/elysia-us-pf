import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ethers, Signer } from "ethers";
import { initProject, TProject } from "../utils/controller";
import { advanceTimeTo } from "../utils/time";
import { faucetUSDC, getUSDCContract, USDC } from "../utils/tokens";
import { Controller, IERC20, NftBond } from "./../../typechain-types";
import { VALID_PROJECT_ID } from "./../utils/constants";
import { repayInput } from "./../utils/controller";

export function scenarioTest(): void {
  let project: TProject;
  let usdc: IERC20;
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let controller: Controller;

  const projectId = VALID_PROJECT_ID;

  describe("user scenario test", async function () {
    const amounts = [
      ethers.utils.parseUnits("200", 6), // alice
      ethers.utils.parseUnits("300", 6), // bob
      ethers.utils.parseUnits("500", 6), // carol
    ];

    beforeEach("project init and faucet", async function () {
      controller = this.contracts.controller;
      deployer = this.accounts.deployer;
      alice = this.accounts.alice;
      bob = this.accounts.bob;
      carol = this.accounts.carol;

      usdc = await getUSDCContract();
      project = await initProject(controller);
      for (const [index, user] of [alice, bob, carol].entries()) {
        await usdc
          .connect(user)
          .approve(controller.address, ethers.constants.MaxUint256);
        await faucetUSDC(user.address, amounts[index]);
      }
      await advanceTimeTo(project.depositStartTs.toNumber());
    });

    it("three users deposit and withdraw", async function () {
      const checkNftBalance = async (
        user: SignerWithAddress,
        amount: number
      ) => {
        expect(
          await this.contracts.nftBond.balanceOf(user.address, projectId)
        ).to.equal(amount);
      };
      const withdrawAndCheckTokens = async (
        user: SignerWithAddress,
        expectedUsdcAmountTransferred: number
      ) => {
        const usdcBalanceBefore = await usdc.balanceOf(user.address);
        await controller.connect(user).withdraw(projectId);
        // After withdrawl, nft balance should be 0
        await checkNftBalance(user, 0);
        // After withdraw, user can get usdc
        expect(await usdc.balanceOf(user.address)).to.equal(
          usdcBalanceBefore.add(
            ethers.utils.parseUnits(expectedUsdcAmountTransferred.toString(), 6)
          )
        );
      };
      // Alice and bob deposit with usdc
      await controller.connect(alice).deposit(projectId, amounts[0]);
      await controller.connect(bob).deposit(projectId, amounts[1]);
      // Carol deposit with ether
      await controller.connect(carol).deposit(projectId, amounts[2], {
        value: ethers.utils.parseEther("10"),
      });
      // alice's balance is 20, bob's 30 and carol's 50
      await checkNftBalance(alice, 20);
      await checkNftBalance(bob, 30);
      await checkNftBalance(carol, 50);
      // Time passes and borrower can borrow 1000
      await advanceTimeTo(project.depositEndTs.toNumber());
      await controller.connect(deployer).borrow(projectId);
      // borrower repays 1100
      await usdc
        .connect(deployer)
        .approve(controller.address, ethers.constants.MaxUint256);
      await faucetUSDC(deployer.address, ethers.utils.parseUnits("1000", 6));
      await controller
        .connect(deployer)
        .repay(projectId, ethers.utils.parseUnits("1100", 6));
      // Each user withdraw
      await withdrawAndCheckTokens(alice, 220);
      await withdrawAndCheckTokens(bob, 330);
      await withdrawAndCheckTokens(carol, 550);
      // Controller balance should be 0 after all user withdraws
      expect(await usdc.balanceOf(controller.address)).to.equal(0);
    });
  });
}
