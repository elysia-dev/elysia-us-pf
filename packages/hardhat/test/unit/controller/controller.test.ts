import { controllerUnitTestFixture } from "../../fixtures/controllerUnitTestFixture";
import { swapHelperTest } from "../swap.test";
import { shouldBehaveLikeInitProject } from "./shouldBehaveLikeInitProject";

export function controllerTest(): void {
  describe("Elysia US PF NFT unit test", async function () {
    this.beforeEach(async function () {
      const fixture = await this.loadFixture(controllerUnitTestFixture);

      this.contracts.nftname = fixture.nft;
      this.contracts.router = fixture.router;
      this.contracts.quoter = fixture.quoter;
      this.contracts.usdc = fixture.usdc;
      this.contracts.controller = fixture.controller;
    });

    describe("Controller:Effect", async function () {
      shouldBehaveLikeInitProject();
    });
  });
}
