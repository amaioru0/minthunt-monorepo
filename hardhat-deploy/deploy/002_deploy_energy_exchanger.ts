import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
// import {parseEther} from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('EnergyExchanger', {
    from: deployer,
    args: ["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000"],
    log: true,
  });
};
export default func;
func.tags = ['EnergyExchanger'];
