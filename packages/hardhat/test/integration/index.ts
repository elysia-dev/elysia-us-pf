import { controllerUnitTestFixture } from "../fixtures/controllerUnitTestFixture";
import { borrowTest } from "./borrow.test";
import { repayTest } from "./repay.test";

export function integrationTest(): void {
  describe("Elysia US PF NFT integration test", async function () {
    this.beforeEach(async function () {
      const fixture = await this.loadFixture(controllerUnitTestFixture);

      this.contracts.nftname = fixture.nft;
      this.contracts.router = fixture.router;
      this.contracts.quoter = fixture.quoter;
      this.contracts.usdc = fixture.usdc;
      this.contracts.controller = fixture.controller;
    });

    repayTest();
    borrowTest();
  });
}
