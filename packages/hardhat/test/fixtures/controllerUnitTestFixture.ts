import { Signer } from "ethers";
import { Controller, IERC20, NftBond, SwapHelper } from "../../typechain-types";
import {
  deployController,
  deployNftBond,
  deploySwapHelper,
} from "../utils/deploy";
import { getUSDCContract } from "../utils/tokens";

export type ControllerUnitTestFixture = {
  nft: NftBond;
  // quoter: UniswapV3QuoterMock;
  // router: UniswapV3RouterMock;
  usdc: IERC20;
  controller: Controller;
};

export async function controllerUnitTestFixture(
  signers: Signer[]
): Promise<ControllerUnitTestFixture> {
  const deployer: Signer = signers[0];

  const nft = await deployNftBond(deployer);
  /*
  const quoter = await deployQuoter(deployer);
  const router = await deployRouter(deployer);
  */
  const controller = await deployController(deployer, nft);
  const usdc = await getUSDCContract();

  await nft.init(controller.address);

  return {
    nft: nft,
    // quoter: quoter,
    // router: router,
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
