import { Controller } from "../../typechain-types";
import { task } from "hardhat/config";
import "hardhat-deploy";

const getProject = task("getProject", "get a project in controller").setAction(
  async function (taskArgs, hre, runSuper) {
    const controllerDeployment = await hre.deployments.get("Controller");

    const controller = (await hre.ethers.getContractAt(
      controllerDeployment.abi,
      controllerDeployment.address
    )) as Controller;

    const project = await controller.projects(0);
    console.log(project);
  }
);

export default getProject;
