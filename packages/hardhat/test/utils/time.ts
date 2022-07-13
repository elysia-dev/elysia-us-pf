import { ethers } from "hardhat";

export async function advanceTimeTo(timestamp: number) {
  await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);
  await ethers.provider.send("evm_mine", []);
  /*
  const secondsToIncrease = timestamp - (await getTimestamp());
  await ethers.provider.send("evm_increaseTime", [secondsToIncrease]);
  return await ethers.provider.send("evm_mine", []);
  */
}

export async function getTimestamp() {
  const block = await ethers.provider.getBlock("latest");
  console.log(`blockNumber: ${block.number}`);
  return block.timestamp;
}
