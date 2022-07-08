// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error AlreadyInitialized();
error InitProject_SenderNotAuthorized();

contract NftName is ERC721, ERC721URIStorage, Ownable {
    event InitProject();
    event CreateLoan();
    event Redeem();

    struct Project {
        string baseUri;
        uint256 endTimestamp;
    }

    address public controller;
    uint256 public tokenIdCounter;
    uint256 public numberOfProject;

    mapping(uint256 => uint256) public loanPrincipal;
    mapping(uint256 => uint256) public loanInfo;
    mapping(uint256 => Project) public projects;

    constructor() ERC721("NftName", "NftSymbol") {}

    function init(address controller_) public onlyOwner {
        if (controller != address(0)) revert AlreadyInitialized();

        controller = controller_;
    }

    function initProject(uint256 endTimestamp, string memory baseUri) external {
        if (msg.sender != controller) revert InitProject_SenderNotAuthorized();

        Project memory newProject = Project({
            baseUri: baseUri,
            endTimestamp: endTimestamp
        });

        numberOfProject++;
        projects[numberOfProject] = newProject;

        // TODO: Add event args
        emit InitProject();
    }

    function createLoan(
        uint256 projectId,
        uint256 amount,
        address account
    ) external {
        Project memory project = projects[projectId];

        if (msg.sender != controller) revert();
        if (project.endTimestamp == 0) revert();

        uint256 tokenId = tokenIdCounter;

        loanPrincipal[tokenId] = amount;
        loanInfo[tokenId] = projectId;

        _mint(account, tokenIdCounter);
        _tokenIdIncrement();

        // TODO: Add event args
        emit CreateLoan();
    }

    function redeem(uint256 tokenId, address account) external {
        uint256 projectId = loanInfo[tokenId];

        if (msg.sender != controller) revert();
        if (projects[projectId].endTimestamp == 0) revert();
        if (ownerOf(tokenId) != account) revert();

        _burn(tokenId);

        // TODO: Add event args
        emit Redeem();
    }

    function _tokenIdIncrement() internal {
        tokenIdCounter++;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
