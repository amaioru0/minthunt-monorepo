import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { Crafting } from "../../components";

const ROOT: ViewStyle = {
  backgroundColor: "#CC41CC",
  flex: 1,
}

interface CraftingScreeProps {
  navigation?: any
}

export const CraftingScreen = observer(function CraftingScreen(props:CraftingScreeProps) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const connector = useWalletConnect();
  // @ts-ignore
  const { route, navigation } = props;
  const { nftsData, getTreasureChestNFTs, setNftsData, dataContracts } = route.params;

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen navigation={navigation} style={ROOT} preset="fixed">
        {connector.connected && <Crafting dataContracts={dataContracts} nftsData={nftsData} getTreasureChestNFTs={getTreasureChestNFTs} setNftsData={setNftsData} />}
    </Screen>
  )
})
