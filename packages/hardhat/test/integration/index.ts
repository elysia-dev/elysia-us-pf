import { integrationTestFixture } from "../fixtures/integrationTestBaseFixture";
import { borrowTest } from "./borrow.test";
import { depositTest } from "./deposit.test";
import { redeemTest } from "./redeem.test";
import { repayTest } from "./repay.test";

export function integrationTest(): void {
  describe("Elysia US PF NFT integration test", async function () {
    this.beforeEach(async function () {
      const fixture = await this.loadFixture(integrationTestFixture);

      this.contracts.nftBond = fixture.nft;
      this.contracts.router = fixture.router;
      this.contracts.quoter = fixture.quoter;
      this.contracts.usdc = fixture.usdc;
      this.contracts.controller = fixture.controller;
    });

    depositTest();
    repayTest();
    borrowTest();
    redeemTest();
  });
}
