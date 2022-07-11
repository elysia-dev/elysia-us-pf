import { expect } from "chai";
import { ethers } from "ethers";
import { VALID_PROJECT_ID } from "./../utils/constants";
import { initProjectInput } from "./../utils/controller";
import { createLoanInput } from "./../utils/nftBond";

export function redeemTest(): void {
  const projectId = VALID_PROJECT_ID;

  beforeEach("init project and create loan", async function () {
    const { controller, nftBond } = this.contracts;

    await this.contracts.nftBond
      .connect(this.accounts.deployer)
      .initProject(initProjectInput.uri, 10 ** 6);

    await this.contracts.nftBond
      .connect(this.accounts.controller)
      .createLoan(
        projectId,
        createLoanInput.amount,
        this.accounts.alice.address
      );
  });

  describe("depositTest", async function () {
    it.only("should emit redeem and burn event", async function () {
      const redeemAmount = 1;

      const tx = await this.contracts.nftBond
        .connect(this.accounts.controller)
        .redeem(projectId, this.accounts.alice.address, redeemAmount);

      await expect(tx)
        .to.emit(this.contracts.nftBond, "Redeem")
        .to.emit(this.contracts.nftBond, "TransferSingle")
        .withArgs(
          this.contracts.controller.address,
          this.accounts.alice.address,
          ethers.constants.AddressZero,
          projectId,
          redeemAmount
        );
    });
  });
}
