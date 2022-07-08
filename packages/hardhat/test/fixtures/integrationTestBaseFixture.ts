import { Signer } from "ethers";
import {
  Controller,
  ERC20Test,
  NftBond,
  UniswapV3QuoterMock,
  UniswapV3RouterMock,
} from "../../typechain-types";
import {
  deployController,
  deployNftBond,
  deployQuoter,
  deployRouter,
  deployUsdc,
} from "../utils/deploy";

export type IntegrationTestFixture = {
  nft: NftBond;
  quoter: UniswapV3QuoterMock;
  router: UniswapV3RouterMock;
  usdc: ERC20Test;
  controller: Controller;
};

export async function integrationTestFixture(
  signers: Signer[]
): Promise<IntegrationTestFixture> {
  const deployer: Signer = signers[0];

  const nft = await deployNftBond(deployer);
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
