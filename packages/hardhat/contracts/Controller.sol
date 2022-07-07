// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./NftName.sol";
import "./SwapHelper.sol";

error InitProject_InvalidTimestampInput();
error InitProject_InvalidTargetAmountInput();
error Deposit_NotStarted();
error Deposit_Ended();
error Deposit_NotDivisibleByDollar();
error Withdraw_NotRepayedProject();
error Repay_NotEnoughAmountInput();
error Repay_AlreadyDepositted();
error NotExistingProject();
error Borrow_DepositNotEnded();

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
    struct Project {
        uint256 totalAmount;
        uint256 currentAmount;
        uint256 depositStartTs;
        uint256 depositEndTs;
        uint256 finalAmount;
        bool repayed;
    }

    address public nft;
    address public router;
    address public quoter;
    address public usdc;
    address public weth;
    uint256 public decimal;
    uint256 public numberOfProject;

    mapping(uint256 => Project) public projects;

    constructor(
        address nft_,
        address router_,
        address quoter_,
        address usdc_,
        address weth_
    ) {
        nft = nft_;
        router = router_;
        quoter = quoter_;
        usdc = usdc_;
        weth = weth_;
    }

    function initProject(
        uint256 targetAmount,
        uint256 depositStartTs,
        uint256 depositEndTs,
        string memory baseUri
    ) external onlyOwner {
        if (
            depositStartTs <= block.timestamp || depositEndTs <= block.timestamp
        ) revert InitProject_InvalidTimestampInput();
        if (targetAmount == 0) revert InitProject_InvalidTargetAmountInput();

        Project memory newProject = Project({
            totalAmount: targetAmount,
            currentAmount: 0,
            depositStartTs: depositStartTs,
            depositEndTs: depositEndTs,
            finalAmount: 0,
            repayed: false
        });

        projects[numberOfProject] = newProject;
        numberOfProject++;

        // FIXME: depositEndTs is not proper here!
        NftName(nft).initProject(depositEndTs, baseUri);
    }

    function deposit(uint256 projectId, uint256 amount)
        external
        payable
        override
    {
        // check
        if (amount % 10**6 != 0) revert Deposit_NotDivisibleByDollar();

        Project storage project = projects[projectId];
        if (project.depositStartTs == 0) revert NotExistingProject();
        if (block.timestamp < project.depositStartTs)
            revert Deposit_NotStarted();
        if (project.depositEndTs <= block.timestamp) revert Deposit_Ended();

        // effect
        projects[projectId].currentAmount += amount;

        // interaction
        if (msg.value != 0) {
            swapExactOutputSingle(amount);
        } else {
            TransferHelper.safeTransferFrom(
                USDC,
                msg.sender,
                address(this),
                amount
            );
        }

        // TODO: mint NFT
    }

    function withdraw(uint256 tokenId) external override {
        // TODO: check projectID and deposited balance from NFT
        uint256 projectId = 0;
        uint256 userBalance = 0;
        Project storage project = projects[projectId];
        if (project.depositStartTs == 0) revert NotExistingProject();
        if (!project.repayed) revert Withdraw_NotRepayedProject();

        // effect
        project.currentAmount -= userBalance;

        // interaction
        uint256 interest = project.finalAmount *
            (userBalance / project.totalAmount);
        TransferHelper.safeTransfer(USDC, msg.sender, interest);

        // TODO: burn NFT of msg.sender
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

        // effect
        project.finalAmount = amount;
        project.repayed = true;

        // interaction
        IERC20(usdc).transferFrom(msg.sender, address(this), amount);
    }

    function borrow(uint256 projectId) external onlyOwner {
        // check
        Project storage project = projects[projectId];
        if (project.depositStartTs == 0) revert NotExistingProject();
        if (block.timestamp < project.depositEndTs)
            revert Borrow_DepositNotEnded();

        // effect
        uint256 amount = project.currentAmount;

        // interaction
        IERC20(usdc).transfer(msg.sender, amount);
    }
}
