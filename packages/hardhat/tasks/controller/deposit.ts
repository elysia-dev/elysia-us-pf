import { Controller, ERC20 } from "../../typechain-types";
import { task } from "hardhat/config";
import "hardhat-deploy";

const deposit = task("deposit", "deposit a project")
  .addParam("projectId", "projectId")
  .setAction(async function (taskArgs, hre, runSuper) {
    const { deployer } = await hre.getNamedAccounts();
    const controllerDeployment = await hre.deployments.get("Controller");

    const controller = (await hre.ethers.getContractAt(
      controllerDeployment.abi,
      controllerDeployment.address
    )) as Controller;

    const projectId = taskArgs.projectId;
    const depositAmount = hre.ethers.utils.parseUnits("10", 6);
    // deposit in ETH
    const tx = await controller.deposit(projectId, depositAmount, {
      value: 10n ** 17n, // 0.1 ETH
    });

    console.log(tx);

    // deposit in USDC
    const usdcDeployment = await hre.deployments.get("USDC");
    const usdc = (await hre.ethers.getContractAt(
      usdcDeployment.abi,
      usdcDeployment.address
    )) as ERC20;

    const usdcBalance = await usdc.balanceOf(deployer);
    console.log(`usdcBalance: ${usdcBalance}`);

    await usdc.approve(controller.address, depositAmount);
    const tx2 = await controller.deposit(projectId, depositAmount);

    console.log(tx2);
  });

export default deposit;
