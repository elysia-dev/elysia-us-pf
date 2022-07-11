import { NftBondUnitTestFixture } from "../../fixtures/NftBondUnitTestFixture";
import { shouldBehaveLikeCreateLoan } from "./shouldBehaveLikeCreateLoan";
import { shouldBehaveLikeRedeem } from "./shouldBehaveLikeRedeem";

export function NftBondTest(): void {
  describe("NftBondTest", async function () {
    this.beforeEach(async function () {
      const fixture = await this.loadFixture(NftBondUnitTestFixture);

      this.contracts.NftBond = fixture.nft;
    });

    describe("NftBond:Effect", async function () {
      shouldBehaveLikeCreateLoan();
      shouldBehaveLikeRedeem();
    });
  });
}
