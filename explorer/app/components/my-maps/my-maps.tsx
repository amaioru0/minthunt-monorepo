import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Text, ActivityIndicator } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { flatten } from "ramda"
import { iOSUIKit } from 'react-native-typography'
import Image from 'react-native-remote-svg';
import { useStores } from "../../models";
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { getMoralis } from '../../services/moralis';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { ethers } from "ethers";
import base64 from 'react-native-base64'
import  { getEthersProvider }  from "../../services/provider";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import Carousel from 'react-native-snap-carousel';

const GET_MAP_CONTRACT = gql`
  query getMapContract($network: String!) {
    getMapContract(network: $network) {
      address
      name
      abi
    }
  }
`;


const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface MyMapsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

const renderItem = ({item, index}) => {
  return (
      <Image
      source={{
        uri: `data:image/svg+xml;utf8,${item.imageDecoded}`,
      }}
      style={{ width: scale(560), height: scale(560), paddingLeft: scale(240)}}
      />
  );
}
/**
 * Describe your component here
 */
export const MyMaps = observer(function MyMaps(props: MyMapsProps) {
  const { userStore, settingsStore } = useStores()
  const { treasureMaps } = userStore;

  const connector = useWalletConnect();

  const [treasureMapsX, setTreasureMapsX] = React.useState([])
  const [loading, setLoading] = React.useState(false);

  const 
    { data: dataContract, loading: loadingContract } = useQuery(GET_MAP_CONTRACT, {
    variables: {
      network: settingsStore.network,
  },
  });

  const getTreasureMaps = async () => {
    setLoading(true)
    const provider = await getEthersProvider(settingsStore.selectedNetwork);
    const Moralis = await getMoralis(settingsStore.selectedNetwork);

    const abi = JSON.parse(dataContract.getMapContract[0].abi)
    const treasureMapContract = new ethers.Contract(dataContract.getMapContract[0].address, abi, provider);

    const nfts = [];
    const tokens = await treasureMapContract.tokensByOwner(connector.accounts[0]);
    
    const options = { chain: settingsStore.selectedNetwork == "matic-testnet" ? "mumbai" : settingsStore.selectedNetwork, address: connector.accounts[0], token_address: dataContract.getMapContract[0].address };
    const mapNFTS = await Moralis.Web3API.account.getNFTsForContract(options);

    console.log(mapNFTS)
    console.log(tokens)
    console.log(treasureMapContract)
    // if(tokens.length == 0) {
    //   console.log("No maps")
    //   userStore.selectMap(0)
    //   userStore.setHasMaps(false);
    //   setLoading(false)
    //   return;
    // }
    if(mapNFTS.result.length == 0) {
        console.log("No maps")
        userStore.selectMap(0)
        userStore.setHasMaps(false);
        setLoading(false)
        return;
      }
    // for(let i = 0; i < tokens.length; i++) {
    //   const data = await treasureMapContract.tokenURI(tokens[i])
    //   // console.log(data)
    //   const jsonManifestString = atob(data.substring(29))
    //   try {
    //     const jsonManifest = JSON.parse(jsonManifestString);
    //     nfts.push({ id: tokens[i], owner: connector.accounts[0], imageDecoded: base64.decode(jsonManifest.image.slice(26)), ...jsonManifest })
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    for(let i = 0; i < mapNFTS.result.length; i++) {
        console.log(mapNFTS.result[i].token_id)
        const data = await treasureMapContract.tokenURI(mapNFTS.result[i].token_id)
        console.log(data)
        const jsonManifestString = atob(data.substring(29))
        try {
          const jsonManifest = JSON.parse(jsonManifestString);
          nfts.push({ id: tokens[i], owner: connector.accounts[0], imageDecoded: base64.decode(jsonManifest.image.slice(26)), ...jsonManifest })
        } catch (e) {
          console.log(e);
        }
      }
    // console.log(nfts);
    setTreasureMapsX(nfts)
    // console.log(nfts)
    const nftsMaps = [];
    nfts.map((item) => {
      nftsMaps.push({
        name: item.name,
        range: parseFloat(item.attributes[0].value),
        color: item.attributes[2].value,
        type: item.attributes[1].value,
        image: item.imageDecoded,
      })
    })
    userStore.updateMaps(nftsMaps)
    setLoading(false)
  }

  React.useEffect(() => {
    if(dataContract && !loadingContract) {
        console.log("here")
        console.log(dataContract)
      getTreasureMaps();
    }
    // treasureMaps.map((treasure, index) => {
    // // console.log(index)
    // // console.log(treasure.name)
    // // console.log(treasure.range)
    // });

  }, [dataContract])

  return (
    <>
        <View style={{ 
      flexDirection: "column",
      width: "100%",
      margin: 5
   }}>
     {loading && 
      <ActivityIndicator size="large" color="#F7CB15" />

     }
      {!loading && treasureMaps.length > 0 && 
        <Carousel
               // ref={(c) => { this._carousel = c; }}
        data={treasureMapsX}
        renderItem={renderItem}
        sliderWidth={scale(700)}
        itemWidth={scale(700)}
        firstItem={userStore.getSelectedMap}
        onSnapToItem={((slideIndex) => {
          userStore.setHasMaps(true);
          userStore.selectMap(slideIndex)
        })}
      />
      }
      
        {/* <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: "#000000", fontSize: moderateScale(15), lineHeight: 38, marginLeft: moderateScale(3)}}>ExplorerMap</Text> */}
     </View>

      </>
  )
})