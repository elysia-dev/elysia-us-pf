import { expect } from "chai";
import { ethers } from "hardhat";

const initProjectInput = {
  targetAmount: ethers.utils.parseEther("10"),
  startTimestamp: Date.now() + 10,
  endTimestamp: Date.now() + 20,
  baseUri: "baseUri",
};

const finalAmount = ethers.utils.parseEther("20");

export function repayTest(): void {
  describe("repayTest", async function () {
    beforeEach("init project and approve", async function () {
      await this.contracts.controller
        .connect(this.accounts.deployer)
        .initProject(
          initProjectInput.targetAmount,
          initProjectInput.startTimestamp,
          initProjectInput.endTimestamp,
          initProjectInput.baseUri
        );

      await this.contracts.usdc
        .connect(this.accounts.deployer)
        .approve(this.contracts.controller.address, finalAmount);
    });

    describe("success", async function () {
      it("should transfer usdc", async function () {
        const beforeBalance = await this.contracts.usdc.balanceOf(
          this.contracts.controller.address
        );

        const tx = await this.contracts.controller
          .connect(this.accounts.deployer)
          .repay(1, finalAmount);

        expect(
          await this.contracts.usdc.balanceOf(this.contracts.controller.address)
        ).to.equal(beforeBalance.add(finalAmount));

        expect(tx)
          .to.emit(this.contracts.usdc, "Transfer")
          .withArgs(
            this.accounts.deployer,
            this.contracts.controller,
            finalAmount
          );
      });
    });
  });
}
