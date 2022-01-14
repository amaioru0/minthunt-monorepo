import EthCrypto from "eth-crypto";
import envs, { EnvsInterface } from "../config/env";


const { SIGNERPRIVATE } = envs;
export const signLocation = async (lat, lng, nonce) => {
    // const signerIdentity = EthCrypto.createIdentity();
    const privateKey = SIGNERPRIVATE;
    const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
    const address = EthCrypto.publicKey.toAddress(publicKey)
    const signerIdentity = {
      address: address,
      privateKey: privateKey,
      publicKey: publicKey
    }
    // const randomNumber= Math.floor(Math.random() * 90000) + 10000;
    const randomNumber = nonce;
    // console.log(signerIdentity)
    const message = EthCrypto.hash.keccak256([
      {type: "uint256", value: `${lat}`},
      {type: "uint256", value: `${lng}`},
      {type: "uint256", value: `${randomNumber}`}
    ]);
    // console.log(message)
    const signature = EthCrypto.sign(signerIdentity.privateKey, message)
    // console.log(`message: ${message}`);
    console.log(`signature: ${signature}`);
    console.log(`signer address key: ${signerIdentity.address}`);
    console.log(randomNumber)
    return signature;
  }

  export const signApi = async (random) => {
    const privateKey = SIGNERPRIVATE;
    const messageHash = EthCrypto.hash.keccak256(`${random}`);
    const signature = EthCrypto.sign(privateKey, messageHash)
  return signature;
  }