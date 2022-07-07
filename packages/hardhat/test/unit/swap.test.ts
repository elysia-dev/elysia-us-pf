import { expect } from "chai";
import { utils } from "ethers";
import hre from "hardhat";
import { swapHelperUnitTestFixture } from "../fixtures/controllerUnitTestFixture";
import { getUniswapV3QuoterContract } from "../utils/uniswap";
import { USDC, WETH9 } from "./../utils/tokens";

export function swapHelperTest(): void {
  describe("swapHelperTest", async function () {
    beforeEach(async function () {
      const fixture = await this.loadFixture(swapHelperUnitTestFixture);
      this.contracts.swapHelper = fixture.swapHelper;
    });

    it("should swap ETH to USDC", async function () {
      const signers = await hre.ethers.getSigners();
      const balanceBefore = await signers[0].getBalance();
      const amountOut = utils.parseUnits("10", USDC.decimal);
      const ethIn = utils.parseEther("10");
      const usdcContract = await hre.ethers.getContractAt(
        "IERC20",
        USDC.address
      );

      const tx = await this.contracts.swapHelper.swapExactOutputSingle(
        amountOut,
        {
          value: ethIn,
        }
      );
      await tx.wait();

      const balanceAfter = await signers[0].getBalance();
      const usdcBalance = await usdcContract.balanceOf(
        this.contracts.swapHelper.address
      );
      console.log(`usdcBalance: ${usdcBalance}`);

      // check USDC balance
      expect(usdcBalance).eq(amountOut);
    });

    xit("should refund leftover ETH to the user", async () => {});

    xit("should revert if amountInMaximum > given ETH", async () => {});

    // In frontend, amountInMaximum is given as below.
    it("can fetch the spot price using the quoter contract", async () => {
      const quoterContract = getUniswapV3QuoterContract(hre.ethers.provider);
      const amountOut = utils.parseUnits("10", USDC.decimal);

      const quotedAmountOut =
        await quoterContract.callStatic.quoteExactOutputSingle(
          WETH9.address,
          USDC.address,
          500,
          amountOut,
          0
        );

      console.log(`quotedAmountOut: ${quotedAmountOut}`);
    });
  });
}
