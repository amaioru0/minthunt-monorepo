import {
    SIGNERPRIVATE
} from "react-native-dotenv";

const devEnvVariables = {
    SIGNERPRIVATE
}

const prodEnvVariables = {
    SIGNERPRIVATE
}

export interface EnvsInterface {
    SIGNERPRIVATE
}

// import envs, { EnvsInterface } from "./config/envs";
// const { BASE_URL, API_KEY } = envs;

// If we're in dev use "devEnvVariables" otherwise, use "prodEnvVariables"
export default __DEV__ ? devEnvVariables : prodEnvVariables;