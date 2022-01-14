import Moralis from 'moralis/react-native.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import envs, { EnvsInterface } from "../config/env";

const { MORALIS_KEY } = envs;

export const getMoralis = async (network) => {
    const KOVAN_SERVER = "https://nxd3xl1i2brw.moralishost.com:2053/server"
    const MUMBAI_SERVER = "https://0mnygzcrl18o.usemoralis.com:2053/server"
    Moralis.setAsyncStorage(AsyncStorage);
    Moralis.initialize("DMVSz1GYwCCbBM3gHc5Z4499wANj4LNrS7Wyo3E3");
    switch(network) {
        case "kovan":
          Moralis.serverURL = KOVAN_SERVER;
          break;
        case "mumbai":
          Moralis.serverURL = MUMBAI_SERVER;
          break;
        default:
            Moralis.serverURL = MUMBAI_SERVER;
        }
    return Moralis;
}