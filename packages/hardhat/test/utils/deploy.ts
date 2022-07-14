import { Signer } from "ethers";
import {
  Controller,
  Controller__factory,
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

// Use mainnet forking in tests
const routerAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

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
  NftBond: NftBond
): Promise<Controller> {
  const factory = new Controller__factory(deployer);

  return await factory.deploy(
    NftBond.address,
    routerAddress,
    usdcAddress,
    wethAddress
  );
}

export async function deploySwapHelper(deployer: Signer): Promise<SwapHelper> {
  const factory = new SwapHelper__factory(deployer);

  return factory.deploy(routerAddress, usdcAddress, wethAddress);
}
