import { Controller, ERC20 } from "../../typechain-types";
import { task } from "hardhat/config";
import "hardhat-deploy";

const repay = task("repay", "repay a project")
  .addParam("projectId", "projectId")
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

    const projectId = taskArgs.projectId;

    const repayAmount = hre.ethers.utils.parseUnits("561600", "6");
    await usdc.approve(controller.address, repayAmount);
    const tx = await controller.repay(projectId, repayAmount);
    console.log(tx);

    const usdcBalanceAfter = await usdc.balanceOf(deployer);
    console.log(`usdcBalanceAfter: ${usdcBalanceAfter}`);

    const controllertUsdcBalance = await usdc.balanceOf(controller.address);
    console.log(`controllertUsdcBalance: ${controllertUsdcBalance}`);
  });

export default repay;
