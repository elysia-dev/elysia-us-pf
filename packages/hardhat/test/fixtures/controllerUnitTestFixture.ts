import { Signer } from "ethers";
import {
  Controller,
  ERC20Test,
  NftName,
  SwapHelper,
  UniswapV3QuoterMock,
  UniswapV3RouterMock,
} from "../../typechain-types";
import {
  deployController,
  deployNftName,
  deployQuoter,
  deployRouter,
  deploySwapHelper,
  deployUsdc,
} from "../utils/deploy";

export type ControllerUnitTestFixture = {
  nft: NftName;
  quoter: UniswapV3QuoterMock;
  router: UniswapV3RouterMock;
  usdc: ERC20Test;
  controller: Controller;
};

export async function controllerUnitTestFixture(
  signers: Signer[]
): Promise<ControllerUnitTestFixture> {
  const deployer: Signer = signers[0];

  const nft = await deployNftName(deployer);
  const quoter = await deployQuoter(deployer);
  const router = await deployRouter(deployer);
  const usdc = await deployUsdc(deployer);
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
