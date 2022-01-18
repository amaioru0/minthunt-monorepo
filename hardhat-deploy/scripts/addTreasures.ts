import {deployments, getUnnamedAccounts, getNamedAccounts} from 'hardhat';
const {execute} = deployments;

import { promises as fs } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const network = args[0];

async function main() {
  const {deployer } = await getNamedAccounts();

  const basePath = path.join(__dirname, '../', 'deployments', network)

  const egyLoveFile = await fs.readFile(`${basePath}/EgyLove.json`, 'utf8');
  const egyLoveAddress = JSON.parse(egyLoveFile).address

  // addtreasure on EgyLove
  await execute(
    'TreasureChest',
    {from: deployer, log: true},
    'addTreasure',
    egyLoveAddress, // treasure address
    100000000, // ammount
    0 // id
  );

  await execute(
    'TreasureChest',
    {from: deployer, log: true},
    'addTreasure',
    egyLoveAddress, // treasure address
    200000000, // ammount
    1 // id
  );

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
