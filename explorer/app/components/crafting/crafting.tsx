import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../"
import { flatten } from "ramda"
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Nft } from '../../components/nft/nft';
import { useStores } from "../../models";
import { useNavigation } from '@react-navigation/native';
import { ethers } from "ethers";
import  { web3, getEthersProvider } from "../../services/provider"
import { SelectedNetwork } from "..";
import { iOSUIKit } from 'react-native-typography';
import Draggable from 'react-native-draggable';
import { stringToColor, hexToRgb } from '../../utils/stringToColor';
import Image from 'react-native-remote-svg';
import { Button } from 'react-native-elements';

const GET_ENERGY_EXCHANGER = gql`
  query getEnergyExchangerContract($network: String!) {
    getEnergyExchangerContract(network: $network) {
      address
      name
      abi
    }
  }
`;

const CONTAINER: ViewStyle = {
  flex: 1,
  alignItems: 'center',
}

const CONTAINER_WALLET: ViewStyle = {
  alignItems: "center",
  backgroundColor: "white",
  height: verticalScale(550),
  width: scale(380),
  borderRadius: 16
}

const CRAFTING_CONTAINER: ViewStyle = {
  flexDirection: "row"
}


const BOTTOM: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-end',
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

interface TX {
  data: any;
  from: string;
  gas: string;
  gasPrice: string;
  nonce: string;
  to: any;
  value: string;
}

export interface CraftingProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  nftsData?: any 
  getTreasureChestNFTs?: any
  setNftsData?: any
  dataContracts?: any
}

const NftItem = (item) => {
  // const hex = stringToColor(`${item.item.name}pl`);
  // const rgba = hexToRgb(hex);
  const [imageUri, setImageUri] = React.useState(item.item.imageDecoded.startsWith("http") ? item.item.imageDecoded : `data:image/svg+xml;utf8,${item.item.imageDecoded}`);
React.useEffect(() => {
}, [item])
  return(
    <View style={{ 
      flexDirection: "row",
      width: moderateScale(150),
      height: moderateScale(150),
      // backgroundColor: `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
   }}>
         <View style={{ position: "absolute", top: -10, right: 5}}>
         <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: "black", fontSize: moderateScale(10), lineHeight: 38, marginLeft: moderateScale(3)}}>qty: {item.item.amount}</Text>
         </View>
             <Image
        source={{
          uri: imageUri,
        }}
        style={{ width: 138, height: 138, margin: 5, alignSelf: "center" }}
       />
     </View>
  )
}
/**
 * Describe your component here
 */
