import { controllerUnitTestFixture } from "../../fixtures/controllerUnitTestFixture";
import { nftNameUnitTestFixture } from "../../fixtures/nftNameUnitTestFixture";
import { shouldBehaveLikeCreateLoan } from "./shouldBehaveLikeCreateLoan";
import { shouldBehaveLikeRedeem } from "./shouldBehaveLikeRedeem";

export function nftNameTest(): void {
  describe("nftNameTest", async function () {
    this.beforeEach(async function () {
      const fixture = await this.loadFixture(nftNameUnitTestFixture);

      this.contracts.nftname = fixture.nft;
    });

    describe("NftName:Effect", async function () {
      shouldBehaveLikeCreateLoan();
      shouldBehaveLikeRedeem();
    });
  });
}
