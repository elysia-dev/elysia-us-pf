import { integrationTestFixture } from "../fixtures/integrationTestBaseFixture";
import { borrowTest } from "./borrow.test";
import { depositTest } from "./deposit.test";
import { repayTest } from "./repay.test";
import { scenarioTest } from "./scenario.test";
import { withdrawTest } from "./withdraw.test";

export function integrationTest(): void {
  describe("Elysia US PF NFT integration test", async function () {
    this.beforeEach(async function () {
      const fixture = await this.loadFixture(integrationTestFixture);

      this.contracts.nftBond = fixture.nft;
      this.contracts.usdc = fixture.usdc;
      this.contracts.controller = fixture.controller;
    });

    scenarioTest();
    depositTest();
    withdrawTest();
    repayTest();
    borrowTest();
  });
}
