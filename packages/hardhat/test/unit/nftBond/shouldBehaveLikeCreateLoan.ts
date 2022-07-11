import { expect } from "chai";
import { ethers } from "hardhat";
import { INITIAL_NFT_ID, VALID_PROJECT_ID } from "../../utils/constants";
import { INVALID_PROJECT_ID } from "./../../utils/constants";

const initProjectInput = {
  baseUri: "base Uri",
  decimal: 6, // USDC
};
const createLoanInput = {
  amount: ethers.utils.parseEther("10"),
};

export function shouldBehaveLikeCreateLoan(): void {
  describe("shouldBehaveLikeCreateLoan", async function () {
    const projectId = INVALID_PROJECT_ID;

    beforeEach(
      "set controller and init. valid project id is 1",
      async function () {
        await this.contracts.NftBond.connect(this.accounts.deployer).init(
          this.accounts.controller.address
        );
        await this.contracts.NftBond.connect(
          this.accounts.controller
        ).initProject(initProjectInput.baseUri, initProjectInput.decimal);
      }
    );

    it("should revert if the caller is not the controller", async function () {});

    it("should revert if the project is not valid", async function () {});

    context("success", function () {
      const createLoan = async () => {
        return await this.ctx.contracts.NftBond.connect(
          this.ctx.accounts.controller
        ).createLoan(
          VALID_PROJECT_ID,
          createLoanInput.amount,
          this.ctx.accounts.alice.address
        );
      };

      it("should emit event both Transfer and CreateLoan", async function () {
        const tx = await createLoan();
        const { alice } = this.accounts;

        expect(tx)
          .to.emit(this.contracts.NftBond, "Transfer")
          .withArgs(ethers.constants.AddressZero, alice.address, INITIAL_NFT_ID)
          .to.emit(this.contracts.NftBond, "CreateLoan");

        expect(
          await this.contracts.NftBond.balanceOf(alice.address, INITIAL_NFT_ID)
        ).to.equal(alice.address);
      });

      it("should mint nft to account", async function () {
        const { alice } = this.accounts;
        await createLoan();
        expect(
          await this.contracts.NftBond.balanceOf(alice.address, INITIAL_NFT_ID)
        ).to.equal(alice.address);
      });

      /*
      it("should set loan principal and loan info", async function () {
        await createLoan();
        expect(await this.contracts.NftBond.loanInfo(INITIAL_NFT_ID)).to.equal(
          VALID_PROJECT_ID
        );
        expect(
          await this.contracts.NftBond.loanPrincipal(INITIAL_NFT_ID)
        ).to.equal(createLoanInput.amount);
      });
      */

      // Token
      xit("should increase token id and increased id should be applied to next nft", async function () {
        await createLoan();
        expect(await this.contracts.NftBond.tokenIdCounter()).to.equal(
          INITIAL_NFT_ID + 1
        );
      });
    });
  });
}
