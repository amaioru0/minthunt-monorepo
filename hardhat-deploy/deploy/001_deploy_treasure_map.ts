import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
// import {parseEther} from 'ethers/lib/utils';

import { promises as fs } from 'fs';
import path from 'path';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  
  const {deployer} = await getNamedAccounts();

  const network = hre.network.name == "hardhat" ? "localhost" : hre.network.name;


    await deploy('TreasureMapGenerator', {
      from: deployer,
      args: [],
      log: true,
    });

  const basePath = path.join(__dirname, '../', 'deployments', network)
  const treasureMapGeneratorFile = await fs.readFile(`${basePath}/TreasureMapGenerator.json`, 'utf8');
  const treasureMapGeneratorAddress = JSON.parse(treasureMapGeneratorFile).address

  await deploy('TreasureMap', {
    from: deployer,
    args: [treasureMapGeneratorAddress],
    log: true,
  });

};
export default func;
func.tags = ['TreasureMapGenerator', 'TreasureMap'];
