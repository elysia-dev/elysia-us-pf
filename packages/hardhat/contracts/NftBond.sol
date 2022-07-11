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
    uint256 public tokenIdCounter;

    constructor() ERC1155("") {}

    function init(address controller_) public onlyOwner {
        if (controller != address(0)) revert AlreadyInitialized();

        controller = controller_;
    }

    function initProject(string memory uri_, uint256 unit)
        external
        onlyController
    {
        uint256 tokenId = tokenIdCounter;
        _setUri(tokenId, uri_);
        _setUnit(tokenId, unit);
        _tokenIdIncrement();

        // TODO: Add event args
        emit InitProject();
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _uri[tokenId];
    }

    function createLoan(
        uint256 tokenId,
        uint256 amount,
        address account
    ) external {
        if (msg.sender != controller) revert();

        _mint(account, tokenId, amount / _unit[tokenId], "");

        // TODO: Add event args
        emit CreateLoan();
    }

    // amount is necessary for fractional redemption.
    function redeem(
        uint256 tokenId,
        address account,
        uint256 amount
    ) external {
        if (msg.sender != controller) revert();
        if (balanceOf(account, tokenId) <= 0) revert();

        _burn(account, tokenId, amount);

        // TODO: Add event args
        emit Redeem();
    }

    function _tokenIdIncrement() internal {
        tokenIdCounter++;
    }

    function _setUri(uint256 tokenId, string memory uri_) private {
        require(bytes(_uri[tokenId]).length == 0, "uri is already saved");
        _uri[tokenId] = uri_;
    }

    function _setUnit(uint256 tokenId, uint256 unit) private {
        _unit[tokenId] = unit;
    }

    modifier onlyController() {
        if (msg.sender != controller) revert InitProject_SenderNotAuthorized();
        _;
    }
}
