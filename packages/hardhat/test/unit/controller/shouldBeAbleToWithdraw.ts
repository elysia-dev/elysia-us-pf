import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { advanceTimeTo } from "../../utils/time";
import { Controller } from "./../../../typechain-types";
import { ERC20 } from "./../../../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";
import { VALID_PROJECT_ID } from "./../../utils/constants";
import {
  initProject,
  initProjectInput,
  repayInput,
  TProject,
} from "./../../utils/controller";
import { faucetUSDC, getUSDCContract, USDC } from "./../../utils/tokens";

export function shouldBeAbleToWithdraw(): void {
  let project: TProject;
  let usdc: ERC20;
  let alice: SignerWithAddress;
  let controller: Controller;
  let depositAmount: BigNumber;

  describe("should be able to withdraw", async function () {
    const projectId = VALID_PROJECT_ID;

    beforeEach("init -> deposit", async function () {
      // NOTE: suppose alice alone deposits the total amount
      depositAmount = initProjectInput.totalAmount;
      alice = this.accounts.alice;
      controller = this.contracts.controller;
      usdc = await getUSDCContract();
      project = await initProject(this.contracts.controller);

      await advanceTimeTo(project.depositStartTs.toNumber());

      await usdc
        .connect(alice)
        .approve(controller.address, ethers.constants.MaxUint256);
      await faucetUSDC(alice.address, depositAmount);
      await controller.connect(alice).deposit(projectId, depositAmount);
    });

    it("should revert if the token does not exist.", async function () {
      await expect(
        controller.connect(alice).withdraw(BigNumber.from("100000000"))
      ).to.be.revertedWith("NotExistingProject()");
    });

    it("should revert if the project has not repaid yet.", async function () {
      await expect(
        controller.connect(alice).withdraw(projectId)
      ).to.be.revertedWith("Withdraw_NotRepayedProject()");
    });

    context("when repayed", async function () {
      beforeEach(async function () {
        const { deployer } = this.accounts;
        await usdc
          .connect(deployer)
          .approve(controller.address, ethers.constants.MaxUint256);
        await advanceTimeTo(project.depositEndTs.toNumber());

        await controller.connect(deployer).borrow(projectId);

        await faucetUSDC(deployer.address, repayInput.finalAmount);
        await controller
          .connect(deployer)
          .repay(projectId, repayInput.finalAmount);
      });

      it("should decrement project.currentAmount by his/her deposited amount + interest", async function () {
        const currentAmountBefore = (await controller.projects(projectId))
          .currentAmount;
        const userBalancePlusInterest = depositAmount.mul(2);

        await expect(controller.connect(alice).withdraw(projectId))
          .to.emit(this.contracts.controller, "Withdrawed")
          .withArgs(alice.address, projectId, userBalancePlusInterest);

        const currentAmountAfter = (await controller.projects(projectId))
          .currentAmount;
        expect(currentAmountBefore.sub(currentAmountAfter)).eq(
          userBalancePlusInterest
        );
        expect(currentAmountAfter).eq(0);
      });
    });
  });
}
