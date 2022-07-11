import { expect } from "chai";
import { ethers } from "hardhat";
import { initProject } from "../utils/controller";
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

    // Q. Is it borrow test?
    describe("success", async function () {
      it("should transfer usdc", async function () {
        const beforeBalance = await this.contracts.usdc.balanceOf(
          this.contracts.controller.address
        );

        const tx = await this.contracts.controller
          .connect(this.accounts.deployer)
          .repay(projectId, finalAmount);

        expect(
          await this.contracts.usdc.balanceOf(this.contracts.controller.address)
        ).to.equal(beforeBalance.add(finalAmount));

        expect(tx)
          .to.emit(this.contracts.usdc, "Transfer")
          .withArgs(
            this.accounts.deployer,
            this.contracts.controller,
            finalAmount
          );
      });
    });
  });
}