export const Crafting = observer(function Crafting(props: CraftingProps) {
  const { style, nftsData, getTreasureChestNFTs, setNftsData, dataContracts} = props
  const styles = flatten([CONTAINER, style])
  const connector = useWalletConnect();
  const { settingsStore } = useStores()
  const navigation = useNavigation();

  const { data: dataContract, loading: loadingContract } = useQuery(GET_ENERGY_EXCHANGER, {
    variables: {
      network: settingsStore.selectedNetwork,
  },
  });

  const [blackHoleY, setBlackHoleY] = React.useState(300)
  const [blackHoleZone, setBlackHoleZone] = React.useState({amount: 0})
  
  const [egyFlareY, setEgyFlareY] = React.useState(300)
  const [egyFlareZone, setEgyFlareZone] = React.useState({amount: 0})
  
  const [canExchange, setCanExchange] = React.useState(false);

const exchangeEgy = async () => {
  if(dataContract && !loadingContract) {
    console.log(dataContract)
    const provider = await getEthersProvider(settingsStore.selectedNetwork);
    const energyExchangerObject = dataContract.getEnergyExchangerContract;
    const abi = JSON.parse(energyExchangerObject.abi)
    const energyExchangerContract = new web3.eth.Contract(abi, energyExchangerObject.address);

    try {
      const gasLimitHex = ethers.utils.hexlify(700000);    

      const gasPrice = await provider.getGasPrice()
      const gasPriceHex = ethers.utils.hexlify(gasPrice.toNumber());
      // const feeData = await provider.getFeeData()
      const nonce = await provider.getTransactionCount(connector.accounts[0]);
      const tx = {
        data: energyExchangerContract.methods.exchange(1).encodeABI(),
        from: connector.accounts[0],
        gas: gasLimitHex,
        gasPrice: gasPriceHex,
        nonce: `0x${nonce}`,
        to: energyExchangerObject.address,
        value: '0x00',
      }
      connector.sendTransaction(tx).then(async (res) => {
        console.log(`transcation done`)
        const newZoneBlackHome = {
          ...blackHoleZone,
          amount: blackHoleZone.amount - 1,
        }
        setBlackHoleZone(newZoneBlackHome)

        const newEgyFlareZone = {
          ...egyFlareZone,
          amount: egyFlareZone.amount - 2,
        }
        setEgyFlareZone(newEgyFlareZone)

      }).catch(async (err) => {
        console.log(`transcation fail`)
      })
    } catch (e) {
      console.error(e);
    }
  }
}



React.useEffect(() => {
  if(blackHoleZone.amount >= 1) {
    if(egyFlareZone.amount >= 2) {
      setCanExchange(true)
    } else {
      setCanExchange(false)
    }
  } else {
    setCanExchange(false)
  }
}, [blackHoleZone, egyFlareZone])

  return (
    <View style={CONTAINER}>
      <SelectedNetwork />
      <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.white, fontWeight: "900", fontSize: 28, marginLeft: moderateScale(-140), marginTop: moderateScale(30)}}>{`EnergyExchanger`}</Text>

      <View style={BOTTOM}>
      <View style={CONTAINER_WALLET}>

      <View style={CRAFTING_CONTAINER}>
      <View style={{ 
        flexDirection: "row",
        width: moderateScale(150),
        height: moderateScale(150),
        backgroundColor: `#1CBBF1`,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        margin: 10
     }}>

       </View>
       <View style={{ 
        flexDirection: "row",
        width: moderateScale(150),
        height: moderateScale(150),
        backgroundColor: `#1CBBF1`,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        margin: 10
     }}>

       </View>
      </View>

      
      {nftsData.map((item, key) => {
        if(item.name === "Black Hole") {
        return (
          <>
          {nftsData[key].amount >= 1 && <Draggable onDragRelease={(event, gestureState) => {
            if (gestureState.dy < 100) {
              // setBlackHoleY(10)
              if(nftsData[key].amount >= 1) {
                nftsData[key].amount = nftsData[key].amount - 1;
                const newZone = {
                  ...nftsData[key],
                  amount: blackHoleZone.amount + 1,
                }
                setBlackHoleZone(newZone)
              } 
    
            }
          }}shouldReverse x={40} y={blackHoleY}><NftItem item={item} /></Draggable>}
        
          {blackHoleZone.amount >=1  && <Draggable onDragRelease={(event, gestureState) => {
                     if (gestureState.dy > 100) {
                      if(blackHoleZone.amount >= 1) {
                        nftsData[key].amount = nftsData[key].amount + 1;
                        const newZone = {
                          ...blackHoleZone,
                          amount: blackHoleZone.amount - 1,
                        }
                        setBlackHoleZone(newZone)
                      } 
            
                    }
        }}shouldReverse x={40} y={10}><NftItem item={blackHoleZone} /></Draggable>}
          </>
        )
        } else if(item.name === "EGY Flare") {
          return (
            <>
            {nftsData[key].amount >= 1 && <Draggable onDragRelease={(event, gestureState) => {
              if (gestureState.dy < 100) {
                // setBlackHoleY(10)
                if(nftsData[key].amount >= 1) {
                  nftsData[key].amount = nftsData[key].amount - 1;
                  const newZone = {
                    ...nftsData[key],
                    amount: egyFlareZone.amount + 1,
                  }
                  setEgyFlareZone(newZone)
                } 
      
              }
            }}shouldReverse x={240} y={blackHoleY}><NftItem item={item} /></Draggable>}
          
            {egyFlareZone.amount >=1  && <Draggable onDragRelease={(event, gestureState) => {
                       if (gestureState.dy > 100) {
                        if(egyFlareZone.amount >= 1) {
                          nftsData[key].amount = nftsData[key].amount + 1;
                          const newZone = {
                            ...egyFlareZone,
                            amount: egyFlareZone.amount - 1,
                          }
                          setEgyFlareZone(newZone)
                        } 
              
                      }
          }}shouldReverse x={240} y={10}><NftItem item={egyFlareZone} /></Draggable>}
            </>
          )
        }
      })}
    {!loadingContract && 
     <Button
     buttonStyle={{
       backgroundColor: '#1CBBF1',
       // borderColor: 'transparent',
       padding: 10,
     }}
     containerStyle={{
      //  width: 66,
      //  height: 20,
     }}
     titleStyle={{
       fontSize: 24,
      //  color: "purple"
     }}
     disabled={!canExchange}
     loading={false}
    title="Exchange"
    onPress={exchangeEgy}
    />
      }

      </View>
      </View>

    </View>
  )
})
