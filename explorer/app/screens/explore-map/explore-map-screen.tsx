import React, {useState, useEffect, FC} from 'react';
import { observer } from "mobx-react-lite";
import { ViewStyle, View } from "react-native";
import { Screen, Text, ExploreMap } from "../../components";
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models";
import { color } from "../../theme";

// import Styled from 'styled-components/native';
import Geolocation from 'react-native-geolocation-service';
import {Platform} from 'react-native';
import { requestLocationPermission } from '../../utils/requestLocationPerm';
// import BottomSheet from 'reanimated-bottom-sheet';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { useQuery, useLazyQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
// import { call } from 'react-native-reanimated';
import RNMockLocationDetector from "react-native-mock-location-detector";
import { iOSUIKit } from 'react-native-typography'

import { useWalletConnect } from '@walletconnect/react-native-dapp';

// web socket
import websocket from 'websocket';
import { getAccessToken } from 'react-native-axios-jwt'

interface ILocation {
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  speed: number;
}

const ROOT: ViewStyle = {
  backgroundColor: "#F7CB15",
  flex: 1,
}

const GET_ESCHESTS = gql`
query esChests($topLeftLat: Float!, $topLeftLng: Float!, $bottomRightLat: Float!, $bottomRightLng: Float!) {
  esChests(topLeftLat: $topLeftLat, topLeftLng: $topLeftLng, bottomRightLat: $bottomRightLat, bottomRightLng: $bottomRightLng) {
     _id
     latitude
     longitude
     treasure
  }
}
`;


// const Container = Styled.View`
//     flex: 1;
//     justify-content: center;
//     align-items: center;
// `;

// const Label = Styled.Text`
//     font-size: 24px;
// `;

interface ExploreMapScreenProps {
  navigation?: any
}

export const ExploreMapScreen = observer(function ExploreMapScreen(props: ExploreMapScreenProps) {
  const { navigation } = props;
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const connector = useWalletConnect();
  const WebSocketClient = websocket.client;
  // Pull in navigation via hook
  // const navigation = useNavigation()
  // const goBack = () => navigation.goBack()

  const { chestListStore, userStore, settingsStore } = useStores()
  const { chests } = chestListStore;

  // if(!connector.connected) {
  //   userStore.logoutUser()
  // }

  const mapRef = React.useRef();
  const [location, setLocation] = useState<ILocation | undefined>({latitude: 0, longitude: 0, altitude: 0, heading: 0, speed: 0});
  const [cameraHeading, setCameraHeading] = React.useState(0);
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const [userDelta, setUserDelta] = useState(userStore.treasureMaps.length !== 0 ? userStore.treasureMaps[userStore.getSelectedMap].range : 0.005);
  // const [userDelta, setUserDelta] = useState(0.005);
  const [rotateWitUser, setRotateWithUser] = useState(true);
  const [isLocationMocked, setIsLocationMocked] = useState(false);

  let ws;

  // GRAPHQL
  // const [loadChests, { called, loading, data }] = useLazy Query({

  const { loading, error, data } = useQuery(GET_ESCHESTS, {
     variables: { 
       topLeftLat: location.latitude+(userDelta/2),
       topLeftLng: location.longitude-(userDelta/2),
       bottomRightLat: location.latitude-(userDelta/2),
       bottomRightLng: location.longitude+(userDelta/2),
     } }
  );
 
  useEffect(() => {
    console.log(data)
  }, [data])

  useEffect(() => {
    if(!loading) {
      chestListStore.updateChests({ chests: data.esChests })
    }
  }, [data])

  // bottom sheet
  const sheetRef = React.useRef(null);
  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 450,
      }}
    >
      <Text>Swipe down to close</Text>
    </View>
  );

  useEffect(() => {
    const checkMock = async () => {
      const isLocationMockedx: boolean = await RNMockLocationDetector.checkMockLocationProvider()
      // console.log(`MOCK LOCATION`)
      // console.log(isLocationMockedx)
      setIsLocationMocked(isLocationMockedx)
    }
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');

    } else {
      requestLocationPermission();
    }
    checkMock();
  }, []);

  // fix userlocation marker heading
  function updateCameraHeading() {
    const map = mapRef.current;
    /* @ts-ignore */
    map.getCamera().then((info: Camera) => {
      setCameraHeading(info.heading);
    });
  }
  // watcher for user location
  useEffect(() => {
    const _watchId = Geolocation.watchPosition(
      position => {
        setLocation(position.coords);
        if(ws.readyState === 1){
          let msg = {
            type: 'location',
            payload: { location: position.coords}
          };
          ws.send(JSON.stringify(msg))
        }
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      },
    );

    return () => {
      if (_watchId) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, []);


  // Initiate socket on screen load
  useEffect(() => {
    initiateSocketConnection()
  }, [])

  const initiateSocketConnection = async () => {
    // Add URL to the server which will contain the server side setup
    ws = new WebSocket(`wss://minthunt.io:1338/`, 'echo-protocol')
    // When a connection is made to the server, send the user ID so we can track which
    // socket belongs to which user
    const token = await getAccessToken();
    var msg = {
      type: 'authenticate',
      payload: { token: token }
    };
    ws.onopen = function(event) {
      ws.send(JSON.stringify(msg));
    };

    ws.onerror = (e) => {
      // an error occurred
      console.log(e);
    };

    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };

    // Ran when teh app receives a message from the server
    ws.onmessage = (e) => {
    console.log(e.data)
    }
  }

  return (
    <Screen navigation={navigation} style={ROOT} preset="scroll">
      {!isLocationMocked && <ExploreMap navigation={navigation} loading={loading}  esChests={data ? data.esChests : []} location={location} mapRef={mapRef} cameraHeading={cameraHeading} setCameraHeading={setCameraHeading} updateCameraHeading={updateCameraHeading} followUserLocation={followUserLocation} userDelta={userDelta} />}
      {/* <BottomSheet
        ref={sheetRef}
        snapPoints={[450, 300, 0]}
        borderRadius={10}
        renderContent={renderContent}
      /> */}
      {isLocationMocked && <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        
        <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: "red", fontSize: moderateScale(30), lineHeight: 38, marginLeft: moderateScale(3)}}>&nbsp;&nbsp;ヽ(ಠ_ಠ)ノ &nbsp;&nbsp;</Text>
        <Text style={{...iOSUIKit.largeTitleEmphasizedObject, color: "red", fontSize: moderateScale(15), lineHeight: 38, marginLeft: moderateScale(3)}}>Fake location detected </Text>
        </View>}
    </Screen>

  )
})
