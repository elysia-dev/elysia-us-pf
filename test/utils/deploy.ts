import {
  Controller,
  Controller__factory,
  ERC20Test,
  ERC20Test__factory,
  NftName,
  NftName__factory,
  UniswapV3QuoterMock,
  UniswapV3QuoterMock__factory,
  UniswapV3RouterMock,
  UniswapV3RouterMock__factory,
} from "../../typechain-types";
import { ethers } from "hardhat";
import { Signer } from "ethers";

export async function deployUsdc(deployer: Signer): Promise<ERC20Test> {
  const factory = new ERC20Test__factory(deployer);

  return await factory.deploy(ethers.utils.parseUnits("1", 36), "Test", "Test");
}

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

export async function deployNftName(deployer: Signer): Promise<NftName> {
  const factory = new NftName__factory(deployer);

  return await factory.deploy();
}

export async function deployController(
  deployer: Signer,
  nftname: NftName,
  router: UniswapV3RouterMock,
  quoter: UniswapV3QuoterMock,
  usdc: ERC20Test
): Promise<Controller> {
  const factory = new Controller__factory(deployer);

  // We don't need weth in local test
  const weth = ethers.constants.AddressZero;

  return await factory.deploy(
    nftname.address,
    router.address,
    quoter.address,
    usdc.address,
    weth
  );
}
