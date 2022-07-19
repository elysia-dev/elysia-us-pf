import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;
  console.log(`Deploying to ${hre.network.name}...`);

  // Use mainnet contract address in local hardhat node
  const nftBond = await get("NftBond");
  const uniswapV3RouterAddress =
    hre.network.name === "hardhat"
      ? "0xe592427a0aece92de3edee1f18e0157c05861564"
      : (await get("UniswapV3Router")).address;
  const usdc = await get("USDC");
  const wethAddress =
    hre.network.name === "hardhat"
      ? "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      : (await get("WETH")).address;

  await deploy("Controller", {
    contract: "Controller",
    args: [nftBond.address, uniswapV3RouterAddress, usdc.address, wethAddress],
    from: deployer,
    log: true,
  });

  await hre.run("etherscan-verify", {
    network: hre.network.name,
  });
};

deploy.tags = ["Controller", "mainnet"];
deploy.dependencies = ["NftBond"];

export default deploy;
