import { expect } from "chai";
import { VALID_PROJECT_ID } from "../../utils/constants";
import { initProjectInput } from "../../utils/nftBond";
import { createLoanInput } from "../../utils/nftBond";

export function shouldBeAbletoSetURI(): void {
  const projectId = VALID_PROJECT_ID;
  describe("setURI", async function () {
    beforeEach("init project and create loan", async function () {
      await this.contracts.nftBond
        .connect(this.accounts.deployer)
        .init(this.accounts.controller.address);

      await this.contracts.nftBond
        .connect(this.accounts.controller)
        .initProject(initProjectInput.uri, initProjectInput.unit);

      await this.contracts.nftBond
        .connect(this.accounts.controller)
        .createLoan(
          projectId,
          createLoanInput.amount,
          this.accounts.alice.address
        );
    });

    it("should be reverted if not owner", async function () {
      const { alice } = this.accounts;
      const { nftBond } = this.contracts;
      await expect(
        nftBond.connect(alice).setURI(projectId, "")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should be executable by the owner", async function () {
      const { deployer: owner } = this.accounts;
      const { nftBond } = this.contracts;
      const uri = "ipfs://xxx";

      expect(await nftBond.uri(projectId)).not.to.eq(uri);
      await nftBond.connect(owner).setURI(projectId, uri);
      expect(await nftBond.uri(projectId)).to.eq(uri);
    });
  });
}
