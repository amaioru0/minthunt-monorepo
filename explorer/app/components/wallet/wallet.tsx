import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Text, TouchableOpacity, TouchableHighlight, Image, FlatList, ActivityIndicator} from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { iOSUIKit } from 'react-native-typography';
import { RefreshControl } from 'react-native';
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { ethers } from "ethers";
import LeafSVG from './leaf-svg';
import { Nft } from '../../components/nft/nft';
import { FlatGrid } from 'react-native-super-grid';
import { useStores } from "../../models";
import { getWeb3Instance, getEthersProvider } from "../../services/provider";
import base64 from 'react-native-base64'
  import { useNavigation } from '@react-navigation/native';
import { getMoralis } from '../../services/moralis';
import { isBase64 } from '../../utils/isBase64';
import axios from 'axios';

import { SelectedNetwork } from "..";

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
  height: verticalScale(450),
  width: scale(380),
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

const GET_TREASURE_CONTRACTS = gql`
  query getTreasureContracts($network: String!) {
    getTreasureContracts(network: $network) {
      address
      name
      abi
    }
  }
`;




/**
 * Describe your component here
 */
export const Wallet = observer(function Wallet(props: WalletProps) {
  // const { walletStore, generateWallet } = props;
  const connector = useWalletConnect();
  const { settingsStore } = useStores()
  const navigation = useNavigation();

  function toPaddedHexString(num, len) {
    let str = num.toString(16);
    return "0".repeat(len - str.length) + str;
}

  const { data: dataContracts, loading: loadingContracts } = useQuery(GET_TREASURE_CONTRACTS, {
    variables: {
      network: settingsStore.selectedNetwork,
  },
  });

  const [nftsData, setNftsData] = React.useState([])
  const [loading, setLoading] = React.useState(false);
  

  const getTreasureChestNFTs = async () => {
    setLoading(true)
    const nfts = [];
    const otherNfts = []
    // const web3 = await getWeb3Instance(settingsStore.selectedNetwork)
    const provider = await getEthersProvider(settingsStore.selectedNetwork)
    const Moralis = await getMoralis(settingsStore.selectedNetwork);
    const options = { chain: settingsStore.selectedNetwork == "matic-testnet" ? "mumbai" : settingsStore.selectedNetwork, address: connector.accounts[0] };
    const testnetNFTs = await Moralis.Web3API.account.getNFTs(options);
    console.log("here")

    console.log(testnetNFTs)


    for(let x = 0; x < dataContracts.getTreasureContracts.length; x++) {
      let contractJSON = dataContracts.getTreasureContracts[x];
      let abi = JSON.parse(contractJSON.abi)
      const nftsTemp: Object[] = await Promise.all(testnetNFTs.result.map(async (item): Promise<Object> => {
        if(item.token_address.toLowerCase() == dataContracts.getTreasureContracts[x].address.toLowerCase()) {
          const contract = new ethers.Contract(item.token_address, abi, provider);
          let uri; // raw response of uri function
          let metadata; // parsed uri
          let imageUri // image uri
          if(item.contract_type === "ERC721") {
            try {
              uri = await contract.tokenURI(item.token_id)
            } catch(err) {
            }
          } else if(item.contract_type === "ERC1155") {
            try {
              uri = await contract.uri(item.token_id)
            } catch(err) {

            }
          }
          if (uri) {

          // if base uri is base64
          if(isBase64(uri.substring(29))) {
            let jsonManifestString = atob(uri.substring(29))
            metadata = JSON.parse(jsonManifestString);
            // if uri is ipfs url
          } else if(uri.startsWith("ipfs://")) {
            // check if it includes {id} for ERC1155
            if(uri.includes("{id}")) {
              let hexaId = toPaddedHexString(item.token_id.toLowerCase(), 64)
              uri = uri.replace("{id}", `${hexaId}`);
              uri = uri.replace("ipfs://", "https://ipfs.moralis.io:2053/ipfs/")
              const res = await axios.get(uri);
              metadata = res.data;
            } else {
              uri = uri.replace("ipfs://", "https://ipfs.moralis.io:2053/ipfs/")
              const res = await axios.get(uri);
              metadata = res.data;
            }
          }

          // check image
          if(metadata.image && isBase64(metadata.image.slice(26))) {
            imageUri = base64.decode(metadata.image.slice(26))
          } else if (metadata.image && metadata.image.startsWith("ipfs://")) {
            imageUri = `https://ipfs.moralis.io:2053/ipfs/${metadata.image.slice(7)}`
          } else if (metadata.image) {
            imageUri = metadata.image;
          }

          return { imageDecoded: imageUri, abi: abi, ...item, ...metadata };
        }
      }
    }));
    
    
  const filteredNfts = nftsTemp.filter((x) => { return x !== undefined })
  // console.log(filteredNfts)
  nfts.push(filteredNfts)
  setNftsData([].concat.apply([], nfts))

            // if(isBase64(tokenUri.substring(29))) {
            //   let jsonManifestString = atob(nft.token_uri.substring(29))
            //   metadata = JSON.parse(jsonManifestString);
            //   if(tokenUri.image && isBase64(tokenUri.image.slice(26))) {
            //     imageUri = base64.decode(metadata.image.slice(26))
            //   } else if (metadata.image && metadata.image.startsWith("ipfs://")) {
            //     imageUri = `https://ipfs.moralis.io:2053/ipfs/${metadata.image.slice(6)}`
            //   } else if (metadata.image) {
            //     imageUri = metadata.image;
            //   }
            // }
            // console.log(tokenUri)
            // console.log(metadata)
            // console.log(imageUri)

        // } else {
        //   otherNfts.push({...nft})
        // }
  } 
  // console.log(nfts)
setLoading(false)
} 

  React.useEffect(() => {
    if(!loadingContracts && dataContracts) {
      console.log(dataContracts)
      getTreasureChestNFTs();
    }
  }, [dataContracts])

  React.useEffect(() => {
    // console.log(nftsData)
  }, [nftsData])

  return (
    <View style={CONTAINER}>
      <SelectedNetwork />
      <LeafSVG style={LEAF_STYLE}  />
         <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.white, fontWeight: "900", fontSize: 26, marginLeft: moderateScale(-140), marginTop: moderateScale(30)}}>{`Your Collection`}</Text>
         <Text style={{...iOSUIKit.subheadEmphasized.valueOf , color: color.palette.white,  marginTop: moderateScale(1)}} selectable={true}>{connector.accounts[0]}</Text>
     
      
      <View style={BOTTOM}>
      <View style={CONTAINER_WALLET}>
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      {!loading && nftsData.length == 0 && <Text style={{marginTop: scale(100)}}>No NFTs found yet 😔</Text>}
      {!loading && nftsData.length == 0 && <TouchableOpacity style={{marginTop: scale(100)}} onPress={async () => {
        await getTreasureChestNFTs();
      }}><Text style={{ color: color.palette.deepPurple}}>refresh</Text></TouchableOpacity>}



      {!loading && 
        <FlatGrid
        itemDimension={170}
        data={nftsData}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={getTreasureChestNFTs} />}
        style={{
          marginTop: 10,
          flex: 1,
        }}
        // staticDimension={300}
        // fixed
        spacing={10}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress={() => {
            navigation.navigate('nftFullScreen', {
              nft: item,
            });
          }}
          >
             <Nft nft={item} />
          </TouchableOpacity>
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