import { Signer } from "ethers";
import {
  Controller,
  IERC20,
  NftBond,
  SwapHelper,
  UniswapV3RouterMock,
} from "../../typechain-types";
import {
  deployController,
  deployNftBond,
  deployRouter,
  deploySwapHelper,
} from "../utils/deploy";
import { getUSDCContract } from "./../utils/tokens";

export type ControllerUnitTestFixture = {
  nft: NftBond;
  router: UniswapV3RouterMock;
  usdc: IERC20;
  controller: Controller;
};

export async function controllerUnitTestFixture(
  signers: Signer[]
): Promise<ControllerUnitTestFixture> {
  const deployer: Signer = signers[0];

  const nft = await deployNftBond(deployer);
  const router = await deployRouter(deployer);
  const usdc = await getUSDCContract();
  const controller = await deployController(deployer, nft, router, usdc);

  await nft.init(controller.address);

  return {
    nft: nft,
    router: router,
    usdc: usdc,
    controller: controller,
  };
}

export type SwapHelperUnitTestFixture = {
  swapHelper: SwapHelper;
};

export async function swapHelperUnitTestFixture(
  signers: Signer[]
): Promise<SwapHelperUnitTestFixture> {
  const deployer = signers[0];
  return {
    swapHelper: await deploySwapHelper(deployer),
  };
}
