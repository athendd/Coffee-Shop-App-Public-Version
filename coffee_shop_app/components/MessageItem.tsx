import {Text, View} from 'react-native'
import React from 'react'
import { MessageInterface } from '@/types/types';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Message{
    message: MessageInterface;
}

const MessageItem = ({message}: Message) => {
    if (message.role === 'user'){
        return(
            <View className='flex-row justify-end  mb-3 mr-3'>
                <View className='max-w-[80%] bg-green-500 p-3 px-4 rounded-2xl'>
                    <Text style = {{fontSize: hp(2)}} className = 'text-white'>{message?.content}</Text>
                </View>
            </View>
        )
    }
    return (
            <View className='max-w-[80%] ml-3 mb-3'>
                <View className='flex self-start p-3 px-4 rounded-2xl bg-indigo-100 border border-indigo-200'>
                    <Text style = {{fontSize: hp(2)}}>{message.content}</Text>
                </View>
            </View>
        )
    }

export default MessageItem;