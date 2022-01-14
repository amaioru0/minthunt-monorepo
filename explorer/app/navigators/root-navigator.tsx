/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your MainNavigator) which the user
 * will use once logged in.
 */
 import React from "react"
 import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
 import { createStackNavigator } from "@react-navigation/stack"
 import { MainNavigator } from "./main-navigator"
 import { UserNavigator } from "./user-navigator"
 import { NoMapsNavigator } from "./no-maps-navigator";

 import { color } from "../theme"
//  import { isLoggedIn } from 'react-native-axios-jwt'
 import { useStores } from "../models"
 import { observer } from "mobx-react-lite"

//  import { useWalletConnect } from '@walletconnect/react-native-dapp';
//  import { ethers } from "ethers";
//  import explorerMapContractJSON from '../contracts/ExplorerMap.sol/ExplorerMap.json'
//  import provider from "../services/provider";
// import { ExplorerMap as explorerMapContractAddress } from '../contracts/contractAddress';
 /**
  * This type allows TypeScript to know what routes are defined in this navigator
  * as well as what properties (if any) they might take when navigating to them.
  *
  * We recommend using MobX-State-Tree store(s) to handle state rather than navigation params.
  *
  * For more information, see this documentation:
  *   https://reactnavigation.org/docs/params/
  *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
  */
 export type RootParamList = {
   mainStack: undefined
   userStack: undefined
   noMapsStack: undefined
 }
 
 const Stack = createStackNavigator<RootParamList>()

 const RootStack = observer(function RootStack() {
   const { userStore } = useStores()
  //  const [loggedIn, setLoggedIn] = React.useState(userStore.isLoggedIn)
  // const connector = useWalletConnect();
  // const contract = new ethers.Contract(explorerMapContractAddress, explorerMapContractJSON.abi, provider);
  // const [loading, setLoading] = React.useState(false);

  // const checkForMapNFT = async () => {
  //   const tokens = await contract.tokensByOwner(connector.accounts[0]);
  //   if(tokens.length) {
  //     console.log(`Found ${tokens.length} maps`)
  //     userStore.setHasMaps(true);
  //   } else {
  //     console.log(`No maps, no access`)
  //     userStore.setHasMaps(false);
  //   }
  // }

  // React.useEffect(() => {
  //   checkForMapNFT();
  // }, [connector.connected])


   return (
     <Stack.Navigator
       screenOptions={{
         cardStyle: { backgroundColor: color.palette.deepPurple },
         headerShown: false,
       }}
     >
      {userStore.isLoggedIn ?
        <Stack.Screen
        name="mainStack"
        component={MainNavigator}
        options={{
          headerShown: false,
        }}
        />
       :
       <Stack.Screen
       name="userStack"
       component={UserNavigator}
       options={{
         headerShown: false,
       }}
     />
       }
     </Stack.Navigator>
   )
 })
 
 export const RootNavigator = React.forwardRef<
   NavigationContainerRef,
   Partial<React.ComponentProps<typeof NavigationContainer>>
 >((props, ref) => {
   return (
     <NavigationContainer {...props} ref={ref}>
       <RootStack />
     </NavigationContainer>
   )
 })
 
 RootNavigator.displayName = "RootNavigator"
 