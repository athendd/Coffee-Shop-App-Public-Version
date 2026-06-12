import {Text, View} from 'react-native'
import React from 'react'
import DeliveryToggle from './DeliveryToggle'

const OrdersHeader = ({isDelivery, setIsDelivery}: {isDelivery: boolean, setIsDelivery: (isDelivery: boolean) => void}) => {
    return (
        <View>
            <DeliveryToggle isDelivery = {isDelivery} onChange = {setIsDelivery}></DeliveryToggle>
            <Text className=" mx-7 mt-7 text-[#242424] text-lg font-[Sora-SemiBold]">
                Delivery Address
            </Text>
            <Text className=" mx-7 mt-3 text-[#242424] text-base font-[Sora-SemiBold] mb-2">
                123 Main St, Hingham, MA
            </Text>
            <View className="mx-12 border-b border-gray-400 my-4"/>
        </View>
    )
}

export default OrdersHeader;