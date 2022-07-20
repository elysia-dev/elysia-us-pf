import { NftBond } from "./../../typechain-types";
import { task } from "hardhat/config";
import "hardhat-deploy";

const initTask = task("nftBondInit", "initialize nft bond contract").setAction(
  async function (taskArgs, hre, runSuper) {
    const nftBondDeployment = await hre.deployments.get("NftBond");
    const controllerDeployment = await hre.deployments.get("Controller");
    const nftBond = (await hre.ethers.getContractAt(
      nftBondDeployment.abi,
      nftBondDeployment.address
    )) as NftBond;

    const tx = await nftBond.init(controllerDeployment.address);
    console.log(tx);
  }
);

export default initTask;
