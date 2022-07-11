import { expect } from "chai";
import { ethers } from "hardhat";
import { INITIAL_NFT_ID, VALID_PROJECT_ID } from "../../utils/constants";
import { createLoanInput, initProjectInput } from "../../utils/nftBond";

export function shouldBehaveLikeCreateLoan(): void {
  describe("shouldBehaveLikeCreateLoan", async function () {
    const projectId = VALID_PROJECT_ID;

    beforeEach(
      "set controller and init. valid project id is 0",
      async function () {
        await this.contracts.nftBond
          .connect(this.accounts.deployer)
          .init(this.accounts.controller.address);
        await this.contracts.nftBond
          .connect(this.accounts.controller)
          .initProject(initProjectInput.uri, initProjectInput.unit);
      }
    );

    it("should revert if the caller is not the controller", async function () {});

    it("should revert if the project is not valid", async function () {});

    it("should revert if the depositAmount is not divisible by unit", async function () {
      const { alice, controller } = this.accounts;
      const { nftBond } = this.contracts;
      await expect(
        nftBond
          .connect(controller)
          .createLoan(VALID_PROJECT_ID, 900000, alice.address)
      ).to.be.revertedWith("NotDivisibleByUnit()");
    });

    context("success", function () {
      const createLoan = async () => {
        return await this.ctx.contracts.nftBond
          .connect(this.ctx.accounts.controller)
          .createLoan(
            projectId,
            createLoanInput.amount,
            this.ctx.accounts.alice.address
          );
      };

      it("should emit event both Transfer and CreateLoan", async function () {
        const tx = await createLoan();
        const { alice } = this.accounts;

        expect(tx)
          .to.emit(this.contracts.nftBond, "Transfer")
          .withArgs(ethers.constants.AddressZero, alice.address, INITIAL_NFT_ID)
          .to.emit(this.contracts.nftBond, "CreateLoan");

        expect(
          await this.contracts.nftBond.balanceOf(alice.address, INITIAL_NFT_ID)
        ).to.equal(createLoanInput.amount.div(initProjectInput.unit));
      });

      it("should mint nft to account", async function () {
        const { alice } = this.accounts;
        await createLoan();
        expect(
          await this.contracts.nftBond.balanceOf(alice.address, INITIAL_NFT_ID)
        ).to.equal(createLoanInput.amount.div(initProjectInput.unit));
      });

      it("should increase token id and increased id should be applied to next nft", async function () {
        await createLoan();
        expect(await this.contracts.nftBond.tokenIdCounter()).to.equal(
          INITIAL_NFT_ID + 1
        );
      });
    });
  });
}
