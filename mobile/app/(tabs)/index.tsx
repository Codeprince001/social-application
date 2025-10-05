import { Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutButton from '@/components/SignOutButton'

const index = () => {
  return (
    <SafeAreaView  className='mt-4'>
      <Text>index</Text>
        <SignOutButton/>
    </SafeAreaView>
  )
}

export default index