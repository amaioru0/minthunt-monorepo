import {deployments, getUnnamedAccounts, getNamedAccounts} from 'hardhat';
const {execute} = deployments;

import { promises as fs } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const network = args[0];

async function main() {
  const {deployer } = await getNamedAccounts();

    // setVerifier on GemTreasure
    await execute(
      'GemTreasure',
      {from: deployer, log: true},
      'setVerifierAddress',
      `0x455a7e1C2A0e366FA410Dfef5686ee539D056939`
    );
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
