import {Text, View,Image } from 'react-native'
import React from 'react'

const Banner = () => {
  return (
    <View className="rounded-lg  items-center">
        <View
        className='absolute w-full h-[90px] -top-1 items-center bg-[#222222] pb-10'
        />
            <Image   
            source={require('../assets/images/banner.png')}
            className="w-[90%] h-40 rounded-3xl"
            />
            <View
            className='w-[95%] pl-7 absolute mt-2'
            > 

            <Text 
                className=" bg-[#ED5151] rounded-lg text-white mb-3 text-lg p-1 font-[Sora-SemiBold] self-start"
                >Promo
            </Text>

            <View
                className='bg-[#222222] w-[55%] h-6 top-4'
            >
            </View>
            <View
            className='bg-[#222222] w-[45%] h-6 top-8'
            >
            </View>

            <Text
            className='text-white text-3xl font-[Sora-SemiBold] mt-3 w-[70%] -top-16'
            style={{ lineHeight: 45 }}
            >
            Buy one get one FREE
            </Text>
        </View>
    </View>
  )
}

export default Banner