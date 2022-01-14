/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
 import React from "react"
 import { createStackNavigator } from "@react-navigation/stack"
 import { LoginScreen } from "../screens"

 /**
  * This type allows TypeScript to know what routes are defined in this navigator
  * as well as what properties (if any) they might take when navigating to them.
  *
  * If no params are allowed, pass through `undefined`. Generally speaking, we
  * recommend using your MobX-State-Tree store(s) to keep application state
  * rather than passing state through navigation params.
  *
  * For more information, see this documentation:
  *   https://reactnavigation.org/docs/params/
  *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
  */
 export type UserParamList = {
   login: undefined
 }
 
 // Documentation: https://reactnavigation.org/docs/stack-navigator/
 const Stack = createStackNavigator<UserParamList>()
 
 export function UserNavigator() {
   return (
     <Stack.Navigator
       screenOptions={{
         cardStyle: { backgroundColor: "transparent" },
         headerShown: false,
       }}
     >
       <Stack.Screen name="login" component={LoginScreen} />
     </Stack.Navigator>
   )
 }
 

 