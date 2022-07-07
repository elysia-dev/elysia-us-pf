import { Signer } from "ethers";
import { NftName } from "../../typechain-types";
import { deployNftName } from "../utils/deploy";

export type NftNameUnitTestFixture = {
  nft: NftName;
};

export async function nftNameUnitTestFixture(
  signers: Signer[]
): Promise<NftNameUnitTestFixture> {
  const deployer: Signer = signers[0];

  const nft = await deployNftName(deployer);

  return {
    nft: nft,
  };
}
