import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, StyleSheet, Text, TouchableOpacity, Image } from "react-native"
import { observer } from "mobx-react-lite"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { iOSUIKit } from 'react-native-typography'
import Egy from '../egy/egy';
import { useNavigation } from '@react-navigation/native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import  { web3, getEthersProvider } from "../../../services/provider"
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { useStores } from "../../../models";
import { ethers } from "ethers";
import Token from './token.png';

const GET_EGY_CONTRACT = gql`
  query getEgyContract($network: String!) {
    getEgyContract(network: $network) {
      address
      name
      abi
    }
  }
`;

const EGY: ViewStyle = {
  position: 'absolute',
  right: 0,
  backgroundColor: 'white',
  height: moderateScale(30),
  marginTop: moderateScale(20),
  marginRight: moderateScale(20),
  borderRadius: moderateScale(20),
  flexDirection: 'row',
  borderColor: '#E3E5E8',
  borderWidth: 0.9,
}

export interface MyEgyProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const MyEgy = observer(function MyEgy(props: MyEgyProps) {
  const navigation = useNavigation();
  const connector = useWalletConnect();
  const { settingsStore } = useStores()
    const [balance, setBalance] = React.useState(0);

  const 
    { data: dataEgyContract, loading: loadingEgyContract } = useQuery(GET_EGY_CONTRACT, {
    variables: {
      network: settingsStore.network,
  },
  });


  const getMyEgy = async () => {
    const provider = await getEthersProvider(settingsStore.selectedNetwork);
    const abi = JSON.parse(dataEgyContract.getEgyContract[0].abi)
    const treasureMapContract = new ethers.Contract(dataEgyContract.getEgyContract[0].address, abi, provider);

    const balance = await treasureMapContract.balanceOf(connector.accounts[0])
    setBalance(balance.toNumber())

  }

React.useEffect(() => {
    if(dataEgyContract && !loadingEgyContract) {
        getMyEgy();
    }
}, [dataEgyContract])

  return (
      <View style={EGY}>
        {/* <Egy style={{marginTop: 5, marginLeft: 5}} /> */}
        <Image source={Token} style={{ width: 30, height: 30}} />
        <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: "#595A66", fontSize: 14, lineHeight: 28, marginLeft: 3}}>{balance} EGY</Text>
      </View>
  )
})
