//SPDX-License-Identifier: Undefined 

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract BrandNFT is ERC721URIStorage, Ownable {
   using Counters for Counters.Counter;
   Counters.Counter private _tokenIds;

   address public latestMintAddress;

   struct mintedToken {
      address nftOwner;
      uint256 tokenId;
      string tokenURI;
   }

   mintedToken[] mintedTokens;

   constructor() ERC721('ArthaNFT', 'ARTHA') {}

   function MintNFT(string memory _tokenURI) public {
      _tokenIds.increment();

      uint256 newItemId = _tokenIds.current();

      _safeMint(msg.sender, newItemId);
      _setTokenURI(newItemId, _tokenURI);

      console.log("New Token is minted at %s", _tokenURI);
      
      mintedTokens.push(mintedToken(msg.sender, newItemId, _tokenURI));
   }

   function getMintedBrands() public view returns(mintedToken[] memory) {
      return mintedTokens;
   }

}


