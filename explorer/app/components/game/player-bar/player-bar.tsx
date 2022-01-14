import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, StyleSheet, Text, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { iOSUIKit } from 'react-native-typography'
import Egy from '../egy/egy';
import { useNavigation } from '@react-navigation/native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { MyEgy } from './my-egy'

const CONTAINER: ViewStyle = {
  // justifyContent: "center",
  flexDirection: "row",
  width: "100%",
}

const PLAYER: ViewStyle = {
  backgroundColor: 'white',
  height: moderateScale(60),
  width: 180,
  marginTop: moderateScale(20),
  marginLeft: moderateScale(10),
  borderRadius: moderateScale(20),
  flexDirection: 'row',
  borderColor: '#E3E5E8',
  borderWidth: 0.9,
}

const EGY: ViewStyle = {
  position: 'absolute',
  right: 0,
  backgroundColor: 'white',
  height: moderateScale(30),
  width: moderateScale(130),
  marginTop: moderateScale(20),
  marginRight: moderateScale(20),
  borderRadius: moderateScale(20),
  flexDirection: 'row',
  borderColor: '#E3E5E8',
  borderWidth: 0.9,
}

export interface PlayerBarProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const PlayerBar = observer(function PlayerBar(props: PlayerBarProps) {
  const navigation = useNavigation();
  const connector = useWalletConnect();

  return (
    <View style={CONTAINER}>
        <TouchableOpacity style={PLAYER} onPress={() => {
          navigation.navigate('userProfile')
        }}>
          
        {/* <Text style={{color: "#595A66"}}>Hello,</Text> */}

    	  <View>
          <View style={{
           backgroundColor: '#C8BAFF',
           borderRadius: 12,
           margin: 10,
           width: moderateScale(42),
           height: moderateScale(42)
           }}></View>
        </View>

           <View>
          <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: "#595A66", fontSize: 14, lineHeight: 28, marginLeft: 3}}>Hello,</Text>
          <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: "#595A66", fontSize: 8, lineHeight: 28, marginLeft: 1}}>{connector.accounts && connector.accounts[0].slice(0, 22)}..</Text>
        </View>
      </TouchableOpacity>

        <MyEgy />
    </View>
  )
})
