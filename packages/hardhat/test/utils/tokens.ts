import { BigNumberish } from "ethers";
import hre from "hardhat";
import { ERC20 } from "../../typechain-types";

export const WETH9 = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  decimal: 18,
};

export const USDC = {
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  decimal: 6,
};

export const getUSDCContract: () => Promise<ERC20> = async () =>
  (await hre.ethers.getContractAt("IERC20", USDC.address)) as ERC20;

export async function faucetUSDC(account: string, amount: BigNumberish) {
  const USDC_WHALE = "0x55FE002aefF02F77364de339a1292923A15844B8";
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDC_WHALE],
  });

  const whale = await hre.ethers.getSigner(USDC_WHALE);
  const usdc = (await hre.ethers.getContractAt(
    "IERC20",
    USDC.address
  )) as ERC20;

  usdc.connect(whale).transfer(account, amount);
}
