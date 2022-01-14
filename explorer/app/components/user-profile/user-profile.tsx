import * as React from "react"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { flatten } from "ramda"
import { useStores } from "../../models"
import { Button } from 'react-native-elements';
import { SelectedNetwork } from "../../components";
import { MyMaps } from "../../components"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { ViewStyle, View, Image, Text, StyleProp } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { GoBack } from '../go-back/go-back';
import { iOSUIKit } from 'react-native-typography'
import { MyEgy } from "../game/player-bar/my-egy";

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



export interface UserProfileProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const UserProfile = observer(function UserProfile(props: UserProfileProps) {
  const { style } = props
  const styles = flatten([CONTAINER, style])
  const { userStore, settingsStore} = useStores()
  const navigation = useNavigation()
  const connector = useWalletConnect();


  return (
    <View style={ROOT}>
      <SelectedNetwork />
      <GoBack />
      <MyEgy />
      <View style={CONTAINER}>
      <View style={{ flex: 1 }}> 
      <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: "#595A66", fontSize: 10, lineHeight: 10, marginLeft: 1, marginTop: 10, textAlign: "center"}}>Connected as:</Text>
      <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: "#595A66", fontSize: 10, lineHeight: 10, marginLeft: 1, marginTop: 5}}>{connector.accounts && connector.accounts[0]}</Text>
      </View>

      <View style={{ flex: 2 }}> 
      <MyMaps />
      </View>

      <View style={{flex: 1}}>
      {connector.connected && settingsStore.selectedNetwork !== "" && userStore.treasureMaps[userStore.getSelectedMap] && <Text style={{...iOSUIKit.calloutObject, color: "#000000", fontSize: moderateScale(15), lineHeight: 38, marginLeft: moderateScale(3)}}>Name: {userStore.treasureMaps[userStore.getSelectedMap].name}</Text>}
      {connector.connected && settingsStore.selectedNetwork !== "" && userStore.treasureMaps[userStore.getSelectedMap] && <Text style={{...iOSUIKit.calloutObject, color: "#000000", fontSize: moderateScale(15), lineHeight: 38, marginLeft: moderateScale(3)}}>Range: {userStore.treasureMaps[userStore.getSelectedMap].range}</Text>}
      </View>

      <View style={{ flex: 1 }}> 
      <Button title="Log Out" onPress={async () => {
            await userStore.logoutUser();
          }} />
      </View>
    
    </View>
    </View>
  )
})
