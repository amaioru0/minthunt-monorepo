pragma solidity 0.8.7;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "./MetadataGenerator.sol";

contract GemTreasure is ERC721, Ownable, ERC721Enumerable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  mapping (uint256 => bytes32) public random;
  mapping (uint256 => bytes3) public color;
  mapping (uint256 => bytes3) public color2;
  mapping (uint256 => uint256) public suffix;

  address verifierAddress;

  constructor() public ERC721("Gems", "GEM") {
  }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    function setVerifierAddress(address _newVerifiedAddress) public onlyOwner() { 
        verifierAddress = _newVerifiedAddress;
    }

        string[] private suffixes = [
        "of Brightness",
        "of Desire",
        "of Power",
        "of Love",
        "of Knowledge",
        "of Reason",
        "of Enlightenment",
        "of Light",
        "of the Sea",
        "of Rage",
        "of Protection",
        "of Order",
        "of the Mage",
        "of the Lost Pirate",
        "of Reflection",
        "of the Mermaids Love",
        "of Water",
        "of Fire",
        "of Earth",
        "of Air",
        "of Flower",
        "of Nature",
        "of Mangala",
        "of Surya",
        "of Budha",
        "of Brhaspati",
        "of Shukra",
        "of Shani",
        "of Rahu",
        "of Ketu"
    ];
    

  function mintItem(address senderx)
      public
      returns (uint256)
  {
     require( msg.sender == verifierAddress, "Not the verifier");
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(senderx, id);

      random[id] = keccak256(abi.encodePacked( blockhash(block.number-1), senderx, address(this) ));
      color[id] = bytes2(random[id][0]) | ( bytes2(random[id][1]) >> 8 ) | ( bytes2(random[id][2]) >> 16 );
      color2[id] = bytes2(random[id][3]) | ( bytes2(random[id][4]) >> 8 ) | ( bytes2(random[id][5]) >> 16 );
      suffix[id]  = (uint(random[id]) + suffixes.length + 10) % suffixes.length;
      return id;
  }
  

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      return MetadataGenerator.tokenURI(ownerOf(id), id, color[id], color2[id], suffix[id], suffixes);
  }

    function tokensByOwner(address _owner) external view returns(uint256[] memory ) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 index;
            for (index = 0; index < tokenCount; index++) {
                result[index] = tokenOfOwnerByIndex(_owner, index);
            }
            return result;
        }
    }

}