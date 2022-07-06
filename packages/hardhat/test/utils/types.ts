import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  Controller,
  ERC20Test,
  NftName,
  UniswapV3QuoterMock,
  UniswapV3RouterMock,
} from "../../typechain-types";
import { SwapHelper } from "./../../typechain-types/contracts/SwapHelper";

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
  minter: SignerWithAddress;
  alice: SignerWithAddress;
}
