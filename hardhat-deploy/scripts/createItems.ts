import {deployments, getUnnamedAccounts, getNamedAccounts} from 'hardhat';
const {execute} = deployments;

import { promises as fs } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const network = args[0];

async function main() {
  const {deployer } = await getNamedAccounts();

//   const basePath = path.join(__dirname, '../', 'deployments', network)

//   const verifierFile = await fs.readFile(`${basePath}/Verifier.json`, 'utf8');
//   const verifierAddress = JSON.parse(verifierFile).address

  // addtreasure on EgyLove
  await execute(
    'EgyLove',
    {from: deployer, log: true},
    'createItem',
    0, // id
    100000000, // ammount
    "EGY Flare",
    // "ipfs://QmYiY1XnLrxqCqD6bwaLGdcMHMoeG7RZzTnxKJDZ1wPBUE",
    // "rainbow",
    // "NyanCat has once traveled the world and energy flares were left behind."
  );

  await execute(
    'EgyLove',
    {from: deployer, log: true},
    'createItem',
    1, //id
    200000000, // ammount
    "Black Hole",
    // "ipfs://Qmap9k9Zw2mgDYEUGRFwfXnEX36qkM9u6z1ivCqhf2gBRm",
    // "rainbow",
    // "They said that they don't exist, untill scientis proved them wrong."
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
