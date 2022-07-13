// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice This ERC20 is only for the testnet.
 */
contract ERC20Test is ERC20 {
    constructor(
        uint256 totalSupply_,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        _mint(msg.sender, totalSupply_);
    }

    /**
     * @notice The faucet is for testing ELYFI functions
     */
    function faucet() external {
        _mint(msg.sender, 1000 * 1e6);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
