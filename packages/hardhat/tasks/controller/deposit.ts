import { Controller } from "../../typechain-types";
import { task } from "hardhat/config";
import "hardhat-deploy";

const deposit = task("deposit", "deposit a project")
  .addParam("projectId", "projectId")
  .setAction(async function (taskArgs, hre, runSuper) {
    const controllerDeployment = await hre.deployments.get("Controller");

    const controller = (await hre.ethers.getContractAt(
      controllerDeployment.abi,
      controllerDeployment.address
    )) as Controller;

    const projectId = taskArgs.projectId;
    const depositAmount = hre.ethers.utils.parseUnits("10", 6);
    const tx = await controller.deposit(projectId, depositAmount, {
      value: 10n ** 17n, // 0.1 ETH
    });

    console.log(tx);
  });

export default deposit;
