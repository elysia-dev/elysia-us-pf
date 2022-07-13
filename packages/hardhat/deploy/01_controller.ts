import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;
  console.log(`Deploying to ${hre.network.name}...`);

  // Use mainnet contract address
  const nftBond = await get("NftBond");
  const uniswapV3Router = await get("UniswapV3Router");
  const usdc = await get("USDC");
  const weth = await get("WETH");

  await deploy("Controller", {
    contract: "Controller",
    args: [
      nftBond.address,
      uniswapV3Router.address,
      usdc.address,
      weth.address,
    ],
    from: deployer,
    log: true,
  });
};

deploy.tags = ["Controller", "mainnet"];
deploy.dependencies = ["NftBond"];

export default deploy;
