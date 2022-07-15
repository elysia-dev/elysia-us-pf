import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ethers } from "ethers";
import { initProject, TProject } from "../utils/controller";
import { advanceTimeTo } from "../utils/time";
import { faucetUSDC, getUSDCContract, USDC } from "../utils/tokens";
import { Controller, IERC20, NftBond } from "./../../typechain-types";
import { VALID_PROJECT_ID } from "./../utils/constants";
import { repayInput } from "./../utils/controller";

export function withdrawTest(): void {
  describe("withdrawTest", async function () {
    let project: TProject;
    let usdc: IERC20;
    let alice: SignerWithAddress;
    let controller: Controller;
    let nftBond: NftBond;
    let depositAmount: BigNumber;

    const projectId = VALID_PROJECT_ID;

    beforeEach("init -> deposit -> repay", async function () {
      const { deployer } = this.accounts;

      depositAmount = ethers.utils.parseUnits("10", USDC.decimal);
      alice = this.accounts.alice;
      controller = this.contracts.controller;
      nftBond = this.contracts.nftBond;
      usdc = await getUSDCContract();
      project = await initProject(this.contracts.controller);

      await usdc
        .connect(alice)
        .approve(controller.address, ethers.constants.MaxUint256);
      await faucetUSDC(alice.address, depositAmount);

      await advanceTimeTo(project.depositStartTs.toNumber());
      await controller.connect(alice).deposit(projectId, depositAmount);

      await usdc
        .connect(deployer)
        .approve(controller.address, ethers.constants.MaxUint256);
      await faucetUSDC(deployer.address, repayInput.finalAmount);

      await advanceTimeTo(project.depositEndTs.toNumber());
      await controller
        .connect(deployer)
        .repay(projectId, repayInput.finalAmount);
    });

    it("should transfer the final amount of the project in proportional to the user's deposited amount", async function () {
      const expectedReturn = repayInput.finalAmount
        .mul(depositAmount)
        .div(project.totalAmount);

      await expect(() =>
        controller.connect(alice).withdraw(projectId)
      ).to.changeTokenBalance(usdc, alice, expectedReturn);
    });

    it("should burn the user's nft", async function () {
      const previousBalance = await nftBond.balanceOf(
        alice.address,
        VALID_PROJECT_ID
      );
      const previousTotalSupply = await nftBond.totalSupply(VALID_PROJECT_ID);
      await controller.connect(alice).withdraw(projectId);
      const afterTotalSupply = await nftBond.totalSupply(VALID_PROJECT_ID);

      expect(await nftBond.balanceOf(alice.address, VALID_PROJECT_ID)).to.eq(0);
      expect(previousTotalSupply.sub(afterTotalSupply)).to.eq(previousBalance);
    });
  });
}
