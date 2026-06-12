import {Text, Pressable} from 'react-native'
import React from 'react'
import {router, Stack} from 'expo-router';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface HeaderProps {
    title: string;
    showHeaderRight: boolean;
    backgroundColor: string;
}


const PageHeader: React.FC<HeaderProps> = ({title, showHeaderRight, backgroundColor}) => {
  return (
    <Stack.Screen
        options = {{
            headerShadowVisible: false,
            headerStyle: {backgroundColor: backgroundColor},
            headerTitleAlign: 'center',
            headerTitle: () => (
                <Text style = {{fontSize: 24, fontFamily: 'Sora-SemiBold', color: 'black'}}>
                    {title}
                </Text>
            ),

            headerRight: showHeaderRight ? () => (
                <FontAwesome5 name="heart" size={20} color="#C67C4E" />
            ) : undefined,
            headerBackVisible: false,
            headerLeft: () => (
                <GestureHandlerRootView className='flex-row items-center'>
                    <Pressable className='pl-2 pt-1' onPress = {() => router.back()}>
                        <Feather name = 'arrow-left' size = {28} color = 'black'/>
                    </Pressable>
                </GestureHandlerRootView>
            )
        }}
    />
 )
}

export default PageHeader