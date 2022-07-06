import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const initProjectInput = {
  targetAmount: ethers.utils.parseEther("10"),
  startTimestamp: Date.now() + 10,
  endTimestamp: Date.now() + 20,
  baseUri: "baseUri",
};

export function shouldBehaveLikeInitProject(): void {
  describe("shouldBehaveLikeInitProject", async function () {
    beforeEach(async function () {});

    it("should revert if the caller is not admin", async function () {});

    it("should revert if input timestamps are invalid", async function () {});

    it("should increase numberOfProject", async function () {});

    it("should add new project", async function () {
      await this.contracts.controller.initProject(
        initProjectInput.targetAmount,
        initProjectInput.startTimestamp,
        initProjectInput.endTimestamp,
        initProjectInput.baseUri
      );

      expect(await this.contracts.controller.projects(1)).to.eql([
        BigNumber.from(initProjectInput.targetAmount),
        BigNumber.from(0),
        BigNumber.from(initProjectInput.startTimestamp),
        BigNumber.from(initProjectInput.endTimestamp),
        BigNumber.from(0),
      ]);
    });

    it("should emit NewProject event", async function () {});
  });
}