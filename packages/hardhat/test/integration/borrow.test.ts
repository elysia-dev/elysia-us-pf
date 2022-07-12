import { expect } from "chai";
import { ethers } from "hardhat";
import { initProject, initProjectInput } from "../utils/controller";
import { advanceTimeTo } from "../utils/time";
import { VALID_PROJECT_ID } from "./../utils/constants";

const finalAmount = ethers.utils.parseUnits("2000", 6);

export function borrowTest(): void {
  const projectId = VALID_PROJECT_ID;

  describe("borrowTest", async function () {
    beforeEach("init project and approve", async function () {
      await initProject(this.contracts.controller);
      await this.contracts.usdc
        .connect(this.accounts.deployer)
        .approve(this.contracts.controller.address, finalAmount);
    });

    describe("success", async function () {
      it("should transfer usdc", async function () {
        const theProject = await this.contracts.controller.projects(projectId);
        const amount = theProject.currentAmount;

        const userBalance = await this.contracts.usdc.balanceOf(
          this.accounts.deployer.address
        );
        await advanceTimeTo(initProjectInput.depositEndTs);
        const tx = await this.contracts.controller
          .connect(this.accounts.deployer)
          .borrow(projectId);

        expect(
          await this.contracts.usdc.balanceOf(this.accounts.deployer.address)
        ).to.equal(userBalance.add(amount));

        await expect(tx)
          .to.emit(this.contracts.usdc, "Transfer")
          .withArgs(
            this.accounts.deployer.address,
            this.contracts.controller.address,
            finalAmount
          );
      });
    });
  });
}
