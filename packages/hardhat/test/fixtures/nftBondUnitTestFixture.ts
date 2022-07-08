import { Signer } from "ethers";
import { NftBond } from "../../typechain-types";
import { deployNftBond } from "../utils/deploy";

export type NftBondUnitTestFixture = {
  nft: NftBond;
};

export async function NftBondUnitTestFixture(
  signers: Signer[]
): Promise<NftBondUnitTestFixture> {
  const deployer: Signer = signers[0];

  const nft = await deployNftBond(deployer);

  return {
    nft: nft,
  };
}
