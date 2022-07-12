import { Signer } from "ethers";
import { ethers } from "hardhat";
import {
  Controller,
  Controller__factory,
  IERC20,
  NftBond,
  NftBond__factory,
  SwapHelper,
  SwapHelper__factory,
  UniswapV3QuoterMock,
  UniswapV3QuoterMock__factory,
  UniswapV3RouterMock,
  UniswapV3RouterMock__factory,
} from "../../typechain-types";

// Not used
/*
export async function deployUsdc(deployer: Signer): Promise<ERC20Test> {
  const factory = new ERC20Test__factory(deployer);

  return await factory.deploy(ethers.utils.parseUnits("1", 36), "Test", "Test");
}
*/

export async function deployRouter(
  deployer: Signer
): Promise<UniswapV3RouterMock> {
  const factory = new UniswapV3RouterMock__factory(deployer);

  return await factory.deploy();
}

export async function deployQuoter(
  deployer: Signer
): Promise<UniswapV3QuoterMock> {
  const factory = new UniswapV3QuoterMock__factory(deployer);

  return await factory.deploy();
}

export async function deployNftBond(deployer: Signer): Promise<NftBond> {
  const factory = new NftBond__factory(deployer);

  return await factory.deploy();
}

export async function deployController(
  deployer: Signer,
  NftBond: NftBond,
  router: UniswapV3RouterMock,
  usdc: IERC20
): Promise<Controller> {
  const factory = new Controller__factory(deployer);

  // We don't need weth in local test
  const weth = ethers.constants.AddressZero;

  return await factory.deploy(
    NftBond.address,
    router.address,
    usdc.address,
    weth
  );
}

export async function deploySwapHelper(deployer: Signer): Promise<SwapHelper> {
  const factory = new SwapHelper__factory(deployer);
  return factory.deploy();
}
