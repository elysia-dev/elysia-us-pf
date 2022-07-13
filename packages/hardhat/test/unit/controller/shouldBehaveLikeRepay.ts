import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { initProject, initProjectInput } from "../../utils/controller";
import { faucetUSDC } from "../../utils/tokens";
import { advanceTimeTo } from "../../utils/time";

const finalAmount = ethers.utils.parseUnits("2000", 6);

export function shouldBehaveLikeRepay(): void {
  const projectId = 0;
  let alice: SignerWithAddress;
  let deployer: SignerWithAddress;
  const WRONG_TIME = Date.now() + 5;

  describe("shouldBehaveLikeRepay", async function () {
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
        this.contracts.controller
          .connect(alice)
          .repay(projectId, initProjectInput.targetAmount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert if the project does not exist", async function () {
      await expect(
        this.contracts.controller.repay(2, initProjectInput.targetAmount)
      ).to.be.revertedWith("NotExistingProject");
    });

    it("should revert if the project deposit didn't end", async function () {
      await advanceTimeTo(initProjectInput.depositStartTs + 5);
      console.log(WRONG_TIME);

      await expect(
        this.contracts.controller.repay(
          projectId,
          initProjectInput.targetAmount
        )
      ).to.be.revertedWith("Repay_DepositNotEnded");
    });

    it("should revert if amount is not exceeds initial target amount", async function () {
      await advanceTimeTo(initProjectInput.depositEndTs);
      await expect(this.contracts.controller
        .connect(this.accounts.deployer)
        .repay(projectId, 10)).to.be.revertedWith("Repay_NotEnoughAmountInput");
    });

    describe("success", async function () {
      it("should update finalAmount", async function () {
        await advanceTimeTo(initProjectInput.depositEndTs);
        await this.contracts.controller
          .connect(this.accounts.deployer)
          .repay(projectId, finalAmount);

        const projectData = await this.contracts.controller.projects(projectId);
        expect(projectData.finalAmount).to.be.equal(finalAmount);
      });

      it("should emit repay event", async function () {
        
      });
    });
  });
}
