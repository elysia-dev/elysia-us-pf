import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;
  console.log(`Deploying to ${hre.network.name}...`);

  // Use mainnet contract address
  const nftBond = await get("NftBond");
  const uniswapV3RouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  await deploy("Controller", {
    contract: "Controller",
    args: [nftBond.address, uniswapV3RouterAddress, usdcAddress, wethAddress],
    from: deployer,
    log: true,
  });
};

deploy.tags = ["Controller"];
deploy.dependencies = ["NftBond"];

export default deploy;
