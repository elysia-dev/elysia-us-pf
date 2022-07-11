import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Controller } from "./../../typechain-types";
import { VALID_PROJECT_ID } from "./constants";
import { USDC } from "./tokens";

export interface TProject {
  totalAmount: BigNumber;
  currentAmount: BigNumber;
  depositStartTs: BigNumber;
  depositEndTs: BigNumber;
  finalAmount: BigNumber;
  repayed: boolean;
}

export const initProjectInput = {
  targetAmount: ethers.utils.parseUnits("1000", USDC.decimal),
  depositStartTs: Date.now() + 10,
  depositEndTs: Date.now() + 20,
  baseUri: "baseUri",
};

export const finalAmount = ethers.utils.parseUnits("2000", USDC.decimal);

export async function initProject(controller: Controller): Promise<TProject> {
  await controller.initProject(
    initProjectInput.targetAmount,
    initProjectInput.depositStartTs,
    initProjectInput.depositEndTs,
    initProjectInput.baseUri
  );

  const project = await controller.projects(VALID_PROJECT_ID);

  return {
    totalAmount: project.totalAmount,
    currentAmount: project.currentAmount,
    depositStartTs: project.depositStartTs,
    depositEndTs: project.depositEndTs,
    finalAmount: project.finalAmount,
    repayed: project.repayed,
  };
}
