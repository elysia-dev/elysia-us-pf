// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./NftName.sol";

error InitProject_InvalidTimestampInput();
error InitProject_InvalidTargetAmountInput();
error DepositUnderlying_NotEnoughAmountInput();
error DepositUnderlying_AlreadyDepositted();
error DepositUnderlying_NotExistingProject();

contract Controller is Ownable {
    struct Project {
        uint256 totalAmount;
        uint256 empty;
        uint256 startTimestamp;
        uint256 endTimestamp;
        uint256 finalAmount;
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
        uint256 startTimestamp,
        uint256 endTimestamp,
        string memory baseUri
    ) external onlyOwner {
        if (
            startTimestamp <= block.timestamp || endTimestamp <= block.timestamp
        ) revert InitProject_InvalidTimestampInput();
        if (targetAmount == 0) revert InitProject_InvalidTargetAmountInput();

        numberOfProject++;

        Project memory newProject = Project({
            totalAmount: targetAmount,
            empty: 0,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            finalAmount: 0
        });

        projects[numberOfProject] = newProject;

        NftName(nft).initProject(baseUri, endTimestamp);
    }

    function depositUnderlying(uint256 projectId, uint256 amount)
        external
        onlyOwner
    {
        // check

        Project storage project = projects[projectId];
        if (project.finalAmount != 0)
            revert DepositUnderlying_AlreadyDepositted();
        if (project.startTimestamp == 0)
            revert DepositUnderlying_NotExistingProject();
        if (amount < project.totalAmount)
            revert DepositUnderlying_NotEnoughAmountInput();

        // effect
        project.finalAmount = amount;

        // interaction
        IERC20(usdc).transferFrom(msg.sender, address(this), amount);
    }
}
