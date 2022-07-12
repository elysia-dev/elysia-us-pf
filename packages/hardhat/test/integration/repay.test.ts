import { expect } from "chai";
import {
  finalAmount,
  initProject,
  initProjectInput,
} from "../utils/controller";
import { faucetUSDC } from "../utils/tokens";
import { VALID_PROJECT_ID } from "./../utils/constants";
import { advanceTimeTo } from "../utils/time";

export function repayTest(): void {
  const projectId = VALID_PROJECT_ID;

  describe("repayTest", async function () {
    beforeEach("init project and approve", async function () {
      const { deployer } = this.accounts;
      await initProject(this.contracts.controller);

      await this.contracts.usdc
        .connect(deployer)
        .approve(this.contracts.controller.address, finalAmount);
      await faucetUSDC(deployer.address, finalAmount);
    });

    describe("success", async function () {
      it("should transfer usdc", async function () {
        const beforeBalance = await this.contracts.usdc.balanceOf(
          this.contracts.controller.address
        );

        await advanceTimeTo(initProjectInput.depositEndTs);

        const tx = await this.contracts.controller
          .connect(this.accounts.deployer)
          .repay(projectId, finalAmount);

        expect(
          await this.contracts.usdc.balanceOf(this.contracts.controller.address)
        ).to.equal(beforeBalance.add(finalAmount));

        await expect(tx)
          .to.emit(this.contracts.usdc, "Transfer")
          .withArgs(
            this.accounts.deployer.address,
            this.contracts.controller.address,
            finalAmount
          );
      });
    });
  });
}
