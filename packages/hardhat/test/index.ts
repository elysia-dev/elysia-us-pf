import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Signer, Wallet } from "ethers";
import { ethers, waffle } from "hardhat";
import { Accounts, Contracts } from "./utils/types";

import { unitTest } from "./unit/index";
import "./utils/context";
import { integrationTest } from "./integration";

describe("Elysia PF Test", function () {
  before(async function () {
    this.contracts = {} as Contracts;
    this.accounts = {} as Accounts;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.accounts.deployer = signers[0];
    this.accounts.controller = signers[1];
    this.accounts.alice = signers[2];

    this.loadFixture = waffle.createFixtureLoader(
      signers as Signer[] as Wallet[]
    );
  });

  // Unit test
  unitTest();
  // Integration test
  integrationTest();
});
