import { Signer } from "ethers";
import hre from "hardhat";
import { Controller, IERC20, NftBond } from "../../typechain-types";
import { deployController, deployNftBond } from "../utils/deploy";
import { getUSDCContract } from "./../utils/tokens";

export type IntegrationTestFixture = {
  nft: NftBond;
  usdc: IERC20;
  controller: Controller;
};

export async function integrationTestFixture(
  signers: Signer[]
): Promise<IntegrationTestFixture> {
  const deployer: Signer = signers[0];
  const { get } = hre.deployments;

  const nft = await deployNftBond(deployer);
  const usdc = await getUSDCContract(); // Use mainnet usdc address
  const controller = await deployController(deployer, nft);

  await nft.init(controller.address);

  return {
    nft: nft,
    usdc: usdc,
    controller: controller,
  };
}
