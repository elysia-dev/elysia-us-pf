import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { VALID_PROJECT_ID } from "../../utils/constants";
import { faucetUSDC } from "../../utils/tokens";

const initProjectInput = {
  targetAmount: ethers.utils.parseUnits("1000", 6),
  startTimestamp: Date.now() + 10,
  endTimestamp: Date.now() + 20,
  baseUri: "baseUri",
};

const finalAmount = ethers.utils.parseUnits("2000", 6);

export function shouldBehaveLikeRepay(): void {
  const projectId = 0;
  const defaultAmount = 0;
  let alice: SignerWithAddress;
  let deployer: SignerWithAddress;

  describe("shouldBehaveLikeRepay", async function () {
    beforeEach("init project and approve", async function () {
      alice = this.accounts.alice;
      deployer = this.accounts.deployer;

      await this.contracts.controller.initProject(
        initProjectInput.targetAmount,
        initProjectInput.startTimestamp,
        initProjectInput.endTimestamp,
        initProjectInput.baseUri
      );

      await this.contracts.usdc
        .connect(deployer)
        .approve(this.contracts.controller.address, finalAmount);
      await faucetUSDC(deployer.address, finalAmount);
      const balance = await this.contracts.usdc.balanceOf(deployer.address);
      console.log(`balance: ${balance}`);
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
