import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { network, ethers } from "hardhat";
import { VALID_PROJECT_ID } from "../../utils/constants";
import { initProject, initProjectInput } from "../../utils/controller";
import { advanceTimeTo } from "../../utils/time";

const wrongStartTs = Math.floor((Date.now() - 100) / 1000);
const wrongEndTs = Math.floor((Date.now() - 50) / 1000);

console.log(wrongStartTs);

export function shouldBehaveLikeInitProject(): void {
  const projectId = 0;
  let alice: SignerWithAddress;
  describe("shouldBehaveLikeInitProject", async function () {
    beforeEach(async function () {
      alice = this.accounts.alice;
      advanceTimeTo(Date.now() / 1000);
    });

    it("should revert if the caller is not admin", async function () {
      await expect(
        this.contracts.controller
          .connect(alice)
          .initProject(
            initProjectInput.targetAmount,
            initProjectInput.depositStartTs,
            initProjectInput.depositEndTs,
            initProjectInput.uri
          )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert if targetAmount is zero", async function () {
      await expect(
        this.contracts.controller.initProject(
          0,
          initProjectInput.depositStartTs,
          initProjectInput.depositEndTs,
          initProjectInput.uri
        )
      ).to.be.revertedWith("InitProject_InvalidTargetAmountInput");
    });

    it("should revert if input timestamps are invalid", async function () {
      /**
       * Inputted times before current time.
       */
      await expect(
        this.contracts.controller.initProject(
          initProjectInput.targetAmount,
          wrongStartTs,
          wrongEndTs,
          initProjectInput.uri
        )
      ).to.be.revertedWith("InitProject_InvalidTimestampInput");

      /**
       * depositEndTs <= depositStartTs
       */
      await expect(
        this.contracts.controller.initProject(
          initProjectInput.targetAmount,
          initProjectInput.depositEndTs,
          initProjectInput.depositStartTs,
          initProjectInput.uri
        )
      ).to.be.revertedWith("InitProject_InvalidTimestampInput");
    });

    it("should add new project", async function () {
      await initProject(this.contracts.controller);

      const project = await this.contracts.controller.projects(
        VALID_PROJECT_ID
      );

      expect(project.totalAmount).to.eq(
        BigNumber.from(initProjectInput.targetAmount)
      );
      expect(project.currentAmount).to.eq(0);
      expect(project.depositStartTs).to.eq(
        BigNumber.from(initProjectInput.depositStartTs)
      );
      expect(project.depositEndTs).to.eq(
        BigNumber.from(initProjectInput.depositEndTs)
      );
      expect(project.finalAmount).to.eq(0);
      expect(project.repayed).to.eq(false);
    });

    it("should emit NewProject event", async function () {
      await expect(
        this.contracts.controller.initProject(
          initProjectInput.targetAmount,
          initProjectInput.depositStartTs,
          initProjectInput.depositEndTs,
          initProjectInput.uri
        )
      ).to.emit(this.contracts.controller, "Controller_NewProject");
    });
  });
}
