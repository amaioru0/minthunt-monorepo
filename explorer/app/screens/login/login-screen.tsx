import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, Image, Text, Platform } from "react-native"
import { Screen } from "../../components"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletConnect, withWalletConnect} from '@walletconnect/react-native-dapp';
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color } from "../../theme"

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Tooltip } from 'react-native-elements';
import { iOSUIKit } from 'react-native-typography'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { convertUtf8ToHex } from '@walletconnect/utils';
import { MyMaps } from "../../components"

import TreasureHuntLogo from '../../../assets/images/logo.png';
import { SelectedNetwork } from "../../components";

// import {signLocation} from '../../utils/signLocation';


// import EthCrypto from "eth-crypto";

const ROOT: ViewStyle = {
  backgroundColor: "#7F81D5",
  flex: 1,
  padding: 20,
}

const CONTAINER: ViewStyle = {
  flexDirection: "column",
  alignItems: "center",
  alignSelf: "center",
  backgroundColor: "white",
  height: scale(300),
  width: scale(300),
  borderRadius: 16,
  marginTop: scale(20),
  flex: 2
}

const BUTTONS_CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "center",
  flex: 1
}


export const LoginScreen = observer(function LoginScreen() {
  // Pull in one of our MST stores
  const { userStore, settingsStore} = useStores()

  const connector = useWalletConnect();

  // React.useEffect(() => {
  //   console.log(connector);
  // }, [connector])

  // const [email, setEmail] = React.useState("");
  // const [password, setPassword] = React.useState("");

  // const login = async () => {
  //   await userStore.loginUser(email, password)
  // }

  // const logOut = async () => {
  //   await userStore.logoutUser();
  // }

  // React.useEffect(() => {
  //   const signLocationTest =  async () => {
  //     const randomNumber= Math.floor(Math.random() * 90000) + 10000;
  //     const signature = await signLocation(1, 2, randomNumber)
  //   }
  //   signLocationTest()
  // }, [])

  const signNonceAndLogin = React.useCallback(async () => {
    try {
      const nonce = await userStore.getNonce(connector.accounts[0])
      // console.log(`Got nonce ${nonce}`)
        // Draft Message Parameters
      const msg = `Ask and you shall receive - ${nonce}`;
      
      const msgParams = [
        convertUtf8ToHex(msg), // Required
        `${connector.accounts[0]}`,
      ];
      console.log(msg);
      const signature = await connector.signPersonalMessage(msgParams);
      // console.log(`sig: ${signature}`)
      await userStore.loginUserEth(connector.accounts[0], signature)
    } catch (e) {
      console.error(e);
    }
  }, [connector]);


const connectWallet = React.useCallback(() => {
  return connector.connect();
}, [connector]);

  // Pull in navigation via hook
  const navigation = useNavigation()

  return (
    <Screen style={ROOT} preset="fixed">
      <SelectedNetwork />
      <View style={{ flex: 1 }}> 

      <Image style={{width: "100%", resizeMode: 'contain'}} source={TreasureHuntLogo} />
      </View>

      <View style={CONTAINER}>
      <View style={{flex: 2, paddingTop: 20}}>
      {connector.connected && settingsStore.selectedNetwork !== "" && <MyMaps/ >}
      </View>
      <View style={{flex: 1}}>
      {connector.connected && settingsStore.selectedNetwork !== "" && userStore.treasureMaps[userStore.getSelectedMap] && <Text style={{...iOSUIKit.calloutObject, color: "#000000", fontSize: moderateScale(15), lineHeight: 38, marginLeft: moderateScale(3)}}>Name: {userStore.treasureMaps[userStore.getSelectedMap].name}</Text>}
      {connector.connected && settingsStore.selectedNetwork !== "" && userStore.treasureMaps[userStore.getSelectedMap] && <Text style={{...iOSUIKit.calloutObject, color: "#000000", fontSize: moderateScale(15), lineHeight: 38, marginLeft: moderateScale(3)}}>Range: {userStore.treasureMaps[userStore.getSelectedMap].range}</Text>}
      </View>

      {connector.connected && settingsStore.selectedNetwork == "" && <Text>Please select a supported network</Text>}
      {/* <Tooltip popover={<Text>Info here</Text>}>
      <Text>Press me</Text>
      </Tooltip> */}
      {!connector.connected && <Text style={{  textAlign: 'center',}}>Connect your Wallet (e.g: MetaMask Mobile)</Text>}


      <View style={BUTTONS_CONTAINER}>
      {!connector.connected && <Button containerStyle={{ width: 120, margin: 10 }} title="Connect" onPress={connectWallet} />}
      {connector.connected && <Button containerStyle={{ width: 120, margin: 10 }} title="Kill Session" onPress={() => connector.killSession()} />}
      {connector.connected && settingsStore.selectedNetwork !== "" && <Button containerStyle={{ width: 120, margin: 10 }} title="Login" onPress={signNonceAndLogin} />}
      </View>
      </View>
      {/* <Text preset="header" text="Explorer v1" /> */}
      <Text style={{...iOSUIKit.calloutObject, color: "#000000", fontSize: moderateScale(15), lineHeight: 38, marginLeft: moderateScale(3)}}>{userStore.getSelectedMap}</Text>

    </Screen>
  )
})

