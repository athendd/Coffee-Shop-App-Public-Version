import {Text, View, Pressable} from 'react-native'
import React, {useState, useEffect} from 'react'

const DeliveryToggle = ({isDelivery, onChange}: {isDelivery: boolean, onChange: (isDelivery: boolean) => void}) => {
    const [isDeliveryState, setIsDeliveryState] = useState(isDelivery);

    useEffect(() => {
        setIsDeliveryState(isDelivery);
    }, [isDelivery]);

    const handlePress = (value: boolean) => {
        setIsDeliveryState(value); 
        onChange(value);          
    };

    return (
        <View className="flex-row justify-between bg-[#EDEDED] mx-7 p-1 rounded-xl mt-7">
        <Pressable
            className={`py-1 px-[15%] font-[Sora-SemiBold] rounded-xl ${
            isDeliveryState ? 'bg-[#C67C4E]' : ''
            }`}
            onPress={() => handlePress(true)}
        >
            <Text className={`text-lg ${isDeliveryState ? 'text-white' : 'text-black'}`}>
            Deliver
            </Text>
        </Pressable>

        <Pressable
            className={`py-1 px-[15%] font-[Sora-SemiBold] rounded-xl ${
            !isDeliveryState ? 'bg-[#C67C4E]' : ''
            }`}
            onPress={() => handlePress(false)}
        >
            <Text className={`text-lg ${!isDeliveryState ? 'text-white' : 'text-black'}`}>
            Pickup
            </Text>
        </Pressable>
        </View>
    );
};

export default DeliveryToggle;