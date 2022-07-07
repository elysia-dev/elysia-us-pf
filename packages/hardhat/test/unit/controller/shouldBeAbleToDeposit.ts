import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { ERC20 } from "../../../typechain-types";
import { USDC } from "../../utils/tokens";

export function shouldBeAbleToDeposit(): void {
  const projectId = 0;
  const depositAmount = 10 ** 6;
  const USDC_WHALE = "0x55FE002aefF02F77364de339a1292923A15844B8";

  describe("should be able to deposit", async function () {
    const initProjectInput = {
      targetAmount: ethers.utils.parseEther("10"),
      depositStartTs: Date.now() + 10,
      depositEndTs: Date.now() + 20,
      baseUri: "baseUri",
    };

    this.beforeEach(async function () {
      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [USDC_WHALE],
      });

      const whale = await ethers.getSigner(USDC_WHALE);
      const usdc = (await ethers.getContractAt(
        "IERC20",
        USDC.address
      )) as ERC20;

      usdc.connect(whale).transfer(this.accounts.alice.address, 10n ** 6n);

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

    it("should revert if the project has finished already", async function () {
      await ethers.provider.send("evm_setNextBlockTimestamp", [
        initProjectInput.depositEndTs,
      ]);
      await ethers.provider.send("evm_mine", []);
      await expect(
        this.contracts.controller.deposit(projectId, depositAmount)
      ).to.be.revertedWith("Deposit_Ended()");
    });

    it("should increment the currentAmount of the project by the deposited amount", async function () {});

    // TODO
    xit("should mint NFT", async () => {});

    context("when a user deposits with USDC", function () {
      xit("should transfer USDC from the user to itself", async () => {});
    });

    context("when a user deposits with ETH", function () {
      xit("should swap ETH to USDC", async () => {});
    });
  });
}
