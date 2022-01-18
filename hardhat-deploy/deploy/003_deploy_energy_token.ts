import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
// import {parseEther} from 'ethers/lib/utils';

import { promises as fs } from 'fs';
import path from 'path';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  
  const {deployer} = await getNamedAccounts();

  const network = hre.network.name == "hardhat" ? "localhost" : 'kovan';

  const basePath = path.join(__dirname, '../', 'deployments', network)
  const energyExchangerFile = await fs.readFile(`${basePath}/EnergyExchanger.json`, 'utf8');
  const energyExchangerAddress = JSON.parse(energyExchangerFile).address

  if(hre.network.name == "hardhat") {
  setTimeout(async() => { 
    await deploy('EnergyToken', {
      from: deployer,
      args: [[energyExchangerAddress]],
      log: true,
    });
  }, 1000);
  } else {
    await deploy('EnergyToken', {
      from: deployer,
      args: [[energyExchangerAddress]],
      log: true,
    });
  }

};
export default func;
func.tags = ['EnergyToken'];
