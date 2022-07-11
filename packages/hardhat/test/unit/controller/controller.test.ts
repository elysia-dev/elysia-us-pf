import { controllerUnitTestFixture } from "../../fixtures/controllerUnitTestFixture";
import { shouldBehaveLikeFinalizeRepay } from "./shoudBegaveLikeFinalizeRepay";
import { shouldBeAbleToDeposit } from "./shouldBeAbleToDeposit";
import { shouldBeAbleToWithdraw } from "./shouldBeAbleToWithdraw";
import { shouldBehaveLikeInitProject } from "./shouldBehaveLikeInitProject";
import { shouldBehaveLikeRepay } from "./shouldBehaveLikeRepay";

export function controllerTest(): void {
  describe("controllerTest", async function () {
    this.beforeEach(async function () {
      const fixture = await this.loadFixture(controllerUnitTestFixture);

      this.contracts.nftBond = fixture.nft;
      this.contracts.router = fixture.router;
      this.contracts.quoter = fixture.quoter;
      this.contracts.usdc = fixture.usdc;
      this.contracts.controller = fixture.controller;
    });

    describe("Controller:Effect", async function () {
      shouldBehaveLikeInitProject();
      shouldBeAbleToDeposit();
      shouldBeAbleToWithdraw();
      shouldBehaveLikeRepay();
      shouldBehaveLikeFinalizeRepay();
    });
  });
}
