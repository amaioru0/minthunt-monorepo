import {deployments, getUnnamedAccounts, getNamedAccounts} from 'hardhat';
const {execute} = deployments;

import { promises as fs } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const network = args[0];

async function main() {
  const {deployer } = await getNamedAccounts();

  const basePath = path.join(__dirname, '../', 'deployments', network)

  const treasureChestFile = await fs.readFile(`${basePath}/TreasureChest.json`, 'utf8');
  const treasureChestAddress = JSON.parse(treasureChestFile).address

  const gemTreasureFile = await fs.readFile(`${basePath}/GemTreasure.json`, 'utf8');
  const gemTreasureAddress = JSON.parse(gemTreasureFile).address

  // addtreasure on EgyLove
  await execute(
    'Verifier',
    {from: deployer, log: true},
    'addNewTreasure',
    "TreasureChest",
    treasureChestAddress,
    "mintable"
  );

  await execute(
    'Verifier',
    {from: deployer, log: true},
    'addNewTreasure',
    "GemTreasure",
    gemTreasureAddress,
    "mintable"
  );

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
