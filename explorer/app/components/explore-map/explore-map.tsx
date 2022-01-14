import React, { useEffect, useRef, useState } from "react"
import { StyleProp, TextStyle, View, ViewStyle, Text, Button, StyleSheet, ActivityIndicator } from "react-native"
import { observer } from "mobx-react-lite"
// import { color, typography } from "../../theme"
// import { Text } from "../"
// import { flatten } from "ramda"
import MapView, { Marker, Callout, Circle } from 'react-native-maps';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import UserLocationMarker  from "./user-location-marker/user-location-marker";
import XMark from "./x-mark/x-mark";
import WizzardMark from "./npc-mark/npc-mark";
import Modal from 'react-native-modal';
import { PlayerBar } from "../game/player-bar/player-bar";
import { useStores } from "../../models";
import { OpenChest } from "../game/open-chest/open-chest";
import { getDistance } from 'geolib';
// import { LoginApi } from '../../services/api/login';
// import api, { login, logout, accessToken } from "../../services/apiX";
import { SelectedNetwork } from "..";
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const PAGESTYLE: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F5FCFF"
}

const CONTAINERSTYLE: ViewStyle = {
  height: "100%",
  width: "100%",
  backgroundColor: "tomato"
}

const ADMINBOX: ViewStyle = {
  backgroundColor: 'white',
  // height: moderateScale(160),
  width: '24%',
  marginTop: moderateScale(40),
  borderRadius: moderateScale(20),
  borderColor: '#8B0E8B',
  borderWidth: 0.9,
  alignItems: 'center',
  flexDirection: 'column',
  position: 'absolute',
  bottom: 100
}

interface ILocation {
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  speed: number;
}

export interface ExploreMapProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  location?: ILocation,
  mapRef?: any
  cameraHeading?: any
  setCameraHeading?: any
  updateCameraHeading?: any
  followUserLocation?: Boolean
  userDelta?: number
  esChests?: any
  loadChests?: any
  called?: any
  loading?: any
  navigation?: any
}

/**
 * Main Explore Component
 */
