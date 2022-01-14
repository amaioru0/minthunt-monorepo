import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useStores } from "../../models";

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  position: "absolute",
  right: 0,
  marginRight: 10,
  marginTop: 5
}


export interface SelectedNetworkProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const SelectedNetwork = observer(function SelectedNetwork(props: SelectedNetworkProps) {
  const { settingsStore } = useStores()
  const connector = useWalletConnect();

  React.useEffect(() => {
    // console.log(connector)
    if(connector.session) {
    settingsStore.setChainId(connector.session.chainId)
    switch (connector.session.chainId) {
      case 42:
        settingsStore.setNetwork('kovan')
        break;
      case 1:
          settingsStore.setNetwork('mainnet')
          break;
      case 3:
          settingsStore.setNetwork('ropsten')
          break;
      case 137:
          settingsStore.setNetwork('matic')
          break;
      case 80001:
          settingsStore.setNetwork('matic-testnet')
          break;
      default:
        settingsStore.setNetwork("")
    }
  }
  console.log(settingsStore.getchainId)
  console.log(settingsStore.selectedNetwork)
  }, [connector])

  React.useEffect(() => {
    if(!connector.connected) {
      settingsStore.setChainId(0)
      settingsStore.setNetwork("")
    }
  }, [])

  return (
    <View style={CONTAINER}>
      <Text>{settingsStore.selectedNetwork && settingsStore.selectedNetwork}</Text>
      <Text>{!settingsStore.selectedNetwork && `no network`}</Text>
    </View>
  )
})
