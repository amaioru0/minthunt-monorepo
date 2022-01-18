import {deployments, getUnnamedAccounts, getNamedAccounts} from 'hardhat';
const {execute} = deployments;

import { promises as fs } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const network = args[0];

async function main() {
  const {deployer } = await getNamedAccounts();

  const basePath = path.join(__dirname, '../', 'deployments', network)

  const energyoTokenFile = await fs.readFile(`${basePath}/EnergyToken.json`, 'utf8');
  const energyTokenAddress = JSON.parse(energyoTokenFile).address

  const egyLoveFile = await fs.readFile(`${basePath}/EgyLove.json`, 'utf8');
  const egyLoveAddress = JSON.parse(egyLoveFile).address
  console.log(egyLoveAddress)

  const energyExchangerFile = await fs.readFile(`${basePath}/EnergyExchanger.json`, 'utf8');
  const energyExchangerAddress = JSON.parse(energyExchangerFile).address
  // console.log(energyExchangerAddress)
  
  // set EgyLove on EnergyExchanger
  await execute(
    'EnergyExchanger',
    {from: deployer, log: true},
    'setEgyLove',
    `${egyLoveAddress}`
  );

    // set EnergyToken on EnergyExchanger
  await execute(
    'EnergyExchanger',
    {from: deployer, log: true},
    'setEnergyToken',
    energyTokenAddress
  );
  
  // set EnergyExchanger on EgyLove
  await execute(
    'EgyLove',
    {from: deployer, log: true},
    'setEnergyExchanger',
    energyExchangerAddress
  );

  // set EnergyExchanger on EnergyToken
  await execute(
    'EnergyToken',
    {from: deployer, log: true},
    'setEnergyExchanger',
    energyExchangerAddress
  );
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
