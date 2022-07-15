// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftBond.sol";
import "./SwapHelper.sol";

error InitProject_InvalidTimestampInput();
error InitProject_InvalidTargetAmountInput();
error Deposit_NotStarted();
error Deposit_Ended();
error Deposit_ExceededTotalAmount();
error Deposit_NotDivisibleByDecimals();
error Withdraw_NotRepayedProject();
error Repay_NotEnoughAmountInput();
error Repay_AlreadyDepositted();
error NotExistingProject();
error Borrow_DepositNotEnded();
error Repay_DepositNotEnded();
error AlreadyBorrowed();

interface IController {
    /**
     * @notice A user deposits ETH or USDC and buys a NFT.
     * @param projectId id of the project the user wants to invest.
     * @param depositAmount the amount of USDC user wants to deposit.
     */
    function deposit(uint256 projectId, uint256 depositAmount) external payable;

    /**
     * @notice A user burns his/her NFT and receives USDC with accrued interests.
     * @param tokenId id of the NFT the user wants to burn.
     */
    function withdraw(uint256 tokenId) external;

    /**
     * @notice The owner withdraws all deposited USDC.
     * @param projectId id of the project
     */
    function borrow(uint256 projectId) external;

    /**
     * @notice The owner transfers USDC for depositors to withdraw.
     * @param projectId id of the project
     * @param amount the amount of USDC the owner wants to transfer to this contract.
     */
    function repay(uint256 projectId, uint256 amount) external;
}

contract Controller is Ownable, SwapHelper, IController {
    /**
     * totalAmount: target amount (Before Borrow) & total deposited (After Project Ended). Changes with borrow.
     * currentAmount: balance of this project. Changes with deposit, withdraw, borrow, and repay.
     * finalAmount: repaid amount after interest. Changes with repay.
     */
    struct Project {
        uint256 totalAmount;
        uint256 currentAmount;
        uint256 depositStartTs;
        uint256 depositEndTs;
        uint256 finalAmount;
    }

    NftBond public nft;

    mapping(uint256 => Project) public projects;

    event Controller_NewProject();
    event Repaid();

    constructor(
        NftBond nft_,
        address router_,
        address usdc_,
        address weth_
    ) SwapHelper(router_, usdc_, weth_) {
        nft = nft_;
    }

    /**
     * @notice projectId starts from 0.
     */
    function initProject(
        uint256 targetAmount,
        uint256 depositStartTs,
        uint256 depositEndTs,
        uint256 unit,
        string memory uri
    ) external onlyOwner {
        if (depositEndTs <= block.timestamp || depositEndTs <= depositStartTs)
            revert InitProject_InvalidTimestampInput();
        if (targetAmount == 0) revert InitProject_InvalidTargetAmountInput();

        Project memory newProject = Project({
            totalAmount: targetAmount,
            currentAmount: 0,
            depositStartTs: depositStartTs,
            depositEndTs: depositEndTs,
            finalAmount: 0
        });

        uint256 projectId = nft.tokenIdCounter();
        projects[projectId] = newProject;

        nft.initProject(uri, unit);
        emit Controller_NewProject();
    }

    function deposit(uint256 projectId, uint256 amount)
        external
        payable
        override
    {
        // check
        Project storage project = projects[projectId];
        if (project.depositStartTs == 0) revert NotExistingProject();
        if (block.timestamp < project.depositStartTs)
            revert Deposit_NotStarted();
        if (project.depositEndTs <= block.timestamp) revert Deposit_Ended();
        if (project.currentAmount + amount > project.totalAmount)
            revert Deposit_ExceededTotalAmount();
        if (amount % (10**decimal) != 0)
            revert Deposit_NotDivisibleByDecimals();

        // effect
        projects[projectId].currentAmount += amount;

        // interaction
        if (msg.value != 0) {
            swapExactOutputSingle(amount);
        } else {
            TransferHelper.safeTransferFrom(
                usdc,
                msg.sender,
                address(this),
                amount
            );
        }

        uint256 principal = _calculatePrincipal(amount);
        nft.createLoan(projectId, principal, msg.sender);
    }

    function borrow(uint256 projectId) external onlyOwner {
        // check
        Project storage project = projects[projectId];
        if (project.depositStartTs == 0) revert NotExistingProject();
        if (block.timestamp < project.depositEndTs)
            revert Borrow_DepositNotEnded();
        if (project.currentAmount == 0) revert AlreadyBorrowed();

        // effect
        project.totalAmount = project.currentAmount;
        uint256 amount = project.currentAmount;
        project.currentAmount = 0;

        // interaction
        IERC20(usdc).transfer(msg.sender, amount);
    }

    function repay(uint256 projectId, uint256 amount)
        external
        override
        onlyOwner
    {
        Project storage project = projects[projectId];
        // check
        if (project.finalAmount != 0) revert Repay_AlreadyDepositted();
        if (project.depositStartTs == 0) revert NotExistingProject();
        if (amount < project.totalAmount) revert Repay_NotEnoughAmountInput();
        if (project.depositEndTs > block.timestamp)
            revert Repay_DepositNotEnded();

        // effect
        project.finalAmount = project.currentAmount = amount;

        // interaction
        IERC20(usdc).transferFrom(msg.sender, address(this), amount);

        emit Repaid();
    }

    function withdraw(uint256 projectId) external override {
        Project storage project = projects[projectId];
        if (project.depositStartTs == 0) revert NotExistingProject();
        if (project.finalAmount == 0) revert Withdraw_NotRepayedProject();

        uint256 userTokenBalance = nft.balanceOf(msg.sender, projectId);
        uint256 userDollarBalance = _calculateDollarBalance(
            projectId,
            userTokenBalance
        );

        // effect
        project.currentAmount -= userDollarBalance;

        // interaction
        // Multiply first to prevent decimal from going down to 0.
        uint256 interest = (project.finalAmount * userDollarBalance) /
            project.totalAmount;
        TransferHelper.safeTransfer(usdc, msg.sender, interest);

        nft.redeem(projectId, msg.sender, userTokenBalance);
    }

    function _calculatePrincipal(uint256 amount)
        internal
        view
        returns (uint256)
    {
        return amount / (10**decimal);
    }

    function _calculateDollarBalance(uint256 projectId, uint256 balance)
        internal
        view
        returns (uint256)
    {
        uint256 unit = nft.unit(projectId);

        return balance * unit * (10**decimal);
    }
}
