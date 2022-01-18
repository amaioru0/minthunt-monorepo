pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import 'base64-sol/base64.sol';

contract EgyLove is ERC1155, Ownable, Pausable   {
    constructor() ERC1155("ipfs://QmbY39R1fQsfGcc3vrpnPhWvScknn6zuWo7YpK5wxikmYC/{id}.json") {
    }

  address energyExchanger;


   function setEnergyExchanger(address _energyExchanger) public onlyOwner() { 
    energyExchanger = _energyExchanger;
  }
  
  function exchangeBurn(address player, uint256 ammount) public returns (bool) {
      require(msg.sender == energyExchanger, "Not the exchanger");
      _burn(player, 0, ammount*2);
      _burn(player, 1, ammount);
      return true;
  }
  
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
    

    
    function createItem(uint256 id, uint256 ammount, string memory name) public onlyOwner {
            _mint(msg.sender, id, ammount, bytes(name));
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    

}