import React from 'react';
import { View, Text } from 'react-native';

interface OrdersFooterProps {
  totalPrice: number;
  isDelivery: boolean;
}

const OrdersFooter: React.FC<OrdersFooterProps> = ({totalPrice, isDelivery}) => {
    const deliveryFee = totalPrice > 0 && isDelivery ? 1.0 : 0.0;

  return (
    <View className="bg-[#F9F9F9] pt-4">
      <View className="border-b border-[#F9F2ED] mx-7" />

      <Text className="mx-7 text-[#242424] text-lg font-[Sora-SemiBold] mb-4 mt-4">
        Payment Summary
      </Text>

      <View className="flex-row justify-between mx-7 mb-3">
        <Text className="text-base font-[Sora-Regular]">Price</Text>
        <Text className="text-base font-[Sora-SemiBold]">
          ${(totalPrice).toFixed(2)}
        </Text>
      </View>

      <View className="flex-row justify-between mx-7 mb-6">
        <Text className="text-base font-[Sora-Regular]">Delivery Fee</Text>
        <Text className="text-base font-[Sora-SemiBold]">
          ${deliveryFee.toFixed(2)}
        </Text>
      </View>

      <View className="flex-row justify-between mx-7 mb-6">
        <Text className="text-base font-[Sora-SemiBold]">Total Price</Text>
        <Text className="text-base font-[Sora-SemiBold]">
          ${(totalPrice + deliveryFee).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};


export default OrdersFooter;