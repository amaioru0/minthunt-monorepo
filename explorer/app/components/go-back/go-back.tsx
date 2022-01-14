import * as React from "react"
import { StyleProp, View, ViewStyle, Text, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
// import { color, typography } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { iOSUIKit } from 'react-native-typography'
import { scale } from "react-native-size-matters"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  position: "absolute",
  left: 0,
  marginLeft: 10,
  marginTop: 5
}



export interface GoBackProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const GoBack = observer(function GoBack(props: GoBackProps) {
  const { style } = props
  const navigation = useNavigation()

  return (
    <View style={CONTAINER}>
      <TouchableOpacity onPress={() => {
        navigation.goBack();
      }}>
      <Text style={{...iOSUIKit.bodyEmphasizedObject, fontSize: scale(20) }}>{`<`}</Text>
      </TouchableOpacity>
    </View>
  )
})