export const ExploreMap = observer(function ExploreMap(props: ExploreMapProps) {
  // const { style } = props
  // const styles = flatten([CONTAINER, style])
  const { mapRef, updateCameraHeading, setCameraHeading, cameraHeading, followUserLocation, userDelta, esChests,  loading, navigation} = props;
  const connector = useWalletConnect();
  /// user

  const { location } = false ? { location: { accuracy: 21.410999298095703,
    altitude: 273.01347790465167,
    altitudeAccuracy: 128.43399047851562,
    heading: 50,
    latitude: 29.88858,
    longitude: -42.645,
    speed: 0.0 } } : props;

  // React.useEffect(() => {
  //   console.log(location)
  // }, [location])

  // CHEST LOGIC
  const [openChestModal, setOpenChestModal] = useState(false);
  const [openedChest, setOpenedChest] = useState({});

  const { chestListStore, userStore, settingsStore } = useStores()
  const { chests } = chestListStore;

  const openChest = async (chestToMark) => {
    const distanceBetweenUserAndChest = getDistance(
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: chestToMark.latitude, longitude: chestToMark.longitude }
      );
      if(distanceBetweenUserAndChest < 5000) {
        setOpenedChest(chestToMark)
        setOpenChestModal(true)
      } 
  }

  // useEffect(() => {  
  //   if(!called) {
  //     loadChests();
  //   }
  // }, [location])

  // CAMERA logic

  // const animateToRegion = () => {
  //   const map = mapRef.current;
  //   if(location && location.latitude) {
  //      /* @ts-ignore */
  //      followUserLocation && map.animateToRegion({latitude: location.latitude, longitude: location.longitude, latitudeDelta: userDelta, longitudeDelta: userDelta}, 1000);
  //   }
  // }

  const animateCamera = () => {
    const map = mapRef.current;
    if(location && location.latitude) {
      followUserLocation && map.animateCamera({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        heading: false ? location.heading : cameraHeading,
        duration: 1000,
      });
   }
  }

  useEffect(() => {
    // animateToRegion()
    animateCamera()
  }, [location])

  // useEffect(() => {
  //   console.log(connector.accounts[0])
  // }, [connector])


  return (
    <View style={PAGESTYLE}>

      <Modal backdropTransitionOutTiming={0} hideModalContentWhileAnimating={true} animationIn={"bounceIn"} animationOut={"bounceOutUp"} animationInTiming={1000} animationOutTiming={1000} style={{ marginTop: 180, marginBottom: 180}} isVisible={openChestModal} onBackdropPress={() => setOpenChestModal(false)}>
        <OpenChest openedChest={openedChest} setOpenChestModal={setOpenChestModal} location={location} />
      </Modal>

      <View style={CONTAINERSTYLE}>
        {location && location.latitude ? 
          <MapView style={{ ...StyleSheet.absoluteFillObject }}
          ref={mapRef}
          // showsUserLocation 
          pitchEnabled={false} rotateEnabled={false} zoomEnabled={false} scrollEnabled={false} 
          onTouchEnd={() => {
            updateCameraHeading();
          }}
          onTouchCancel={() => {
            updateCameraHeading();
          }}
          onTouchStart={() => {
            updateCameraHeading();
          }}
          onTouchMove={() => {
            updateCameraHeading();
          }}
          showsPointsOfInterest={false} showsIndoors={false} showsTraffic={false} toolbarEnabled={false}
          moveOnMarkerPress={false}
          // onUserLocationChange={(e) => {
          // }}
          // onMoveShouldSetResponder={onDrag}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: userDelta,
            longitudeDelta: userDelta,
          }}
          >
            <Marker coordinate={{
              latitude: location.latitude,
              longitude: location.longitude
            }} flat anchor={{ x: 0.5, y: 0.5 }}>
              <View
              style={{
                transform: [{ rotate: `${location.heading - cameraHeading}deg` }],
               }}
              >
                <UserLocationMarker  />
              </View>
            </Marker>

            <Circle
            center={{ latitude: location.latitude, longitude: location.longitude}}
            radius={50}
            strokeColor={"rgba(156, 152, 184,0.2))"}
            strokeWidth={4}
            fillColor={"rgba(127, 129, 213,0.1))"}
            />

            {/* <Marker coordinate={{
              latitude: 51.885633,
              longitude: -8.480752
            }} flatnn
            onPress={() => {
              setOpenChestModal(true)
            }}
            >
              <View>
                <XMark />
              </View>
            </Marker> */}

            {chests.map((chest, index) => {
              const chestToMark = chest.getChest()
              return(
                <Marker key={index} coordinate={{
                  latitude: chestToMark.latitude,
                  longitude: chestToMark.longitude,
                }} flat
                onPress={async () => {
                  await openChest(chestToMark)
                }}
                >
                  <View>
                    <XMark />
                  </View>
                </Marker>
              )
            })}

              <Marker coordinate={{
              latitude: 29.888629140756844,
              longitude: -42.64499
            }} 
            onPress={() => {
              console.log("hocus pocus")
            }}
            >
              <View>
              <WizzardMark />
              </View>
            </Marker>
            {/* {
              !loading && esChests &&
              esChests.map((chest, index) => {
                // const chestToMark = chest.getChest()
                return(
                  <Marker key={index} coordinate={{
                    latitude: chest.latitude,
                    longitude: chest.longitude,
                  }} flat
                  // onPress={async () => {
                  //   await openChest(chestToMark)
                  // }}
                  >
                    <View>
                      <XMark />
                    </View>
                  </Marker>
                )
              })
            } */}

          </MapView>
            :
          <View style={{backgroundColor: "#7F81D5", height: "100%", flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator size="large" color="#F7CB15" />
          </View>
        }
        <SelectedNetwork />
        <PlayerBar />
        {connector && connector.accounts && connector.accounts[0] === "0x7084C8A2943df2115C4Ca9b70ce6b963A5993906" && <View style={ADMINBOX}>
          <Text style={{ color: "#F93990", fontWeight: "bold", fontSize: moderateScale(8), flex: 1, marginHorizontal: 10, textAlign: 'center'}}>Admin MODE</Text>
          {/* <Text style={{ fontSize: moderateScale(7), flex: 1, marginHorizontal: 10, textAlign: 'center'}}>LNG: {location ? location.longitude : 0}</Text>
          <Text style={{ fontSize: moderateScale(7), flex: 1, marginHorizontal: 10, textAlign: 'center'}}>LAT: {location ? location.latitude : 0} {location ? location.heading : 0}</Text> */}
          <Text style={{ fontSize: moderateScale(7), flex: 1, marginHorizontal: 10, textAlign: 'center'}}>{userStore.isLoggedIn ? "true" : "false"} </Text>
          <Text style={{ fontSize: moderateScale(7), flex: 1, marginHorizontal: 10, textAlign: 'center'}}>{userStore.getSelectedMap} </Text>
          {/* <Text style={{ fontSize: moderateScale(7), flex: 1, marginHorizontal: 10, textAlign: 'center'}}>{userStore.email} </Text> */}
          
          {/* <Text style={{ fontSize: moderateScale(7), flex: 1, marginHorizontal: 10, textAlign: 'center'}}>{userStore.email ? "aaaa" : userStore.email}</Text> */}
          <Button title={"logout"} onPress={async () => {
            await userStore.logoutUser();
          }} />

          <Button title={"test"} onPress={async () => {
            navigation.navigate("wallet")
            // loadChests();
          }} />
        </View>}


    

      </View>
    </View>
  )
})
