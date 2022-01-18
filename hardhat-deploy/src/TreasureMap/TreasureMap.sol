//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


contract TreasureMap is ERC721, VRFConsumerBase, Ownable, ERC721Enumerable {
  address treasureMapGeneratorAddress;
  TreasureMapGeneratorX treasureMapGenerator = TreasureMapGeneratorX(treasureMapGeneratorAddress);

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  mapping (uint256 => bytes32) public random;
  mapping (uint256 => uint256) public range;
  mapping (uint256 => uint256) public mapType;
  mapping (uint256 => bytes3) public color;
  mapping (bytes32 => uint256) public requestsIds;

  uint256 public pricePerMap = 10000000000000000; // 0.010 ETH
  
  bytes32 internal keyHash;
  uint256 internal fee;
    
  constructor(address _treasureMapGeneratorAddress) public ERC721("TreasureMap", "MAP")
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB  // LINK Token
        ) {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10 ** 18; // 0.1 LINK (Varies by network)
        treasureMapGeneratorAddress = _treasureMapGeneratorAddress;
        }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function withdraw() external onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
     }

    function setMapPrice(uint256 _newPrice) public onlyOwner() {
        pricePerMap = _newPrice;
    }

    string[] private mapTypes = [
    "Explorer",
    "Hunter",
    "Pirate"
    "Ancient"
    ];

    string[] private ranges = [
    "0.004",
    "0.005",
    "0.006",
    "0.007",
    "0.008"
    ];


    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 id = requestsIds[requestId];
        uint256 random1 = uint256(keccak256(abi.encode(randomness, 1)));
        uint256 random2 = uint256(keccak256(abi.encode(randomness, 2)));
        random[id] = keccak256(abi.encodePacked(randomness));
        range[id] = (random1 % ranges.length);
        mapType[id] = (random2 % mapTypes.length);
        color[id] = bytes2(random[id][0]) | ( bytes2(random[id][1]) >> 8 ) | ( bytes2(random[id][2]) >> 16 );
    }
    
 function mintItem()
      public
      payable
      returns (uint256)
  {
      require(msg.value >= pricePerMap, "Ether value sent is not correct");
      require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);
      bytes32 requestId = requestRandomness(keyHash, fee);
      requestsIds[requestId] = id;
      return id;
  }
  
  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory tokenURIx = treasureMapGenerator.tokenURI(id, mapTypes[mapType[id]], ranges[range[id]], color[id]);
      return tokenURIx;
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

    function getGeneratorAddress() public view returns (address) {
        
    }

}

contract TreasureMapGeneratorX {

  function tokenURI(uint256 tokenId, string memory mapType, string memory range, bytes3 color) public view returns (string memory) {
  }
  
  

}