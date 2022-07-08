import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { network, ethers } from "hardhat";
import { advanceTimeTo } from "../../utils/time";

const initProjectInput = {
  targetAmount: ethers.utils.parseEther("10"),
  startTimestamp: Math.floor(Date.now() / 1000 + 10),
  endTimestamp: Math.floor(Date.now() / 1000 + 20),
  baseUri: "baseUri",
};

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
            initProjectInput.startTimestamp,
            initProjectInput.endTimestamp,
            initProjectInput.baseUri
          )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert if targetAmount is zero", async function () {
      await expect(
        this.contracts.controller.initProject(
          0,
          initProjectInput.startTimestamp,
          initProjectInput.endTimestamp,
          initProjectInput.baseUri
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
          initProjectInput.baseUri
        )
      ).to.be.revertedWith("InitProject_InvalidTimestampInput");

      /**
       * depositEndTs <= depositStartTs
       */
      await expect(
        this.contracts.controller.initProject(
          initProjectInput.targetAmount,
          initProjectInput.endTimestamp,
          initProjectInput.startTimestamp,
          initProjectInput.baseUri
        )
      ).to.be.revertedWith("InitProject_InvalidTimestampInput");
    });

    it("should increase numberOfProject", async function () {
      await this.contracts.controller.initProject(
        initProjectInput.targetAmount,
        initProjectInput.startTimestamp,
        initProjectInput.endTimestamp,
        initProjectInput.baseUri
      );

      expect(await this.contracts.controller.numberOfProject()).to.eql(
        BigNumber.from(1)
      );
    });

    it("should add new project", async function () {
      await this.contracts.controller.initProject(
        initProjectInput.targetAmount,
        initProjectInput.startTimestamp,
        initProjectInput.endTimestamp,
        initProjectInput.baseUri
      );

      expect(await this.contracts.controller.projects(projectId)).to.eql([
        BigNumber.from(initProjectInput.targetAmount),
        BigNumber.from(0),
        BigNumber.from(initProjectInput.startTimestamp),
        BigNumber.from(initProjectInput.endTimestamp),
        BigNumber.from(0),
        false,
      ]);
    });

    it("should emit NewProject event", async function () {
      await expect(
        this.contracts.controller.initProject(
          initProjectInput.targetAmount,
          initProjectInput.startTimestamp,
          initProjectInput.endTimestamp,
          initProjectInput.baseUri
        )
      ).to.emit(this.contracts.controller, "Controller_NewProject");
    });
  });
}
