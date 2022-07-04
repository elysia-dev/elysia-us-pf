import { controllerUnitTestFixture } from "../fixtures/controllerUnitTestFixture";

export function unitTest(): void {
  describe("Decipher NFT unit test", async function () {
    this.beforeEach(async function () {
      const fixture = await this.loadFixture(controllerUnitTestFixture);

      this.contracts.nftname = fixture.nft;
      this.contracts.router = fixture.router;
      this.contracts.quoter = fixture.quoter;
      this.contracts.usdc = fixture.usdc;
      this.contracts.controller = fixture.controller;
    });

    describe("Mint Test", function () {});
  });
}
