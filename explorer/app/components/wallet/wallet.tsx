import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Text, TouchableOpacity, TouchableHighlight, Image, FlatList} from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { iOSUIKit } from 'react-native-typography'

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"
// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"
// Import the ethers library
import { ethers } from "ethers";
// import provider from "../../services/provider"
import Tx from 'ethereumjs-tx';
import contractJson from '../../services/TreasureCHEST.json'
import LeafSVG from './leaf-svg';
import { Nft } from '../../components/nft/nft';
import { FlatGrid } from 'react-native-super-grid';

const CONTAINER: ViewStyle = {
  flex: 1,
  alignItems: 'center',
}

const LEAF_STYLE: ViewStyle = {
  position: 'absolute',
  top: verticalScale(-200),
}

const CONTAINER_WALLET: ViewStyle = {
  alignItems: "center",
  backgroundColor: "white",
  height: moderateScale(500),
  width: moderateScale(380),
  borderRadius: 16
}

const BOTTOM: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-end',
}

export interface WalletProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  walletStore?: any
  generateWallet?: any
  signer?: any
}

/**
 * Describe your component here
 */
export const Wallet = observer(function Wallet(props: WalletProps) {
  const { walletStore, generateWallet } = props;
  const URL_NODE = "https://speedy-nodes-nyc.moralis.io/d2355f2c92961a3a4f1ce86f/polygon/mumbai"
  const provider = new ethers.providers.JsonRpcProvider(URL_NODE);

  const wallet = new ethers.Wallet(walletStore.privateKey, provider);
  const signer = provider.getSigner()
  const contractAddress = "0x3e730332759b2bF34d19680e942110328b42a8ba";
  const contract = new ethers.Contract(contractAddress, contractJson.abi, wallet);

  // const getTokenURI = contract.tokenURI(1)


  const [treasureChestNFTs, setTreasureChestNFTs] = React.useState([])
  const [loading, setLoading] = React.useState(false);


  const getTreasureChestNFTs = async () => {
    setLoading(true)
    const nfts = []
    const balanceOf = await contract.balanceOf(walletStore.address)
    if(balanceOf.toNumber() == 0) {
      console.log("No NFTS")
      setLoading(false)
      return;
    }
    for(let i = 0; i < balanceOf.toNumber(); i++) {
      const tokenOfOwnerByIndex = await contract.tokenOfOwnerByIndex(walletStore.address, i)
      const uri = await contract.tokenURI(tokenOfOwnerByIndex.toNumber())
      nfts.push({ id: tokenOfOwnerByIndex.toNumber(), uri: uri })
    }
    setTreasureChestNFTs(nfts)
    setLoading(false)
  }

  React.useEffect(() => {
    getTreasureChestNFTs();
  }, [])



  return (
    <View style={CONTAINER}>
      <LeafSVG style={LEAF_STYLE}  />
         <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.white, fontWeight: "900", fontSize: 26, marginLeft: moderateScale(-140), marginTop: moderateScale(30)}}>{`Your Collection`}</Text>
         <Text style={{...iOSUIKit.subheadEmphasized.valueOf , color: color.palette.white,  marginTop: moderateScale(1)}} selectable={true}>{walletStore.address}</Text>

      <View style={BOTTOM}>
      <View style={CONTAINER_WALLET}>
      {loading && <Text> Loading </Text>}
      {!loading && treasureChestNFTs.length == 0 && <Text>No NFTs found yet 😔</Text>}

      {!loading && 
        <FlatGrid
        itemDimension={170}
        data={treasureChestNFTs}
        style={{
          marginTop: 10,
          flex: 1,
        }}
        // staticDimension={300}
        // fixed
        spacing={10}
        renderItem={({ item }) => (
          <View>
             <Nft nft={item} contract={contract} />
          </View>
        )}
      />
      }

      {/* {!loading && <View>
        {treasureChestNFTs.map((nft) => {
          return <Nft contract={contract} nft={nft}/>
        })}
        </View>
      } */}
      </View>
      </View>

    </View>
  )
})