import { expect } from "chai";
import { ethers } from "hardhat";
import { INITIAL_NFT_ID, VALID_PROJECT_ID } from "../../utils/constants";

const initProjectInput = {
  targetAmount: ethers.utils.parseEther("10"),
  startTimestamp: Date.now() + 10,
  endTimestamp: Date.now() + 20,
  baseUri: "baseUri",
};

const createLoanInput = {
  amount: ethers.utils.parseEther("10"),
};

const CREATED_NFT_ID = INITIAL_NFT_ID;

export function shouldBehaveLikeRedeem(): void {
  describe("shouldBehaveLikeRedeem", async function () {
    beforeEach("init project and create loan", async function () {
      await this.contracts.NftBond.connect(this.accounts.deployer).init(
        this.accounts.controller.address
      );
      await this.contracts.NftBond.connect(
        this.accounts.controller
      ).initProject(initProjectInput.endTimestamp, initProjectInput.baseUri);
      await this.contracts.NftBond.connect(this.accounts.controller).createLoan(
        VALID_PROJECT_ID,
        createLoanInput.amount,
        this.accounts.alice.address
      );
    });

    it("should revert if the caller is not the controller", async function () {
      await expect(
        this.contracts.NftBond.connect(this.accounts.alice).redeem(
          CREATED_NFT_ID,
          this.accounts.alice.address
        )
      ).to.reverted;
    });

    it("should revert if the project does not exist", async function () {});

    it("should revert if the account is not nft holder", async function () {});

    describe("success", async function () {
      it("should burn nft", async function () {
        await this.contracts.NftBond.connect(this.accounts.controller).redeem(
          CREATED_NFT_ID,
          this.accounts.alice.address
        );

        await expect(
          this.contracts.NftBond.ownerOf(CREATED_NFT_ID)
        ).to.be.revertedWith("ERC721: invalid token ID");
      });

      it("should emit redeem and burn event", async function () {
        const tx = await this.contracts.NftBond.connect(
          this.accounts.controller
        ).redeem(CREATED_NFT_ID, this.accounts.alice.address);

        expect(tx)
          .to.emit(this.contracts.NftBond, "Redeem")
          .to.emit(this.contracts.NftBond, "Transfer")
          .withArgs(
            this.accounts.alice.address,
            ethers.constants.AddressZero,
            CREATED_NFT_ID
          );
      });
    });
  });
}
