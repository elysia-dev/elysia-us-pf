import { integrationTestFixture } from "../fixtures/integrationTestBaseFixture";
import { initProjectInput } from "../utils/controller";
import { advanceTimeTo, getTimestamp } from "../utils/time";
import { borrowTest } from "./borrow.test";
import { depositTest } from "./deposit.test";
import { repayTest } from "./repay.test";
import { withdrawTest } from "./withdraw.test";

export function integrationTest(): void {
  describe("Elysia US PF NFT integration test", async function () {
    this.beforeEach(async function () {
      const fixture = await this.loadFixture(integrationTestFixture);

      this.contracts.nftBond = fixture.nft;
      this.contracts.router = fixture.router;
      this.contracts.quoter = fixture.quoter;
      this.contracts.usdc = fixture.usdc;
      this.contracts.controller = fixture.controller;
      const ts = await getTimestamp();
      console.log(`current: ${ts}`);

      await advanceTimeTo(initProjectInput.depositStartTs);
    });

    depositTest();
    withdrawTest();
    repayTest();
    borrowTest();
  });
}
