import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Controller } from "../../../typechain-types";
import { VALID_PROJECT_ID } from "../../utils/constants";
import { advanceTimeTo } from "../../utils/time";

export function shouldBeAbleToDeposit(): void {
  const depositAmount = 100n * 10n ** 6n;
  let alice: SignerWithAddress;
  let controller: Controller;

  describe("should be able to deposit", async function () {
    const initProjectInput = {
      targetAmount: ethers.utils.parseEther("10"),
      depositStartTs: Date.now() + 10,
      depositEndTs: Date.now() + 20,
      baseUri: "baseUri",
    };

    this.beforeEach(async function () {
      alice = this.accounts.alice;
      controller = this.contracts.controller;

      await this.contracts.controller.initProject(
        initProjectInput.targetAmount,
        initProjectInput.depositStartTs,
        initProjectInput.depositEndTs,
        initProjectInput.baseUri
      );
    });

    it("should revert if the depositAmount is not divisible by $1", async function () {
      await expect(
        this.contracts.controller.deposit(VALID_PROJECT_ID, 900000)
      ).to.be.revertedWith("Deposit_NotDivisibleByDollar()");
    });

    it("should revert if the project is not initialized", async function () {
      await expect(
        this.contracts.controller.deposit(VALID_PROJECT_ID + 1, depositAmount)
      ).to.be.revertedWith("NotExistingProject()");
    });

    it("should revert if the project has not started yet", async function () {
      await expect(
        this.contracts.controller.deposit(VALID_PROJECT_ID, depositAmount)
      ).to.be.revertedWith("Deposit_NotStarted()");
    });

    it("should revert if the project has finished already", async function () {
      await advanceTimeTo(initProjectInput.depositEndTs);
      await expect(
        this.contracts.controller.deposit(VALID_PROJECT_ID, depositAmount)
      ).to.be.revertedWith("Deposit_Ended()");
    });
  });
}
