// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

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

    mapping(uint256 => Project) public project;

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
}
