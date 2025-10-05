import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import {Feather} from "@expo/vector-icons"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@clerk/clerk-expo'

const TabsLayout = () => {

    const insets = useSafeAreaInsets()

    const {isSignedIn} = useAuth()

    if(!isSignedIn) return <Redirect href={"/(auth)"}/>


  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: "#E11D48",
            tabBarInactiveTintColor: "#9CA3AF",
            tabBarStyle: {
                backgroundColor: "#f1f1f1",
                borderTopWidth: 1,
                height: 70 + insets.bottom,
                paddingTop: 10
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "700"
            },
            headerShown: false
        }}
    >
        <Tabs.Screen name='index' options={{
            title: "Home",
            tabBarIcon: ({color, size}) => <Feather name="home" size={size} color={color}/>
        }}/>
        <Tabs.Screen name='messages' options={{
            title: "Messages",
            tabBarIcon: ({color, size}) => <Feather name="message-square" size={size} color={color}/>
        }}/>
        <Tabs.Screen name='search' options={{
            title: "Search",
            tabBarIcon: ({color, size}) => <Feather name="search" size={size} color={color}/>
        }}/>
        <Tabs.Screen name='notifications' options={{
            title: "Notifications",
            tabBarIcon: ({color, size}) => <Feather name="bell" size={size} color={color}/>
        }}/>

        <Tabs.Screen name='profile' options={{
            title: "Profile",
            tabBarIcon: ({color, size}) => <Feather name="user" size={size} color={color}/>
        }}/>
    </Tabs>
  )
}

export default TabsLayout