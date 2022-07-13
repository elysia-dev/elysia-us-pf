import { expect } from "chai";
import { ethers } from "ethers";
import { INVALID_PROJECT_ID, VALID_PROJECT_ID } from "../../utils/constants";
import { initProjectInput } from "./../../utils/controller";
import { createLoanInput } from "./../../utils/nftBond";

export function shouldBehaveLikeRedeem(): void {
  describe("shouldBehaveLikeRedeem", async function () {
    const projectId = VALID_PROJECT_ID;
    const invalidProjectId = INVALID_PROJECT_ID;

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

    it("should revert if the caller is not the controller", async function () {
      await expect(
        this.contracts.nftBond
          .connect(this.accounts.alice)
          .redeem(projectId, this.accounts.alice.address, 1)
      ).to.reverted;
    });

    it("should revert if the project does not exist", async function () {
      await expect(
        this.contracts.nftBond
          .connect(this.accounts.alice)
          .redeem(invalidProjectId, this.accounts.alice.address, 1)
      ).to.be.reverted;
    });

    it("should revert if the account is not nft holder", async function () {
      await expect(
        this.contracts.nftBond
          .connect(this.accounts.bob)
          .redeem(projectId, this.accounts.alice.address, 1)
      ).to.be.reverted;
    });

    describe("success", async function () {
      it("should burn nft", async function () {
        const { alice, controller } = this.accounts;
        const { nftBond } = this.contracts;

        const redeemAmount = 1;
        const balanceBefore = (
          await nftBond.balanceOf(alice.address, projectId)
        ).toNumber();

        await nftBond
          .connect(controller)
          .redeem(projectId, alice.address, redeemAmount);

        const balanceAfter = (
          await nftBond.balanceOf(alice.address, projectId)
        ).toNumber();

        expect(balanceBefore - balanceAfter).eq(1);
      });

      it("should emit redeem and burn event", async function () {
        const redeemAmount = 1;
        const { nftBond } = this.contracts;

        const tx = await nftBond
          .connect(this.accounts.controller)
          .redeem(projectId, this.accounts.alice.address, redeemAmount);

        await expect(tx)
          .to.emit(this.contracts.nftBond, "Redeem")
          .to.emit(this.contracts.nftBond, "TransferSingle")
          .withArgs(
            this.accounts.controller.address,
            this.accounts.alice.address,
            ethers.constants.AddressZero,
            projectId,
            redeemAmount
          );
      });
    });
  });
}
