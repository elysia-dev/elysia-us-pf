import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { network, ethers } from "hardhat";

const initProjectInput = {
  targetAmount: ethers.utils.parseEther("10"),
  startTimestamp: Date.now() + 10,
  endTimestamp: Date.now() + 20,
  baseUri: "baseUri",
};

const wrongStartTs = Date.now() - 100;
const wrongEndTs = Date.now() - 50;

console.log(wrongStartTs);

export function shouldBehaveLikeInitProject(): void {
  const projectId = 0;
  let alice: SignerWithAddress;
  describe("shouldBehaveLikeInitProject", async function () {
    beforeEach(async function () {
      alice = this.accounts.alice;
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

    it.only("should revert if input timestamps are invalid", async function () {
      console.log(Date.now());

      await network.provider.send("evm_increaseTime", [Date.now() + 1]);
      await network.provider.request({ method: "evm_mine", params: [] });

      await expect(
        this.contracts.controller.initProject(
          initProjectInput.targetAmount,
          wrongStartTs,
          wrongEndTs,
          initProjectInput.baseUri
        )
      ).to.be.revertedWith("InitProject_InvalidTimestampInput");
    });

    it("should increase numberOfProject", async function () {});

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

    it("should emit NewProject event", async function () {});
  });
}
