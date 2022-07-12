import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Controller } from "../../../typechain-types";
import { VALID_PROJECT_ID } from "../../utils/constants";
import { initProject } from "../../utils/controller";
import { advanceTimeTo } from "../../utils/time";
import { TProject } from "./../../utils/controller";

export function shouldBeAbleToDeposit(): void {
  const depositAmount = 100n * 10n ** 6n;
  let alice: SignerWithAddress;
  let project: TProject;
  let controller: Controller;

  describe("should be able to deposit", async function () {
    beforeEach(async function () {
      alice = this.accounts.alice;
      controller = this.contracts.controller;
      project = await initProject(this.contracts.controller);
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
      await advanceTimeTo(project.depositEndTs.toNumber());
      await expect(
        this.contracts.controller.deposit(VALID_PROJECT_ID, depositAmount)
      ).to.be.revertedWith("Deposit_Ended()");
    });
  });
}
