/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import "./i18n"
import "./utils/ignore-warnings"
import React, { useState, useEffect, useRef } from "react"
import { NavigationContainerRef } from "@react-navigation/native"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"
import { initFonts } from "./theme/fonts" // expo
import * as storage from "./utils/storage"
import {
  useBackButtonHandler,
  RootNavigator,
  canExit,
  setRootNavigation,
  useNavigationPersistence,
} from "./navigators"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
// import { ToggleStorybook } from "../storybook/toggle-storybook"

import apolloClient from './services/apollo';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'react-native-elements';
//
import JailMonkey from 'react-native-pvt-jail-monkey'
let params = {debug:false,checkEmulator:false,keyStoreSignature:"5E:8F:16:206:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25"}
import DeviceInfo from 'react-native-device-info'



// Import the crypto getRandomValues shim (**BEFORE** the shims)
// import "react-native-get-random-values"
// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"
// Import the ethers library
import { ethers } from "ethers";
// NFT Provider
import { NftProvider } from "use-nft"
import AsyncStorage from '@react-native-async-storage/async-storage';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import { Platform, View, Text} from "react-native";
// import { useColorScheme } from 'react-native-appearance';
import provider from './services/provider';

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
import { enableScreens } from "react-native-screens"
enableScreens()

import axios from 'axios';
import { DEFAULT_API_CONFIG } from "./services/api/api-config"

const APPVERSION = '1.1'

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"
// export const INFURA_ID = 'bc7ae83f636c4d5fb7d227283cc2918c'

// const config: Config = {
//   readOnlyUrls: {
//     [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${INFURA_ID}`,
//     [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${INFURA_ID}`,
//     // [ChainId.Hardhat]: 'http://localhost:8545',
//     // [ChainId.Localhost]: 'http://localhost:8545',
//   },
//   supportedChains: [
//     ChainId.Mainnet,
//     // ChainId.Goerli,
//     // ChainId.Kovan,
//     // // ChainId.Rinkeby,
//     ChainId.Ropsten,
//     // ChainId.xDai,
//     // ChainId.Localhost,
//     // ChainId.Hardhat,
//   ],
//   // multicallAddresses: {
//   //   ...MULTICALL_ADDRESSES,
//   //   [ChainId.Hardhat]: MulticallContract,
//   //   [ChainId.Localhost]: MulticallContract,
//   // },
// }


/**
 * This is the root component of our app.
 */
function App() {
  const navigationRef = useRef<NavigationContainerRef>(null)
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [isGoodVersion, setIsGoodVersion] = React.useState(false);

  useBackButtonHandler(navigationRef, canExit)

  const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY,
  )

  const [isSafe, setIsSafe] = React.useState(true)

  JailMonkey.isSafe(params).then(()=> {
    setIsSafe(true)
    JailMonkey.externalCheck({ 
      "magisk": true, //android only
      'isRunningOnMac': true, //ios only
      'isJb': true, //ios only
      'isInjectedWithDynamicLibrary': true, //ios only
      'isSecurityCheckPassed': true, //ios only
      'isDebugged':true, //ios only
      'isFromAppStore':true //ios only
     }).then((ok) => {
      const isEmulator = DeviceInfo.isEmulator();
      if(isEmulator) {
        // turn on emulator proection
        // setIsSafe(false);
      }
      }, ({ code, message }) => {
        // {"code":"error","message":"magisk"}
        setIsSafe(false)
      })
  },()=>{
    setIsSafe(false)
    })

  // customize react-nativem-elements themeProvider
  const theme = {
    Button: {
      buttonStyle: {
      backgroundColor: '#7F81D5'
      },
      containerStyle: {
        borderRadius: 12,
        // marginHorizontal: "50",
        // marginVertical: "10",
      },
      titleStyle: {
        color: 'white',
      }
    },
  }

  // const colorScheme = useColorScheme();

  useEffect(() => {
    const getAppVersion = async () => {
      axios.get(`${DEFAULT_API_CONFIG.url}/system/appversion`).then((res) => {
        const isGoodVersionx = res.data == APPVERSION;
        setIsGoodVersion(isGoodVersionx)
      }).catch((err) => {
        console.log(err)
      })
    }
    getAppVersion();
  })

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    ;(async () => {
      await initFonts() // expo
      setupRootStore().then(setRootStore)
    })()
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color. You can replace
  // with your own loading component if you wish.
  if (!rootStore) return null

  // otherwise, we're ready to render the app
  return (
     <ThemeProvider theme={theme}>
       { isSafe ? 
      <RootStoreProvider value={rootStore}>
       <ApolloProvider client={apolloClient}>
        <WalletConnectProvider
        // bridge={"http://minthunt.io:5000/"}
        clientMeta={{
          description: 'Connect to MintHunt',
          url: 'https://minthunt.io',
          icons: ['https://walletconnect.org/walletconnect-logo.png'],
          name: 'MintHunt',
        }}
        // metadata={{
        //   name: "MintHunt",
        //   description: "MintHunt.io",
        //   url: "#",
        //   icons: ["https://placehold.jp/150x50.png"],
        // }}
        redirectUrl={Platform.OS === 'web' ? window.location.origin : 'minthunt://'}
        storageOptions= {{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
          asyncStorage: AsyncStorage,
        }}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <RootNavigator
            ref={navigationRef}
            initialState={initialNavigationState}
            onStateChange={onNavigationStateChange}
          />
        </SafeAreaProvider>
        </WalletConnectProvider>
       </ApolloProvider>
    
      </RootStoreProvider>
     :
     <View>

     </View>
    }
     </ThemeProvider>
  )
}

export default App
