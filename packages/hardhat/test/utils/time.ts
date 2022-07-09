import { BigNumberish } from "ethers";
import { ethers } from "hardhat";

export async function advanceTimeTo(timestamp: BigNumberish) {
  await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);
  await ethers.provider.send("evm_mine", []);
}
