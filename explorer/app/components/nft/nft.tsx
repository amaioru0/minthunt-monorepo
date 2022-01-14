import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { color, typography, spacing } from "../../theme"
import { iOSUIKit } from 'react-native-typography'
import { stringToColor, hexToRgb } from '../../utils/stringToColor';
import { Button } from 'react-native-elements';
import { ethers } from "ethers";
import Image from 'react-native-remote-svg';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useStores } from "../../models";

import { getWeb3Instance, getEthersProvider } from "../../services/provider";
import { isBase64 } from "../../utils/isBase64";

const CONTAINER: ViewStyle = {
  // justifyContent: "center",
  flexDirection: "column",
  width: "100%",
  margin: 5
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

const BUTTON: ViewStyle = {

}

export interface NftProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  nft?: any,
  contractsInstances?: any
}

/**
 * Describe your component here
 */
export const Nft = observer(function Nft(props: NftProps) {

    const { nft } = props;
    const connector = useWalletConnect();
    const { settingsStore } = useStores()

    const hex = stringToColor(`${nft.name}pl`);
    const rgba = hexToRgb(hex);

    const [imageUri, setImageUri] = React.useState(nft.imageDecoded.startsWith("http") ? nft.imageDecoded : `data:image/svg+xml;utf8,${nft.imageDecoded}`);
  
  return (

    <View style={CONTAINER}>

    <View style={{ 
        flexDirection: "row",
        width: moderateScale(150),
        height: moderateScale(150),
        backgroundColor: `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
     }}>
         {/* <Image source={{ uri: nft.image}} style = {{height: 120, width: 120,  margin: 5 }} /> */}
         <View style={{ position: "absolute", top: -10, right: 5}}>
         <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: "black", fontSize: moderateScale(10), lineHeight: 38, marginLeft: moderateScale(3)}}>qty: {nft.amount}</Text>
         </View>
        <Image
        source={{
          uri: imageUri,
        }}
        style={{ width: 138, height: 138, margin: 5, alignSelf: "center" }}
       />
    </View>
    <View style={{flexDirection:'row'}}>
        <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: hex, fontSize: moderateScale(15), lineHeight: 38, marginLeft: moderateScale(3)}}>{nft.name}</Text>
        {/* {nft.attributes[0] && <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: moderateScale(15), lineHeight: 38, marginLeft: moderateScale(3) }}>({jsonData.attributes[0].value})</Text>} */}
     </View>

     <View style={{flexDirection:'row'}}>
     <Button
      buttonStyle={{
        // backgroundColor: 'rgba(92, 99,216, 1)',
        // borderColor: 'transparent',
        padding: 1,
      }}
      containerStyle={{
        width: 66,
        height: 20,
      }}
      titleStyle={{
        fontSize: 12,
      }}
      disabled={false}
      loading={false}
     title="Transfer"
     onPress={async () => {
       const provider = await getEthersProvider(settingsStore.selectedNetwork)
      const contract = new ethers.Contract(nft.token_address, nft.abi, provider);
       const unsignedTx = await contract.populateTransaction["safeTransferFrom(address,address,uint256)"](connector.accounts[0], "0x03bC5F1Bb64a9Ff243AF472926465DD6d91cC23A", nft.token_id)
       const estgas = await contract.estimateGas["safeTransferFrom(address,address,uint256)"](connector.accounts[0], "0x03bC5F1Bb64a9Ff243AF472926465DD6d91cC23A", nft.token_id)
       const nonce = await provider.getTransactionCount(connector.accounts[0]);
       const gasPrice = await provider.getGasPrice()
       const gasPriceHex = ethers.utils.hexlify(gasPrice.toNumber());
       const tx = {
        data: unsignedTx.data,
        from: connector.accounts[0],
        gas: estgas._hex,
        gasPrice: gasPriceHex,
        nonce: `0x${nonce}`,
        to: unsignedTx.to,
        value: '0x00',
       }
       
      connector.sendTransaction(tx).then(async (res) => {
        console.log(`transcation done`)
        console.log(res)
      }).catch(async (err) => {
        console.log(`transcation fail`)
        console.log(err)
      })
        //  const tx = await contractsInstances[nft.contractIndex].contract.safeTransferFrom(connector.accounts[0], "0x7084C8A2943df2115C4Ca9b70ce6b963A5993906", 3)
        //  console.log(tx)
     }}
    />

    {nft.name === "TreasureChest" && <Button
      buttonStyle={{
        // backgroundColor: 'rgba(92, 99,216, 1)',
        // borderColor: 'transparent',
        padding: 1,
      }}
      containerStyle={{
        width: 66,
        height: 20,
      }}
      titleStyle={{
        fontSize: 12,
      }}
      disabled={false}
      loading={false}
     title="Open"
     onPress={async () => {
       console.log("click")
      // const contract = new ethers.Contract(nft.token_address, nft.abi, provider);
      //  const unsignedTx = await contract.populateTransaction["openChest"](nft.token_id)
      //  const estgas = await contract.estimateGas["openChest"](nft.token_id)
      const provider = await getEthersProvider(settingsStore.selectedNetwork)
      const web3 = await getWeb3Instance(settingsStore.selectedNetwork)
      const treasureChestContract = new web3.eth.Contract(nft.abi, nft.token_address);

      const gasLimitHex = ethers.utils.hexlify(700000);    
       const nonce = await provider.getTransactionCount(connector.accounts[0]);
       const gasPrice = await provider.getGasPrice()
       const gasPriceHex = ethers.utils.hexlify(gasPrice.toNumber());
       const tx = {
        data: treasureChestContract.methods.openChest(nft.token_id).encodeABI(),
        from: connector.accounts[0],
        // gas: estgas._hex,
        gas: gasLimitHex,
        gasPrice: gasPriceHex,
        nonce: `0x${nonce}`,
        to: nft.token_address,
        value: '0x00',
       }
       
      connector.sendTransaction(tx).then(async (res) => {
        console.log(`transcation done`)
        console.log(res)
      }).catch(async (err) => {
        console.log(`transcation fail`)
        console.log(err)
      })
        //  const tx = await contractsInstances[nft.contractIndex].contract.safeTransferFrom(connector.accounts[0], "0x7084C8A2943df2115C4Ca9b70ce6b963A5993906", 3)
        //  console.log(tx)
     }}
    />}

    <Button
      buttonStyle={{
        // backgroundColor: 'rgba(92, 99,216, 1)',
        // borderColor: 'transparent',
        padding: 1,
      }}
      containerStyle={{
        width: 50,
        height: 20,
        marginLeft: 5
      }}
      titleStyle={{
        fontSize: 12,
      }}
      disabled={false}
      loading={false}
     title="Sell"
     onPress={async () => {

     }}
    />
    </View>

    </View>
  )
})
