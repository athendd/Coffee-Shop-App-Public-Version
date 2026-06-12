import React from "react";
import { View, Text, FlatList, Image, Pressable } from "react-native";
import OrdersHeader from "./OrdersHeader";
import OrdersFooter from "./OrdersFooter";
import { Product, CartItem } from "@/types/types";

interface ProductListProps {
  products: Product[];
  items: { [key: string]: {name: string, qty: number, size?: string, flavors?: string}}; 
  setQuantities: (itemKey: string, delta: number) => void; 
  totalPrice: number;
  isDelivery: boolean;
  setIsDelivery: (isDelivery: boolean) => void;
}

const ProductList = ({products, items, setQuantities, totalPrice, isDelivery, setIsDelivery}: ProductListProps) => {
  const renderItem = ({ item }: { item: CartItem & { itemKey: string } }) => {
    const product = products.find(p => p.name.toLowerCase() === item.name.toLowerCase()&& (!item.category || p.category.toLowerCase() === item.category.toLowerCase()));
    return (
      <View className="flex-row items-center justify-between mx-7 pb-3">
        <Image source={{ uri: product?.image_url ?? "" }} className="w-16 h-16 rounded-lg"/>
      <View className="flex-1 ml-4">
        <Text className="text-lg font-[Sora-SemiBold] text-[#242424]">
          {item.name}
        </Text>
        {product?.sizes && (
        <Text className = 'text-sm font-[Sora-Regular] text-gray-500'>
            {item?.size}
        </Text>
        )}
        <Text className="font-[Sora-Regular] text-xs text-gray-500">
            {product?.category}
            {item.syrups? ` • ${item.syrups}` : ""}
        </Text>
      </View>

      <View className="flex-row items-center">
        <Pressable onPress={() => setQuantities(String(item.itemKey), -1)}>
          <Text className="text-xl text-black">-</Text>
        </Pressable>
        <Text className="mx-4 text-l">{item.qty}</Text>
        <Pressable onPress={() => setQuantities(String(item.itemKey), +1)}>
          <Text className="text-xl text-black">+</Text>
        </Pressable>
      </View>
    </View>
    );
  };

  const data = React.useMemo(() => {
  return Object.entries(items ?? {}).map(([itemKey, item]) => ({
    itemKey,
    ...(item ?? {}),
  }));
}, [items]);

  return (
    <View className = 'flex-1'>
      {data.length > 0 ? (
        <FlatList
          data={Object.keys(items).map((key) => ({ itemKey: key, ...items[key] }))}
          renderItem={renderItem}
          keyExtractor={(item) => item.itemKey}
          ListHeaderComponent={<OrdersHeader isDelivery = {isDelivery} setIsDelivery = {setIsDelivery}/>}
          ListFooterComponent={<OrdersFooter totalPrice = {totalPrice} isDelivery = {isDelivery} />}
          contentContainerStyle={{ paddingBottom: 160 }}
        />
      ) : (
        <View className="mx-7 items-center">
          <Text className="text-2xl font-[Sora-SemiBold] text-gray-500 mb-4 text-center">
            No items in your cart yet
          </Text>
          <Text className="text-xl font-[Sora-SemiBold] text-gray-500 text-center">
            Go add some!
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProductList;