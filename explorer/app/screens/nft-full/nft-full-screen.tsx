import React from "react"
import { Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { StyleProp, TextStyle, View, ViewStyle, StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { color, typography, spacing } from "../../theme"
import { iOSUIKit } from 'react-native-typography'
import { stringToColor, hexToRgb } from '../../utils/stringToColor';
import { ethers } from "ethers";
import Image from 'react-native-remote-svg';
import { Card, ListItem, Icon } from 'react-native-elements'



export const NftFullScreen = observer(function NftFullScreen(props) {
  // @ts-ignore
  const { route, navigation } = props;
  const { nft } = route.params;
  const connector = useWalletConnect();

  const hex = stringToColor(`${nft.name}pl`);
  const rgba = hexToRgb(hex);

  const ROOT: ViewStyle = {
    backgroundColor: `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`,
    flex: 1,
  }
  
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={ROOT} preset="scroll">

      <Card>
      <Image
        source={{
          uri: `data:image/svg+xml;utf8,${nft.imageDecoded}`,
        }}
        style={{ width: 300, height: 200, margin: 5, marginLeft: 50, alignSelf: "center" }}
       />
  <Card.Divider/>
  <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: hex, fontSize: moderateScale(30), lineHeight: 38, marginLeft: moderateScale(3)}}>{nft.name}</Text>

</Card>

    </Screen>
  )
})
