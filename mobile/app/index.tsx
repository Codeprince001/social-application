import { View, Text, Button } from 'react-native'
import React from 'react'
import { useClerk } from '@clerk/clerk-expo'

const index = () => {

    const {signOut} = useClerk()
  return (
    <View>
      <Text>Home screen</Text>
      <Button title='logout' onPress={() => signOut()}/>
    </View>
  )
}

export default index