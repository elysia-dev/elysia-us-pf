import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { INVALID_PROJECT_ID, VALID_PROJECT_ID } from "../../utils/constants";
import { initProject } from "../../utils/controller";
import { faucetUSDC } from "../../utils/tokens";

const finalAmount = ethers.utils.parseUnits("2000", 6);
const projectId = VALID_PROJECT_ID;
const invalidProjectId = INVALID_PROJECT_ID;

export function shouldBehaveLikeFinalizeRepay(): void {
  let alice: SignerWithAddress;
  let deployer: SignerWithAddress;

  describe("shouldBehaveLikeFinalizeRepay", async function () {
    beforeEach("init project and approve", async function () {
      alice = this.accounts.alice;
      deployer = this.accounts.deployer;

      await initProject(this.contracts.controller);

      await this.contracts.usdc
        .connect(deployer)
        .approve(this.contracts.controller.address, finalAmount);
      await faucetUSDC(deployer.address, finalAmount);
    });

    it("should revert if the caller is not admin", async function () {
      await expect(
        this.contracts.controller.connect(alice).finalizeRepay(projectId)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert if the project does not exist", async function () {
      await expect(
        this.contracts.controller.finalizeRepay(invalidProjectId)
      ).to.be.revertedWith("NotExistingProject");
    });

    it("should revert if amount is not exceeds initial target amount", async function () {
      await expect(
        this.contracts.controller.finalizeRepay(projectId)
      ).to.be.revertedWith("FinalizeRepay_NotEnoughFinalAmount");
    });

    describe("success", async function () {
      beforeEach("repay", async function () {
        await this.contracts.controller
          .connect(this.accounts.deployer)
          .repay(projectId, finalAmount);
      });

      it("should update repayed state", async function () {
        await this.contracts.controller
          .connect(this.accounts.deployer)
          .finalizeRepay(projectId);

        const projectData = await this.contracts.controller.projects(projectId);
        expect(projectData.repayed).to.be.true;
      });

      it("should emit FinalizeRepay event", async function () {
        const tx = await this.contracts.controller
          .connect(this.accounts.deployer)
          .finalizeRepay(projectId);

        await expect(tx).to.emit(this.contracts.controller, "FinalizeRepay");
      });
    });
  });
}
