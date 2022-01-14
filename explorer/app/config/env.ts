import {
    SIGNERPRIVATE,
    MORALIS_KEY
} from "react-native-dotenv";

const devEnvVariables = {
    SIGNERPRIVATE,
    MORALIS_KEY
}

const prodEnvVariables = {
    SIGNERPRIVATE,
    MORALIS_KEY
}

export interface EnvsInterface {
    SIGNERPRIVATE,
    MORALIS_KEY
}

// import envs, { EnvsInterface } from "./config/envs";
// const { BASE_URL, API_KEY } = envs;

// If we're in dev use "devEnvVariables" otherwise, use "prodEnvVariables"
export default __DEV__ ? devEnvVariables : prodEnvVariables;
