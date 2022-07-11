import { expect } from "chai";
import { BigNumber } from "ethers";
import { initProject, initProjectInput } from "../../utils/controller";
import { VALID_PROJECT_ID } from "./../../utils/constants";

export function shouldBehaveLikeInitProject(): void {
  describe("shouldBehaveLikeInitProject", async function () {
    beforeEach(async function () {});

    xit("should revert if the caller is not admin", async function () {});

    xit("should revert if input timestamps are invalid", async function () {});

    xit("should increase numberOfProject", async function () {});

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

    it("should emit NewProject event", async function () {});
  });
}
