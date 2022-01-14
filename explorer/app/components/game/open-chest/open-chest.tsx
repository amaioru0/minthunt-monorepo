import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Text, TouchableOpacity, TouchableHighlight, Image} from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography, spacing } from "../../../theme"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { iOSUIKit } from 'react-native-typography'
import ChestSVG from './chest-svg/chest-svg';
// import { Audio } from 'expo';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useStores } from "../../../models";
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"
// Import the ethers library
import { ethers } from "ethers";
import  { web3, getEthersProvider } from "../../../services/provider"
import { signLocation } from "../../../utils/signLocation";
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { Linking } from 'react-native';

// import verifierContractJSON from '../../../contracts/Verifier.sol/Verifier.json';
// import { Verifier as verifierContractAddress } from '../../../contracts/contractAddress';

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
  height: scale(400),
  width: scale(300),
  borderRadius: 16
}

const HEADER: ViewStyle = {
  marginBottom: scale(40)
}

const MAINVIEW: ViewStyle = {

}

const OPEN_CHEST = gql`
  mutation openChest($_id: ObjectID!) {
    openChest(_id: $_id) {
      status
      tokenId
      treasureType
      treasure
    }
  }
`;

const GET_VERIFIER_CONTRACT = gql`
  query getVerifierContract($network: String!) {
    getVerifierContract(network: $network) {
      address
      name
      abi
    }
  }
`;

const MINTED_CHEST = gql`
  mutation mintedChest($_id: ObjectID!, $publicKey: String!) {
    mintedChest(_id: $_id, publicKey: $publicKey) {
      status
    }
  }
`;

interface TX {
  data: any;
  from: string;
  gas: string;
  gasPrice: string;
  nonce: string;
  to: any;
  value: string;
}

export interface OpenChestProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  openedChest?: any
  setOpenChestModal: any
  location: any
}


/**
 * Describe your component here
 */
