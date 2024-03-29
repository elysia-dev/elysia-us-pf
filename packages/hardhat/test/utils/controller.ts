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
}

export const initProjectInput = {
  totalAmount: ethers.utils.parseUnits("1000", USDC.decimal),
  depositStartTs: Math.floor(Date.now() / 1000) + 10,
  depositEndTs: Math.floor(Date.now() / 1000) + 20,
  unit: 10,
  uri: "Example uri",
};

export const repayInput = {
  finalAmount: initProjectInput.totalAmount.mul(2),
};

export async function initProject(controller: Controller): Promise<TProject> {
  await controller.initProject(
    initProjectInput.totalAmount,
    initProjectInput.depositStartTs,
    initProjectInput.depositEndTs,
    initProjectInput.unit,
    initProjectInput.uri
  );

  const project = await controller.projects(VALID_PROJECT_ID);

  return {
    totalAmount: project.totalAmount,
    currentAmount: project.currentAmount,
    depositStartTs: project.depositStartTs,
    depositEndTs: project.depositEndTs,
    finalAmount: project.finalAmount,
  };
}
