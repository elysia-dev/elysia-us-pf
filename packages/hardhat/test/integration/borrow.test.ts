import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Sign } from "crypto";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { initProject, initProjectInput } from "../utils/controller";
import { advanceTimeTo } from "../utils/time";
import { VALID_PROJECT_ID } from "./../utils/constants";
import { faucetUSDC, USDC, WETH9 } from "../utils/tokens";
import { Controller } from "../../typechain-types";

const finalAmount = ethers.utils.parseUnits("2000", 6);

export function borrowTest(): void {
  const projectId = VALID_PROJECT_ID;
  let alice: SignerWithAddress;
  let deployer: SignerWithAddress;
  let controller: Controller;

  describe("borrowTest", async function () {
    beforeEach("init project and approve", async function () {
      alice = this.accounts.alice;
      deployer = this.accounts.deployer;
      controller = this.contracts.controller;

      await initProject(controller);
      await this.contracts.usdc
        .connect(deployer)
        .approve(controller.address, finalAmount);
      await advanceTimeTo(initProjectInput.depositStartTs);

      const project = await this.contracts.controller.projects(projectId);
      await this.contracts.usdc
        .connect(alice)
        .approve(controller.address, project.totalAmount);
      await faucetUSDC(alice.address, project.totalAmount);
    });

    context("When it has reached the total amount,", async function () {
      beforeEach(async function () {
        const { alice } = this.accounts;
        const project = await this.contracts.controller.projects(projectId);
        await controller.connect(alice).deposit(projectId, project.totalAmount);
      });

      it("can borrow before the deposit ends", async function () {
        const proj = await this.contracts.controller.projects(projectId);

        const userBalance = await this.contracts.usdc.balanceOf(
          this.accounts.deployer.address
        );

        const tx = await this.contracts.controller
          .connect(this.accounts.deployer)
          .borrow(projectId);

        expect(
          await this.contracts.usdc.balanceOf(this.accounts.deployer.address)
        ).to.equal(userBalance.add(proj.totalAmount));
      });
    });

    context(
      "when the deposit period ends, but the total deposited amount is below the target amount",
      async function () {
        const depositAmount = 100n * 10n ** 6n;

        beforeEach("when deposit time ends", async function () {
          await controller.connect(alice).deposit(projectId, depositAmount);
          await advanceTimeTo(initProjectInput.depositEndTs);
        });

        it("should update the total amount equal to the current amount of the project", async function () {
          const currentAmountBeforeBorrow = (
            await this.contracts.controller.projects(projectId)
          ).currentAmount;

          await this.contracts.controller
            .connect(this.accounts.deployer)
            .borrow(projectId);

          // Fetch newly updated totalAmount.
          const proj = await this.contracts.controller.projects(projectId);

          expect(proj.totalAmount).to.be.eq(currentAmountBeforeBorrow);
        });

        it("should transfer the whole deposited usdc in the project", async function () {
          const userBalance = await this.contracts.usdc.balanceOf(
            this.accounts.deployer.address
          );

          const tx = await this.contracts.controller
            .connect(this.accounts.deployer)
            .borrow(projectId);

          // Fetch newly updated totalAmount.
          const proj = await this.contracts.controller.projects(projectId);

          expect(
            await this.contracts.usdc.balanceOf(this.accounts.deployer.address)
          ).to.equal(userBalance.add(proj.totalAmount));
        });

        it("should only allow users to borrow once", async function () {
          await controller.connect(this.accounts.deployer).borrow(projectId);

          await expect(
            controller.connect(this.accounts.deployer).borrow(projectId)
          ).to.be.revertedWith("AlreadyBorrowed()");
        });
      }
    );
  });
}
