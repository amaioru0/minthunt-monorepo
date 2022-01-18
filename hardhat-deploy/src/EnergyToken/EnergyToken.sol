pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnergyToken is ERC777, Ownable {
    constructor(address[] memory defaultOperators) 
        ERC777("Energy", "EGY", defaultOperators)
     {
    }
    
      address energyExchanger;

   function setEnergyExchanger(address _energyExchanger) public onlyOwner() { 
    energyExchanger = _energyExchanger;
    }
    
    function awardEnergy(address player, uint256 ammount) public returns (uint256) {
      require(msg.sender == energyExchanger, "Not the exchanger");
        _mint(player, ammount, "", "");
        return ammount;
    }
}