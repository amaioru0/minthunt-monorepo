import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Button } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from ".."

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"
// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"
// Import the ethers library
import { ethers } from "ethers";
// import provider from "../../services/provider"
import Tx from 'ethereumjs-tx';
import contractJson from '../../services/TreasureCHEST.json'

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface WalletProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  walletStore?: any
  generateWallet?: any
}

/**
 * Describe your component here
 */
export const NoWallet = observer(function Wallet(props: WalletProps) {
  const { walletStore, generateWallet } = props;


  return (
    <View style={CONTAINER}>

      <Button title={"generate wallet"} onPress={async () => {
        generateWallet();
      }} />
   
    </View>
  )
})
