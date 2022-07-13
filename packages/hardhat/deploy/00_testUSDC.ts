import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("USDC", {
    contract: "ERC20Test",
    args: [1000 * 1e6, "TestUSDC", "T_USDC"],
    from: deployer,
    log: true,
  });
};

deploy.tags = ["TestUSDC", "test"];
deploy.dependencies = [];

export default deploy;
