import { Controller } from "../../typechain-types";
import { task } from "hardhat/config";
import "hardhat-deploy";

const initProject = task(
  "initProject",
  "init a project in controller"
).setAction(async function (taskArgs, hre, runSuper) {
  const nftBondDeployment = await hre.deployments.get("NftBond");
  const controllerDeployment = await hre.deployments.get("Controller");

  const controller = (await hre.ethers.getContractAt(
    controllerDeployment.abi,
    controllerDeployment.address
  )) as Controller;

  const ipfsURI = "ipfs://QmbFMxoh5ZmKdTywjgVf7jUj71tTGotk296Gawjf6rNnrp";

  const args =
    hre.network.name !== "mainnet"
      ? {
          totalAmount: hre.ethers.utils.parseUnits("540000", 6),
          depositStartTs: 1658301514,
          depositEndTs: 1659610800, // 2022.08.04 20:00 GMT+09:00
          unit: 10,
          uri: ipfsURI,
        }
      : {
          // mainnet
          totalAmount: hre.ethers.utils.parseUnits("540000", 6),
          depositStartTs: 1658397600, // 2022.07.21 19:00 GMT+09:00
          depositEndTs: 1659610800, // 2022.08.04 20:00 GMT+09:00
          unit: 10,
          uri: ipfsURI,
        };

  const tx = await controller.initProject(
    args.totalAmount,
    args.depositStartTs,
    args.depositEndTs,
    args.unit,
    args.uri
  );

  console.log(tx);
});

export default initProject;
