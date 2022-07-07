import { controllerUnitTestFixture } from "../fixtures/controllerUnitTestFixture";
import { controllerTest } from "./controller/controller.test";
import { nftNameTest } from "./nftName/nftName.test";
import { swapHelperTest } from "./swap.test";

export function unitTest(): void {
  describe("Elysia US PF NFT unit test", async function () {
    this.beforeEach(async function () {});

    controllerTest();
    nftNameTest();
    // swapHelperTest();
  });
}
