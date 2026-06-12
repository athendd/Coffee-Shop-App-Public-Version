import {View, TextInput, Pressable, KeyboardAvoidingView, Platform} from 'react-native';
import React, { useState, useRef } from 'react';
import PageHeader from '@/components/PageHeader';
import { MessageInterface } from '@/types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import MessageList from '@/components/MessageList';
import { callChatBotAPI } from '@/services/chatBot';
import { useCart } from '@/components/CartContext';
import { StatusBar } from 'expo-status-bar';
import {SafeAreaView} from 'react-native-safe-area-context';

const ChatRoom = () => {
  const { addToCart, emptyCart } = useCart();
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const textRef = useRef('');
  const inputRef = useRef<TextInput>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let inputMessages = [...messages, { content: message, role: 'user' }];
      setMessages(inputMessages);
      textRef.current = '';
      inputRef.current?.clear();
      setIsTyping(true);
      let responseMessage = await callChatBotAPI(inputMessages);
      setIsTyping(false);
      setMessages([...inputMessages, responseMessage]);
      if (responseMessage?.memory?.order) {
        emptyCart();
        responseMessage.memory.order.forEach((item: any) => {
            const normalizedItem = normalizeChatbotItem(item);
            addToCart(normalizedItem.name, normalizedItem.quantity, normalizedItem.size, normalizedItem.syrups, normalizedItem.category);
        });
      }
    } catch (error) {
      setIsTyping(false);
      console.log(error);
    }
  };

  const normalizeChatbotItem = (raw: any) => {
    const itemName = raw.item || "";
    const match = itemName.match(/(.+?)\s*\((.+?)\)/);
    const syrupsString = Array.isArray(raw.syrups) ? raw.syrups.join(", ") : "";

    if (match){
      return {
        name: match[1].trim(),
        quantity: raw.quantity,
        size: raw.size,
        syrups: syrupsString,
        category: match[2].trim(),
      };
    }

    return {
      name: raw.item.trim(),
      quantity: raw.quantity,
      size: raw.size,
      syrups: syrupsString,
      category: raw.category,
    };
  };

  return (
    <GestureHandlerRootView style = {{flex: 1}}>
        <SafeAreaView style = {{flex: 1}} edges = {['bottom']}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={hp(10)} 
        >
            <View className="flex-1 bg-white">
                <PageHeader
                title="Chat Bot"
                showHeaderRight={false}
                backgroundColor="white"
                />
                <View className="h-3 border-b border-neutral-300" />
                <View className="flex-1 justify-between bg-neutral-100">
                <MessageList messages={messages} isTyping={isTyping} />
                <View style={{ marginBottom: hp(2.7) }} className="pt-2">
                    <View className="flex-row mx-3 justify-between border p-2 bg-white border-neutral-300 rounded-full pl-5">
                    <TextInput
                        ref={inputRef}
                        onChangeText={(value) => (textRef.current = value)}
                        placeholder="Type message..."
                        style={{ fontSize: hp(2) }}
                        className="flex-1 mr-2"
                    />
                    <Pressable
                        onPress={handleSendMessage}
                        className="bg-neutral-200 p-2 mr-[1px] rounded-full items-center justify-center"
                    >
                        <Feather name="send" size={hp(3)} color="#737373" />
                    </Pressable>
                    </View>
                </View>
                </View>
            </View>
        </KeyboardAvoidingView>
        </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ChatRoom;
