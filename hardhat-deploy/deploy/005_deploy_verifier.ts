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
  const egyLoveFile = await fs.readFile(`${basePath}/EgyLove.json`, 'utf8');
  const egyLoveAddress = JSON.parse(egyLoveFile).address

  await deploy('Verifier', {
    from: deployer,
    args: ["0xA73fe68136086f64DA02f91e0FF99fdC9D9A4008", egyLoveAddress, "EgyLove", "fromVault"],
    log: true,
  });
};
export default func;
func.tags = ['Verifier'];
