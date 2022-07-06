import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldBeAbleToDeposit(): void {
  const projectId = 0;
  const depositAmount = 10 ** 6;

  describe("should be able to deposit", async function () {
    this.beforeEach(async function () {
      const initProjectInput = {
        targetAmount: ethers.utils.parseEther("10"),
        depositStartTs: Date.now() + 10,
        depositEndTs: Date.now() + 20,
        baseUri: "baseUri",
      };

      await this.contracts.controller.initProject(
        initProjectInput.targetAmount,
        initProjectInput.depositStartTs,
        initProjectInput.depositEndTs,
        initProjectInput.baseUri
      );
    });

    it("should revert if the depositAmount is not divisible by $1", async function () {
      await expect(
        this.contracts.controller.deposit(projectId, 900000)
      ).to.be.revertedWith("Deposit_NotDivisibleByDollar()");
    });

    it("should revert if the project is not initialized", async function () {
      await expect(
        this.contracts.controller.deposit(projectId + 1, depositAmount)
      ).to.be.revertedWith("NotExistingProject()");
    });

    it("should revert if the project has not started yet", async function () {
      await expect(
        this.contracts.controller.deposit(projectId, depositAmount)
      ).to.be.revertedWith("Deposit_NotStarted()");
    });

    it("should revert if the project has finished already", async () => {});

    it("should increment the currentAmount of the project by the deposited amount", async () => {});

    // TODO
    xit("should mint NFT", async () => {});

    context("when a user deposits with USDC", function () {
      it("should transfer USDC from the user to itself", async () => {});
    });

    context("when a user deposits with ETH", function () {
      it("should swap ETH to USDC", async () => {});
    });
  });
}
