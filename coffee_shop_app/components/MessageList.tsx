import {View, ScrollView} from 'react-native'
import React, {useRef, useEffect} from 'react'
import { MessageInterface } from '@/types/types';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
    messages: MessageInterface[];
    isTyping: boolean;
}

const MessageList = ({messages, isTyping}:MessageListProps) => {
    const ScrollViewRef = useRef<ScrollView | null>(null)

    //Scroll to the end of screen whenever there is a new message
    useEffect(() => {
        setTimeout(() => {
            ScrollViewRef.current?.scrollToEnd({animated: true})
        }, 100);
    }, [messages, isTyping])
    return(
        <ScrollView ref = {ScrollViewRef} className = 'flex-1' showsHorizontalScrollIndicator = {false} contentContainerStyle = {{paddingTop: 10, paddingBottom: 20}}>
            {
                messages.map((message, index) => (
                    <MessageItem message={message} key={index}/>
                ))
            }

            {isTyping && (
                <View className="w-[80%] ml-3 mb-3">
                    <View className="flex self-start p-3 px-4 rounded-2xl bg-indigo-100 border border-indigo-200">
                        <TypingIndicator/>
                    </View>
                </View>
            )}
        </ScrollView>
    )
}

export default MessageList;