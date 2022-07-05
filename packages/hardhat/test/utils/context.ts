import { Fixture } from "ethereum-waffle";
import { Accounts, Contracts } from "./types";

declare module "mocha" {
  interface Context {
    contracts: Contracts;
    accounts: Accounts;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
  }
}
