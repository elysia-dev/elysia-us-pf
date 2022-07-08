import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  Controller,
  ERC20Test,
  NftName,
  SwapHelper,
  UniswapV3QuoterMock,
  UniswapV3RouterMock,
} from "../../typechain-types";

export interface Contracts {
  usdc: ERC20Test;
  nftname: NftName;
  router: UniswapV3RouterMock;
  quoter: UniswapV3QuoterMock;
  controller: Controller;
  swapHelper: SwapHelper;
}

export interface Accounts {
  deployer: SignerWithAddress;
  controller: SignerWithAddress;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
}
