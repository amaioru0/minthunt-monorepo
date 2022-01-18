pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";


contract Verifier is Ownable, ERC721Holder, ERC1155Holder{
    
  struct Treasure { 
      address treasureAddress;
      string treasureType;
   }
    
  address importantAddress;
  address vaultAddress;
  mapping (bytes => bool) private _mintedAlready;
  mapping (string => Treasure) private _treasures;
  
  MyToken myToken;

   constructor (address _importantAddress, address treasureAddress, string memory treasureName, string memory treasureType) {
       importantAddress = _importantAddress;
       _treasures[treasureName] = Treasure(treasureAddress, treasureType);
   }

   function isValidData(uint256 _lat, uint256 _lng, uint256 _random, bytes memory sig, string memory _treasureFound, string memory lazyMintURI, uint256 fromVaultId, uint256 fromVaultQuantity) public returns(uint256){
       bytes32 message = keccak256(abi.encodePacked(_lat, _lng, _random));
       uint256 id;
       require(_mintedAlready[sig] == false, "Not real");
       if (recoverSigner(message, sig) == importantAddress) {
         _mintedAlready[sig] = true;
         myToken = MyToken(_treasures[_treasureFound].treasureAddress);
         if(keccak256(bytes(_treasures[_treasureFound].treasureType )) == keccak256(bytes("mintable"))) {
            id = myToken.mintItem(msg.sender);
         } else if(keccak256(bytes(_treasures[_treasureFound].treasureType )) == keccak256(bytes("lazyMint"))) {
            id = myToken.safeMint(msg.sender, lazyMintURI);
         }  else if(keccak256(bytes(_treasures[_treasureFound].treasureType )) == keccak256(bytes("fromVault"))) {
                myToken.safeTransferFrom(vaultAddress, msg.sender, fromVaultId, fromVaultQuantity, "");
                id = fromVaultId;
         }
       }
       _mintedAlready[sig] = true;
        return id;
   }


  function recoverSigner(bytes32 message, bytes memory sig)
       private
       pure
       returns (address)
    {
       uint8 v;
       bytes32 r;
       bytes32 s;

       (v, r, s) = splitSignature(sig);
       return ecrecover(message, v, r, s);
  }

  function splitSignature(bytes memory sig)
       private
       pure
       returns (uint8, bytes32, bytes32)
   {
       require(sig.length == 65);
       
       bytes32 r;
       bytes32 s;
       uint8 v;

       assembly {
           // first 32 bytes, after the length prefix
           r := mload(add(sig, 32))
           // second 32 bytes
           s := mload(add(sig, 64))
           // final byte (first byte of the next 32 bytes)
           v := byte(0, mload(add(sig, 96)))
       }

       return (v, r, s);
   }

   function addNewTreasure(string memory newTreasureName, address newTreasureAddress, string memory treasureType) public onlyOwner {
        _treasures[newTreasureName] = Treasure(newTreasureAddress, treasureType);
   }
   
    function setVaultAddress(address _newVaultAddress) public onlyOwner() { 
        vaultAddress = _newVaultAddress;
    }
    
} 



contract MyToken  {

      function mintItem(address senderx)
      public
      returns (uint256)
  {

      uint256 id = 0;
  
      return id;
  }
  

  
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
    
        function safeMint(address to, string memory uri) public returns (uint256) {
      uint256 id = 0;
        return id;
    }


}