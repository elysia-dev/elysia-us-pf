import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  Controller,
  ERC20Test,
  NftBond,
  SwapHelper,
  UniswapV3QuoterMock,
  UniswapV3RouterMock,
} from "../../typechain-types";

export interface Contracts {
  usdc: ERC20Test;
  NftBond: NftBond;
  router: UniswapV3RouterMock;
  quoter: UniswapV3QuoterMock;
  controller: Controller;
  swapHelper: SwapHelper;
}

export interface Accounts {
  deployer: SignerWithAddress;
  controller: SignerWithAddress;
  alice: SignerWithAddress;
}
