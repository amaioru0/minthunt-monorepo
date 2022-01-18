// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import 'base64-sol/base64.sol';
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract TreasureChest is ERC721, Ownable, VRFConsumerBase {
    
  bytes32 internal keyHash;
  uint256 internal fee;
  
    constructor() ERC721("TreasureChest", "TRC") 
            VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        )
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    }
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    mapping (uint256 => string) private _tokenURIs;
    
    address private vaultAddress;
    address private verifierAddress;

  // chests store the created  chests that were minted
     struct Chest { 
       string name;
       string quality;
       uint256 goodnes;
       string description;
       uint256[] contains;
    }

    mapping (uint256 => Chest) private chests;
    
      // requestIds for chainlink
  mapping (bytes32 => uint256) public requestsIds;

    // treasures are NFTs from another contract like EGyLove 
    struct Treasure {
        address treasureAddress;
        uint256 count;
        uint256 id;
    }
    
    string imageURL = "ipfs://QmRMMDWqpLWbLyuzHdUBSubcSmFeG6b3kecrsM1tuAStLu";
    Treasure[] treasures;
    
        MyToken myToken;

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 id = requestsIds[requestId];
        uint256 random1 = uint256(keccak256(abi.encode(randomness, 1)));
        
        uint256 goodnes = (uint(random1) + treasures.length + 10) % treasures.length;

        Chest memory chest;
        chests[id] = chest;
        
        for (uint i=0; i<goodnes; i++) {
            uint256 treasureId = (uint256(keccak256(abi.encode(randomness, i))) + treasures.length + 10) % treasures.length;
            if(treasures[treasureId].count > 0) {
              chests[id].contains.push(treasureId);
              treasures[treasureId].count = treasures[treasureId].count - 1;
            } else if(chests[id].contains.length == 0) {
                while (chests[id].contains.length == 0) {
                treasureId = treasureId + 1;
                if(treasures[treasureId].count > 0) {
                  chests[id].contains.push(treasureId);
                  treasures[treasureId].count = treasures[treasureId].count - 1;
                } else {
                    treasureId = treasureId - 2;
                     if(treasures[treasureId].count > 0) {
                      chests[id].contains.push(treasureId);
                      treasures[treasureId].count = treasures[treasureId].count - 1;
                     }
                }
            }
        }
    }
        chests[id].name = "TreasureChest";
        chests[id].quality = "RARE";
        chests[id].goodnes = goodnes;
        chests[id].description = "A treasure chest.";
    }
    
    function mintItem(address to) public returns (uint256) {
        require( msg.sender == verifierAddress, "Not the verifier");
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
          uint256 id = _tokenIdCounter.current();
          _safeMint(to, id);
          bytes32 requestId = requestRandomness(keyHash, fee);
          requestsIds[requestId] = id;
          _tokenIdCounter.increment();
          return id;
      }
    
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory goodnesS = uint2str(chests[tokenId].goodnes);
        return
          string(
              abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                          abi.encodePacked(
                              '{"name":"',
                              string(chests[tokenId].name),
                              '", "description":"',
                              chests[tokenId].description,
                              '", "attributes": [{"trait_type": "goodnes", "value": "',
                              goodnesS,
                              '"}],',
                              '"image": "',
                              imageURL,'/',goodnesS,
                              '.png"}'
                          )
                        )
                    )
              )
          );
    }
    
    function setVerifierAddress(address _newVerifiedAddress) public onlyOwner() { 
        verifierAddress = _newVerifiedAddress;
    }
    
    
    function addTreasure(address treasureAddress, uint256 count, uint256 id) public onlyOwner {
            treasures.push(Treasure(treasureAddress, count, id));
    }
    
    function setVaultAddress(address _newVaultAddress) public onlyOwner() { 
        vaultAddress = _newVaultAddress;
    }
    
    function openChest(uint256 id) public returns(uint256) {
        require(_exists(id), "Chest does not exist");
        require(ownerOf(id) == msg.sender, "Yu not owner of dis chest");
        uint256 len = chests[id].contains.length;
        for (uint i=0; i<chests[id].contains.length; i++) {
          myToken = MyToken(treasures[chests[id].contains[i]].treasureAddress);
          myToken.safeTransferFrom(vaultAddress, msg.sender, treasures[chests[id].contains[i]].id, 1, "");
        }
        _burn(id);
        delete chests[id];
        return len;
    }
    
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
}

contract MyToken  {

      function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual  {

    }
    
      function safeTransferFrom(
        address from,
        address to,
        uint256 id
    ) public virtual  {

    }
}