export const OpenChest = observer(function OpenChest(props: OpenChestProps) {
  const { openedChest, location } = props;
  const [step, setStep] = React.useState(0);
  const [countDownNo, setCountDownNo] = React.useState(3);
  const delay = ms => new Promise(res => setTimeout(res, ms));


  const { chestListStore, settingsStore } = useStores()
  const connector = useWalletConnect();


  const [openChestMutation, { data, loading, error }] = useMutation(OPEN_CHEST, {
    variables: {
        _id: openedChest._id,
    },
    onError(err) {
        console.log(err);
    },
});

const [
  getVerifierContract, 
  { data: dataVerifier, loading: loadingVerifier }
] = useLazyQuery(GET_VERIFIER_CONTRACT, {
  variables: {
    network: settingsStore.network,
},
});

const [mintedChestMutation, { data: dataMinted, loading: loadingMinted, error: errorMinted }] = useMutation(MINTED_CHEST, {
  variables: {
      _id: openedChest._id,
      publicKey: connector.accounts[0]
  },
  onError(err) {
      console.log(err);
  },
});


  // const openchestFX = new Audio.Sound();

  // React.useEffect(() => {
  //   const loadOpenChestFX = async() => {
  //     await openchestFX.loadAsync(
  //       require("./openMagic.wav")
  //     )
  //   }
  // }, [])

  React.useEffect(() => {
    const loadChest = async () => {
      await openChestMutation();
    }
    loadChest();
  }, [])

  React.useEffect(() => {
    const setStepX1 = async () => {
      await setStep(1)
    }
    if(!loading && data) {
      // console.log(data)
      setStepX1();
    }
  }, [data])

  const tapChest = async () => {
    // await openchestFX.replayAsync();
    await setStep(2)
    await delay(1000)
    await setCountDownNo(2)
    await delay(1000)
    await setCountDownNo(1)
    await delay(1000)
    await getVerifierContract();
  }

  React.useEffect(() => {
    const mintTreasure = async () => {
    const locationX = {
      lat: Math.trunc(location.latitude),
      lng: Math.trunc(location.longitude)
    }
    const randomNumber= Math.floor(Math.random() * 90000) + 10000;
    const signature = await signLocation(locationX.lat, locationX.lng, randomNumber)
    await sendMintTransaction(locationX.lat, locationX.lng, randomNumber, signature, data.openChest.treasure)
    }

    if(!loadingVerifier && dataVerifier) {
      mintTreasure();
      // console.log(dataVerifier)
    }
  }, [dataVerifier])

    const sendMintTransaction = async (lat, lng, randomNumber, signature, contractName) => {
      const provider = await getEthersProvider(settingsStore.selectedNetwork);

      const verifierContractJSON = dataVerifier.getVerifierContract;
      const abi = JSON.parse(verifierContractJSON.abi)
      const verifierContract = new web3.eth.Contract(abi, verifierContractJSON.address);
      //Set price to 1 Gwei
      // const gasPriceHex = ethers.utils.hexlify(8000000000);
      try {
      //Set max gas limit to 4M
      const gasLimitHex = ethers.utils.hexlify(700000);    

      const gasPrice = await provider.getGasPrice()
      const gasPriceHex = ethers.utils.hexlify(gasPrice.toNumber());
      // const feeData = await provider.getFeeData()
      const nonce = await provider.getTransactionCount(connector.accounts[0]);
      // const estTransaction = await provider.estimateGas({
      //   // Wrapped ETH address
      //   to: unsignedTx.to,    
      //   data: unsignedTx.data,    
      //   value: ethers.utils.parseEther("0")
      // });

      let tx:TX;
      if(data.openChest.treasureType === "mintable") {
        tx = {
          data: verifierContract.methods.isValidData(lat, lng, randomNumber, signature, contractName, "", 0, 0).encodeABI(),
          from: connector.accounts[0],
          gas: gasLimitHex,
          gasPrice: gasPriceHex,
          nonce: `0x${nonce}`,
          to: verifierContractJSON.address,
          value: '0x00',
        }
        console.log(tx)
      } else if(data.openChest.treasureType === "fromVault") {
        console.log(data.openChest)
        console.log(contractName)
        tx = {
          data: verifierContract.methods.isValidData(lat, lng, randomNumber, signature, contractName, "", data.openChest.tokenId, 1).encodeABI(),
          from: connector.accounts[0],
          gas: gasLimitHex,
          gasPrice: gasPriceHex,
          nonce: `0x${nonce}`,
          to: verifierContractJSON.address,
          value: '0x00',
        }
      } else if(data.openChest.treasureType === "lazyMint") {

      }
 
        connector.sendTransaction(tx).then(async (res) => {
          // console.log(`transcation done`)
          await setStep(3)
          await mintedChestMutation();
          if(dataMinted && !loadingMinted) {
            await chestListStore.remove(openedChest)
          }
        }).catch(async (err) => {
          console.log(`transcation fail`)
          await setStep(8)
        })
      } catch (e) {
        console.error(e);
      }
  }

  return (
    <View style={CONTAINER}>

      <View style={HEADER}>
        {step == 0 && 
        <View>
        <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: 38, lineHeight: 38, marginLeft: 30}}>Woho!</Text>
        <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: 16, lineHeight: 16, marginLeft: 1}}>You found a TREASURE</Text>
        <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: 16, lineHeight: 16, marginLeft: 1}}>loading</Text>
        </View>
        }
        {step == 1 && 
        <View>
        <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: 38, lineHeight: 38, marginLeft: 30}}>Woho!</Text>
        <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: 16, lineHeight: 16, marginLeft: 1}}>You found a TREASURE</Text>
        {data && data.openChest && <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: 16, lineHeight: 16, marginLeft: 1}}>{`${data.openChest.treasure}`}</Text>}
        {data && data.openChest && <Text onPress={() => Linking.openURL(`https://${data.openChest.contract.network}.etherscan.io/address/${data.openChest.contract.address}`)} 
        style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: 7, lineHeight: 16, marginLeft: 1}}>{`View on Etherscan`}</Text>}
        </View>
        }

        {step == 2 && 
          <View>
           <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: 38, lineHeight: 38, marginLeft: 30}}>Great job!</Text>
           <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: 16, lineHeight: 16, marginLeft: 1}}>Opening...</Text>
          </View>
        }

        {step == 3 && 
          <View>
           <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.lightPurple, fontSize: 38, lineHeight: 38, marginLeft: 30}}>You found</Text>
          </View>
        }
      </View>

      <View style={MAINVIEW}>
        {step == 3 && <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.mainText, fontSize: 18, lineHeight: 18}}>{!loading && data ? `${data.openChest.treasure}` : ``}</Text>}

        <View style={{
           backgroundColor: step == 1 ? color.palette.lightGrey : step == 2 ? color.palette.lightGrey : "#96DFA2",
           borderRadius: 12,
           margin: 10,
           width: moderateScale(196),
           height: moderateScale(207),
           alignItems: "center",
           justifyContent: "center",
           }}>
             {step == 1 && 
              <TouchableOpacity
              onPress={async () => {
                await tapChest();
              }}
              >
                <ChestSVG width={moderateScale(150.58)} height={moderateScale(152.72)} />
              </TouchableOpacity>
             }

             {step == 2 && 
              <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: color.palette.black, fontSize: 38, lineHeight: 38}}>{countDownNo}</Text>
             }
            {/* 
             {step == 3 &&
              <TouchableOpacity
              onPress={async () => {
                await sendMintTransaction();
              }}
              >
                <ChestSVG width={moderateScale(150.58)} height={moderateScale(152.72)} />
             </TouchableOpacity>
             } */}

            {step == 3 &&
             <Image source={require('./AlienFriend.png')} />
             }

          </View>
      </View>

    </View>
  )
})