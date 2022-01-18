pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EnergyExchanger is Ownable {
    
  address egyLoveAddress;
  address energyTokenAddress;
  
  EnergyTokenX energyToken;
  EgyLoveX egyLove;

   constructor (address _egyLoveAddress, address _energyTokenAddress) {
       egyLoveAddress = _egyLoveAddress;
       energyTokenAddress = _energyTokenAddress;
   }
   
   
   function exchange(uint256 ammount) public returns (bool) {
    egyLove = EgyLoveX(egyLoveAddress);
    energyToken = EnergyTokenX(energyTokenAddress);
    egyLove.exchangeBurn(msg.sender, 1);
    energyToken.awardEnergy(msg.sender, 1);
    return true;
   }

   function setEgyLove(address _newEgyLoveAddress) public onlyOwner() { 
    egyLoveAddress = _newEgyLoveAddress;
    }
    
   function setEnergyToken(address _newEnergyTokenAddress) public onlyOwner() { 
    energyTokenAddress = _newEnergyTokenAddress;
    }

   function getEgyLove() public view returns (address) {
       return egyLoveAddress;
   }
   
  function getEnergyToken() public view returns (address) {
       return energyTokenAddress;
   }


}

contract EgyLoveX {
  function exchangeBurn(address player, uint256 ammount) public returns (bool) {
    return true;         
  }
}


contract EnergyTokenX  {

    function awardEnergy(address player, uint256 ammount) public returns (uint256) {
        return 1;
    }
}