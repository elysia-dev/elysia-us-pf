import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";
import { Contract } from "ethers";

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

// https://etherscan.io/address/0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6
const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
export const getUniswapV3QuoterContract = (
  provider: HardhatEthersHelpers["provider"]
) => new Contract(quoterAddress, quoterABI, provider);
