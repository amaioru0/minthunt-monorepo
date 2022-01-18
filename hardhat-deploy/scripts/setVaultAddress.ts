import {deployments, getUnnamedAccounts, getNamedAccounts} from 'hardhat';
const {execute} = deployments;


// const args = process.argv.slice(2);
// const network = args[0];

async function main() {
  const {deployer } = await getNamedAccounts();

//   const basePath = path.join(__dirname, '../', 'deployments', network)

//   const verifierFile = await fs.readFile(`${basePath}/Verifier.json`, 'utf8');
//   const verifierAddress = JSON.parse(verifierFile).address
    console.log(deployer);

  // setVerifier on EgyLove
  await execute(
    'Verifier',
    {from: deployer, log: true},
    'setVaultAddress',
    `${deployer}`
  );

  await execute(
    'TreasureChest',
    {from: deployer, log: true},
    'setVaultAddress',
    `${deployer}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
