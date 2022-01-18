pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Trove is Ownable {
        
    constructor () {
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
  
    mapping (uint256 => Treasure) treasures;

    struct Treasure {
        string network;
        string treasure;
        uint256 tokenId;
        string tokenUri;
        string treasureType;
        bool status;
        string geohash;
    }
    
    event NewTreasure(string network, string treasure, uint256 tokenId, string tokenUri, string treasureType, bool status, string geohash);


    function addTreasure(string memory network, string memory treasure, uint256 tokenId, string memory tokenUri, string memory treasureType, bool status, string memory geohash) public onlyOwner returns (bool) {
       uint256 treasureId = _tokenIdCounter.current();
     
       treasures[treasureId] = Treasure({
        network: network,
        treasure: treasure,
        tokenId: tokenId,
        tokenUri: tokenUri,
        treasureType: treasureType,
        status: status,
        geohash: geohash
        });
        emit NewTreasure(network, treasure, tokenId, tokenUri, treasureType, status, geohash);
        _tokenIdCounter.increment();
        return true;
    }

} 