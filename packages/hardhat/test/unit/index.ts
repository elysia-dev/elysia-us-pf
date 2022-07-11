import { controllerTest } from "./controller/controller.test";
import { NftBondTest } from "./nftBond/nftBond.test";

export function unitTest(): void {
  describe("Elysia US PF NFT unit test", async function () {
    this.beforeEach(async function () {});

    controllerTest();
    NftBondTest();
    // swapHelperTest();
  });
}
