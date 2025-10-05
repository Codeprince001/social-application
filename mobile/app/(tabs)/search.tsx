import { View, Text, TextInput, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons';


const TRENDING_TOPICS = [
  { id: '1', topic: "#ReactNative" , tweets: "120K" },
  { id: '2', topic: "#JavaScript" , tweets: "95K" },
  { id: '3', topic: "#MobileDevelopment" , tweets: "80K" },
  { id: '4', topic: "#TypeScript" , tweets: "70K" },
  { id: '5', topic: "#Expo" , tweets: "60K" },
];


const search = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='p-4 '>
        <View className='flex-row items-center bg-gray-100 p-2 rounded-full px-4 py-3'>
          <Feather name="search" size={20} color="gray" />
          <TextInput placeholder='Search' className='ml-2 flex-1 text-base' placeholderTextColor="#657786"/>
        </View>
      </View>


      <ScrollView className='px-4' showsVerticalScrollIndicator={false}>
        <Text className='text-xl font-bold mt-4 mb-2'>Trending Topics</Text>
        {TRENDING_TOPICS.map((item) => (
          <View key={item.id} className='py-3 border-b border-gray-200'>
            <Text className='text-gray-500 text-sm'>Trending</Text>
            <Text className='text-base font-semibold mt-1'>{item.topic}</Text>
            <Text className='text-gray-500 text-sm'>{item.tweets} Tweets</Text>
          </View>
        ))}
      </ScrollView>
     </SafeAreaView>
  )
}

export default search