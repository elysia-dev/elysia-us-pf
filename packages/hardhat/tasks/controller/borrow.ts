import { Controller, ERC20 } from "../../typechain-types";
import { task } from "hardhat/config";
import "hardhat-deploy";

const borrow = task("borrow", "borrow a project")
  .addParam("projectid", "project id")
  .setAction(async function (taskArgs, hre, runSuper) {
    const { deployer } = await hre.getNamedAccounts();
    const usdcDeployment = await hre.deployments.get("USDC");
    const usdc = (await hre.ethers.getContractAt(
      usdcDeployment.abi,
      usdcDeployment.address
    )) as ERC20;
    const usdcBalanceBefore = await usdc.balanceOf(deployer);
    console.log(`usdcBalanceBefore: ${usdcBalanceBefore}`);

    const controllerDeployment = await hre.deployments.get("Controller");

    const controller = (await hre.ethers.getContractAt(
      controllerDeployment.abi,
      controllerDeployment.address
    )) as Controller;

    const projectId = taskArgs.projectid;
    const tx = await controller.borrow(projectId);
    console.log(tx);
    const receipt = await tx.wait();
    console.log(receipt);

    const usdcBalanceAfter = await usdc.balanceOf(deployer);
    console.log(`usdcBalanceAfter: ${usdcBalanceAfter}`);
  });

export default borrow;
