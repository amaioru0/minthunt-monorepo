import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Button, View} from "react-native"
import { Screen, Text  } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
// import { color } from "../../theme"


// import { ethers } from "ethers";
// import provider from "../../services/provider"
import { Wallet } from '../../components/wallet/wallet';
// import { NoWallet } from '../../components/wallet/noWallet';

// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// import { iOSUIKit } from 'react-native-typography'

import { useWalletConnect } from '@walletconnect/react-native-dapp';

const ROOT: ViewStyle = {
  backgroundColor: "#0ED67F",
  flex: 1,
}

interface WalletScreenProps {
  navigation?: any
}

export const WalletScreen = observer(function WalletScreen(props:WalletScreenProps ) {
  const { navigation } = props;
  // const { walletStore } = useStores()
  // const signer = provider.getSigner()
  const connector = useWalletConnect();

  // const generateWallet = () => {
  //   const mnemonicX = ethers.Wallet.createRandom().mnemonic
  //   // const walletX = ethers.Wallet.createRandom()
  //   const walletX = ethers.Wallet.fromMnemonic(mnemonicX.phrase.toString())
  //   walletStore.setWallet({
  //     address: walletX.address,
  //     publicKey: walletX.publicKey,
  //     privateKey: walletX.privateKey,
  //     mnemonic: mnemonicX.phrase.toString(),
  //     hasWallet: true
  //   })
  // }

  return (
    <Screen navigation={navigation} style={ROOT} preset="fixed">
      {/* {walletStore.hasWallet && <Wallet walletStore={walletStore} generateWallet={generateWallet} />}
      {!walletStore.hasWallet && <NoWallet walletStore={walletStore} generateWallet={generateWallet} />} */}
         {connector.connected && <Wallet />}

    </Screen>
  )
})
