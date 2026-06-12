import {View, Text, Pressable} from 'react-native';
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {router} from 'expo-router'
import {SafeAreaView} from 'react-native-safe-area-context';

const thankyou = () => {
    return (
        <GestureHandlerRootView>
            <SafeAreaView style = {{flex:1}}>
            <View className='w-full h-full items-center justify-center'>
                <Text className='text-3xl font-[Sora-SemiBold] text-center mx-10'>
                    Thank you for your order!
                </Text>
                <Pressable className='bg-[#C67C4E] rounded-2xl items-center justify-center mt-10 py-3 px-4 font-[Sora-SemiBold]'
                onPress = {() => router.push('/(tabs)/home')}>
                    <Text className="text-xl text-white font-[Sora-Regular]">
                        Return to Home Page
                    </Text>
                </Pressable>
            </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default thankyou;