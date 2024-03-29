import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  Controller,
  IERC20,
  NftBond,
  SwapHelper,
  UniswapV3QuoterMock,
  UniswapV3RouterMock,
} from "../../typechain-types";

export interface Contracts {
  usdc: IERC20;
  nftBond: NftBond;
  router: UniswapV3RouterMock;
  quoter: UniswapV3QuoterMock;
  controller: Controller;
  swapHelper: SwapHelper;
}

export interface Accounts {
  deployer: SignerWithAddress;
  // accounts.controller is a test stub for the controller contract in unit tests where it is not deployed.
  controller: SignerWithAddress;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  carol: SignerWithAddress;
}
