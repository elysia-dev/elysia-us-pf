import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Sign } from "crypto";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { initProject, initProjectInput } from "../utils/controller";
import { advanceTimeTo } from "../utils/time";
import { VALID_PROJECT_ID } from "./../utils/constants";
import { faucetUSDC, USDC, WETH9 } from "../utils/tokens";

const finalAmount = ethers.utils.parseUnits("2000", 6);

export function borrowTest(): void {
  const projectId = VALID_PROJECT_ID;
  const depositAmount = 100n * 10n ** 6n;
  let deployer: SignerWithAddress;
  let controller: Contract;

  describe("borrowTest", async function () {
    beforeEach("init project and approve", async function () {
      const { alice, deployer } = this.accounts;
      const controller = this.contracts.controller;
      await initProject(controller);
      await this.contracts.usdc
        .connect(deployer)
        .approve(controller.address, finalAmount);
      await advanceTimeTo(initProjectInput.depositStartTs);

      const theProject = await this.contracts.controller.projects(projectId);
      await this.contracts.usdc
        .connect(alice)
        .approve(controller.address, theProject.totalAmount);
      await faucetUSDC(alice.address, theProject.totalAmount);
      await controller
        .connect(alice)
        .deposit(projectId, theProject.totalAmount);
      await advanceTimeTo(initProjectInput.depositEndTs);
    });

    describe("success", async function () {
      it.only("should transfer usdc", async function () {
        // const amount = theProject.currentAmount;
        const theProject = await this.contracts.controller.projects(projectId);

        const userBalance = await this.contracts.usdc.balanceOf(
          this.accounts.deployer.address
        );

        const tx = await this.contracts.controller
          .connect(this.accounts.deployer)
          .borrow(projectId);

        expect(
          await this.contracts.usdc.balanceOf(this.accounts.deployer.address)
        ).to.equal(userBalance.add(theProject.totalAmount));
      });
    });
  });
}
