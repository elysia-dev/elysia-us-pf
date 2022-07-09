import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { advanceTimeTo } from "../../utils/time";
import { Controller } from "./../../../typechain-types";
import { ERC20 } from "./../../../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";
import { initProject, TProject } from "./../../utils/controller";
import { faucetUSDC, getUSDCContract, USDC } from "./../../utils/tokens";

export function shouldBeAbleToWithdraw(): void {
  let project: TProject;
  let usdc: ERC20;
  let alice: SignerWithAddress;
  let controller: Controller;
  let tokenId: BigNumber;

  describe("should be able to withdraw", async function () {
    beforeEach("init -> deposit -> repay", async function () {
      const { deployer } = this.accounts;
      const { NftBond } = this.contracts;
      const depositAmount = ethers.utils.parseUnits("10", USDC.decimal);
      const finalAmount = ethers.utils.parseUnits("100", USDC.decimal);

      alice = this.accounts.alice;
      controller = this.contracts.controller;
      usdc = await getUSDCContract();
      project = await initProject(this.contracts.controller);

      await advanceTimeTo(project.depositStartTs.toNumber());

      await faucetUSDC(alice.address, depositAmount);
      await usdc
        .connect(alice)
        .approve(controller.address, ethers.constants.MaxUint256);
      await controller.connect(alice).deposit(project.id, depositAmount);

      tokenId = (await NftBond.tokenIdCounter()).sub(BigNumber.from("1"));

      await faucetUSDC(deployer.address, finalAmount);
      await usdc
        .connect(deployer)
        .approve(controller.address, ethers.constants.MaxUint256);
      const allowance = await usdc.allowance(
        deployer.address,
        controller.address
      );
      console.log(`allowance: ${allowance}`);
      const balance = await usdc.balanceOf(deployer.address);
      console.log(`balance: ${balance}`);
      await controller.connect(deployer).repay(project.id, finalAmount);
    });

    it("should revert if the token does not exist.", async function () {
      await expect(
        controller.connect(alice).withdraw(BigNumber.from("100000000"))
      ).to.be.revertedWith("NotExistingToken()");
    });

    it("should revert if the project does not exist.", async function () {});

    it("should revert if the project has not repaid yet.", async function () {});

    it("should decrement project.currentAmount by his/her deposited amount", async function () {});

    // TODO: Move to integration tests
    it("should transfer the final amount of the project in proportional to the user's balance", async function () {});

    // Transfer the user's nft and call Nftbond.redeem
    it("should redeem the user's nft", async function () {});
  });
}
