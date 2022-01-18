import {deployments, getUnnamedAccounts, getNamedAccounts} from 'hardhat';
const {execute} = deployments;

import { promises as fs } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const network = args[0];

async function main() {
  const {deployer } = await getNamedAccounts();

  const basePath = path.join(__dirname, '../', 'deployments', network)

  const verifierFile = await fs.readFile(`${basePath}/Verifier.json`, 'utf8');
  const verifierAddress = JSON.parse(verifierFile).address

  const treasureChestFile = await fs.readFile(`${basePath}/TreasureChest.json`, 'utf8');
  const treasureChestAddress = JSON.parse(treasureChestFile).address


  // setVerifier on EgyLove
  await execute(
    'EgyLove',
    {from: deployer, log: true},
    'setApprovalForAll',
    `${verifierAddress}`,
    true
  );

  await execute(
    'EgyLove',
    {from: deployer, log: true},
    'setApprovalForAll',
    `${treasureChestAddress}`,
    true
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
