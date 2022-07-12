import { Signer } from "ethers";
import {
  Controller,
  IERC20,
  NftBond,
  UniswapV3RouterMock,
} from "../../typechain-types";
import { deployController, deployNftBond, deployRouter } from "../utils/deploy";
import { getUSDCContract } from "./../utils/tokens";

export type IntegrationTestFixture = {
  nft: NftBond;
  router: UniswapV3RouterMock;
  usdc: IERC20;
  controller: Controller;
};

export async function integrationTestFixture(
  signers: Signer[]
): Promise<IntegrationTestFixture> {
  const deployer: Signer = signers[0];

  const nft = await deployNftBond(deployer);
  const router = await deployRouter(deployer);
  const usdc = await getUSDCContract(); // Use mainnet usdc address
  const controller = await deployController(deployer, nft, router, usdc);

  await nft.init(controller.address);

  return {
    nft: nft,
    router: router,
    usdc: usdc,
    controller: controller,
  };
}
