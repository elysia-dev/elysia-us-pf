import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("NftBond", {
    contract: "NftBond",
    from: deployer,
    log: true,
  });
};

deploy.tags = ["NftBond"];
deploy.dependencies = [];

export default deploy;
