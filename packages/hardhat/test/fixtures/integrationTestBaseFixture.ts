import { Signer } from "ethers";
import {
  Controller,
  ERC20Test,
  NftName,
  UniswapV3QuoterMock,
  UniswapV3RouterMock,
} from "../../typechain-types";
import {
  deployController,
  deployNftName,
  deployQuoter,
  deployRouter,
  deployUsdc,
} from "../utils/deploy";

export type IntegrationTestFixture = {
  nft: NftName;
  quoter: UniswapV3QuoterMock;
  router: UniswapV3RouterMock;
  usdc: ERC20Test;
  controller: Controller;
};

export async function integrationTestFixture(
  signers: Signer[]
): Promise<IntegrationTestFixture> {
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

  return {
    nft: nft,
    quoter: quoter,
    router: router,
    usdc: usdc,
    controller: controller,
  };
}
