import { Controller, ERC20, NftBond } from "../../typechain-types";
import { task } from "hardhat/config";
import "hardhat-deploy";

const withdraw = task("withdraw", "withdraw a project")
  .addParam("projectId", "projectId")
  .setAction(async function (taskArgs, hre, runSuper) {
    const { deployer } = await hre.getNamedAccounts();
    const nftBondDeployment = await hre.deployments.get("NftBond");
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

    const nftBond = (await hre.ethers.getContractAt(
      nftBondDeployment.abi,
      nftBondDeployment.address
    )) as NftBond;

    const projectId = taskArgs.projectId;
    const nftBalance = await nftBond.balanceOf(deployer, projectId);
    console.log(`nftBalance: ${nftBalance}`);

    const tx = await controller.withdraw(projectId);
    console.log(tx);

    const usdcBalanceAfter = await usdc.balanceOf(deployer);
    console.log(`usdcBalanceAfter: ${usdcBalanceAfter}`);

    const controllertUsdcBalance = await usdc.balanceOf(controller.address);
    console.log(`controllertUsdcBalance: ${controllertUsdcBalance}`);
  });

export default withdraw;
