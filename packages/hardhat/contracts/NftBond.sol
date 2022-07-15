// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error AlreadyInitialized();
error OnlyController();
error NotExistingToken();
error NotDivisibleByUnit();
error ZeroBalance();

// tokenId is projectId
contract NftBond is ERC1155Supply, Ownable {
    event InitProject(string _uri_, uint256 _unit_);
    event CreateLoan(uint256 _tokenId, uint256 _principal, address _account);
    event Redeem(uint256 _tokenId, address _account, uint256 _tokenBalance);

    // stores how much one unit worths. We use USDC, so if a unit is $10, it is 10.
    mapping(uint256 => uint256) private _unit;
    mapping(uint256 => string) private _uri;

    address public controller;
    uint256 public tokenIdCounter;

    constructor() ERC1155("") {}

    function unit(uint256 tokenId) public view returns (uint256) {
        return _unit[tokenId];
    }

    function init(address controller_) public onlyOwner {
        if (controller != address(0)) revert AlreadyInitialized();

        controller = controller_;
    }

    function initProject(string memory uri_, uint256 unit_)
        external
        onlyController
    {
        uint256 tokenId = tokenIdCounter;
        _setUri(tokenId, uri_);
        _setUnit(tokenId, unit_);
        _tokenIdIncrement();

        // TODO: Add event args
        emit InitProject(uri_, unit_);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _uri[tokenId];
    }

    /**
     * @notice Mint tokens corresponding amount to unit value
     * @param tokenId id of the project
     * @param principal the total value of tokens user want to mint
     */
    function createLoan(
        uint256 tokenId,
        uint256 principal,
        address account
    ) external onlyController {
        uint256 unit_ = _unit[tokenId];
        if (principal % unit_ != 0) revert NotDivisibleByUnit();

        _mint(account, tokenId, principal / unit_, "");

        // TODO: Add event args
        emit CreateLoan(tokenId, principal, account);
    }

    // amount is necessary for fractional redemption.
    function redeem(
        uint256 tokenId,
        address account,
        uint256 tokenBalance
    ) external onlyController {
        if (balanceOf(account, tokenId) == 0) revert ZeroBalance();

        _burn(account, tokenId, tokenBalance);

        // TODO: Add event args
        emit Redeem(tokenId, account, tokenBalance);
    }

    function _tokenIdIncrement() internal {
        tokenIdCounter++;
    }

    function _setUri(uint256 tokenId, string memory uri_) private {
        require(bytes(_uri[tokenId]).length == 0, "uri is already saved");
        _uri[tokenId] = uri_;
    }

    function _setUnit(uint256 tokenId, uint256 unit_) private {
        _unit[tokenId] = unit_;
    }

    modifier onlyController() {
        if (msg.sender != controller) revert OnlyController();
        _;
    }
}
