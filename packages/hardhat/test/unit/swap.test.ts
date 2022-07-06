import { expect } from "chai";
import { Contract, utils } from "ethers";
import hre from "hardhat";
import { swapHelperUnitTestFixture } from "../fixtures/controllerUnitTestFixture";

const quoterABI = [
  {
    type: "function",
    name: "quoteExactOutputSingle",
    stateMutability: "view",
    inputs: [
      { type: "address", name: "tokenIn" },
      { type: "address", name: "tokenOut" },
      { type: "uint24", name: "fee" },
      { type: "uint256", name: "amountOut" },
      { type: "uint160", name: "sqrtPriceLimitX96" },
    ],
    outputs: [{ type: "uint256", name: "amountIn" }],
  },
];

const ERC20ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const WETH9 = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  decimal: 18,
};
const USDC = {
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  decimal: 6,
};

export function swapHelperTest(): void {
  describe("", async function () {
    beforeEach(async function () {
      const fixture = await this.loadFixture(swapHelperUnitTestFixture);
      this.contracts.swapHelper = fixture.swapHelper;
    });

    it("should swap ETH to USDC", async function () {
      const signers = await hre.ethers.getSigners();
      const balanceBefore = await signers[0].getBalance();
      const amountOut = utils.parseUnits("10", USDC.decimal);
      const ethIn = utils.parseEther("10");
      const usdcContract = new Contract(
        USDC.address,
        ERC20ABI,
        hre.ethers.provider
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
      // https://etherscan.io/address/0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6
      const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
      const amountOut = utils.parseUnits("10", USDC.decimal);

      const quoterContract = new Contract(
        quoterAddress,
        quoterABI,
        hre.ethers.provider
      );

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
