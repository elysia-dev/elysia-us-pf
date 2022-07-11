import { Signer } from "ethers";
import {
  Controller,
  IERC20,
  NftBond,
  UniswapV3QuoterMock,
  UniswapV3RouterMock,
} from "../../typechain-types";
import {
  deployController,
  deployNftBond,
  deployQuoter,
  deployRouter,
} from "../utils/deploy";
import { getUSDCContract } from "./../utils/tokens";

export type IntegrationTestFixture = {
  nft: NftBond;
  quoter: UniswapV3QuoterMock;
  router: UniswapV3RouterMock;
  usdc: IERC20;
  controller: Controller;
};

export async function integrationTestFixture(
  signers: Signer[]
): Promise<IntegrationTestFixture> {
  const deployer: Signer = signers[0];

  const nft = await deployNftBond(deployer);
  const quoter = await deployQuoter(deployer);
  const router = await deployRouter(deployer);
  const usdc = await getUSDCContract(); // Use mainnet usdc address
  const controller = await deployController(
    deployer,
    nft,
    router,
    quoter,
    usdc
  );

  await nft.init(controller.address);

  return {
    nft: nft,
    quoter: quoter,
    router: router,
    usdc: usdc,
    controller: controller,
  };
}
