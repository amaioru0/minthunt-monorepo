/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { WelcomeScreen, DemoScreen, DemoListScreen, ExploreMapScreen, WalletScreen, NftFullScreen, UserProfileScreen, CraftingScreen } from "../screens"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useStores } from "../models"
import { observer } from "mobx-react-lite"

// import { useWalletConnect } from '@walletconnect/react-native-dapp';
// import { ethers } from "ethers";
// import explorerMapContractJSON from '../contracts/ExplorerMap.sol/ExplorerMap.json'
// import provider from "../services/provider";
// import { ExplorerMap as explorerMapContractAddress } from '../contracts/contractAddress';
/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type PrimaryParamList = {
  welcome: undefined
  demo: undefined
  demoList: undefined
  exploreMap: undefined
  wallet: undefined
  crafting: undefined
  mainMenu: undefined
  nftFullScreen: undefined
  userProfile: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createStackNavigator<PrimaryParamList>()
const BottomTab = createBottomTabNavigator();

export const BottomTabNavigator = (props) => {
  // const { t } = useTranslation();
  // const { colors } = useTheme();
  return (
    <BottomTab.Navigator
      initialRouteName="exploreMap"
      tabBarOptions={{
        // showIcon: true,
        showLabel: true,
        // activeTintColor: colors.primaryColor,
        // inactiveTintColor: colors.primaryColor,
        // style: BaseStyle.tabBar,
        labelStyle: {
          fontSize: 12,
        },
      }}
    >
      <BottomTab.Screen
        name="exploreMap"
        component={ExploreMapScreen}
        options={{
          title: "Map",
          // tabBarIcon: ({ color }) => {
          //   return <Icon name="inbox" size={20} solid color={color} />;
          // },
        }}
      />

      <BottomTab.Screen
        name="wallet"
        component={WalletScreen}
        options={{
          title: "Wallet",
          // tabBarIcon: ({ color }) => {
          //   return <Icon name="th-large" size={20} solid color={color} />;
          // },
        }}
      />
  </BottomTab.Navigator>
  );
};

export const MainNavigator = observer(function MainNavigator() {
  const { userStore } = useStores()
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
  // }, [])

  return (
    <Stack.Navigator
      initialRouteName={"exploreMap"}
      screenOptions={{
        cardStyle: { backgroundColor: "transparent" },
        headerShown: false,
      }}
    >
      <Stack.Screen name="mainMenu" component={BottomTabNavigator} />
      <Stack.Screen name="nftFullScreen" component={NftFullScreen} />
      <Stack.Screen name="userProfile" component={UserProfileScreen} />
      <Stack.Screen name="crafting" component={CraftingScreen} />

      {/* <Stack.Screen name="exploreMap" component={ExploreMapScreen} />
      <Stack.Screen name="wallet" component={WalletScreen} />  */}
    </Stack.Navigator>
  )
})

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["exploreMap"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
