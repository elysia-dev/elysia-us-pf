// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error AlreadyInitialized();
error InitProject_SenderNotAuthorized();
error NotExistingToken();

// tokenId is projectId
contract NftBond is ERC1155, Ownable {
    event InitProject();
    event CreateLoan();
    event Redeem();

    // stores how much one unit worths. We use USDC, so if a unit is $10, it is 10*10**6.
    mapping(uint256 => uint256) public _unit;
    mapping(uint256 => string) public _uri;

    address public controller;

    constructor() ERC1155("") {}

    function init(address controller_) public onlyOwner {
        if (controller != address(0)) revert AlreadyInitialized();

        controller = controller_;
    }

    function initProject(
        string memory uri,
        uint256 numberOfProject,
        uint256 unit
    ) external onlyOwner {
        if (msg.sender != controller) revert InitProject_SenderNotAuthorized();

        _setUri(numberOfProject, uri);
        _setUnit(numberOfProject, unit);

        // TODO: Add event args
        emit InitProject();
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _uri[tokenId];
    }

    function createLoan(
        uint256 projectId,
        uint256 amount,
        address account
    ) external {
        if (msg.sender != controller) revert();

        _mint(account, projectId, amount / _unit[projectId], "");

        // TODO: Add event args
        emit CreateLoan();
    }

    function redeem(
        uint256 projectId,
        address account,
        uint256 amount
    ) external {
        if (msg.sender != controller) revert();
        if (balanceOf(account, projectId) <= 0) revert();

        _burn(account, projectId, amount);

        // TODO: Add event args
        emit Redeem();
    }

    function _setUri(uint256 tokenId, string memory uri) private {
        require(bytes(_uri[tokenId]).length == 0, "uri is already saved");
        _uri[tokenId] = uri;
    }

    function _setUnit(uint256 tokenId, uint256 unit) private {
        _unit[tokenId] = unit;
    }
}
