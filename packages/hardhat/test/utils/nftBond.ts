import { ethers } from "ethers";

export const initProjectInput = {
  uri: "Example uri",
  unit: 10, // 1 USDC
};

export const createLoanInput = {
  amount: ethers.utils.parseUnits("100", 6),
};
