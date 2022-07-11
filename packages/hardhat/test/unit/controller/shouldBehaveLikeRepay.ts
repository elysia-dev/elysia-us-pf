import { expect } from "chai";
import { ethers } from "hardhat";
import { VALID_PROJECT_ID } from "../../utils/constants";
import { initProject } from "../../utils/controller";
import { faucetUSDC } from "../../utils/tokens";

const finalAmount = ethers.utils.parseUnits("2000", 6);

export function shouldBehaveLikeRepay(): void {
  const projectId = VALID_PROJECT_ID;

  describe("shouldBehaveLikeRepay", async function () {
    beforeEach("init project and approve", async function () {
      const { deployer } = this.accounts;
      await initProject(this.contracts.controller);
      await this.contracts.usdc
        .connect(deployer)
        .approve(this.contracts.controller.address, finalAmount);
      await faucetUSDC(deployer.address, finalAmount);
    });

    it("should revert if the caller is not admin", async function () {});

    it("should revert if the project does not exist", async function () {});

    it("should revert if amount is not exceeds initial target amount", async function () {});

    describe("success", async function () {
      it("should update finalAmount", async function () {
        await this.contracts.controller
          .connect(this.accounts.deployer)
          .repay(projectId, finalAmount);

        const projectData = await this.contracts.controller.projects(projectId);
        expect(projectData.finalAmount).to.be.equal(finalAmount);
      });

      it("should emit repay event", async function () {});
    });
  });
}
