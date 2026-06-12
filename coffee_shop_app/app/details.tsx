import {Text, View, ScrollView, Pressable} from 'react-native'
import React, {useState, useMemo} from 'react'
import { useLocalSearchParams, router } from 'expo-router';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PageHeader from '@/components/PageHeader';
import DetailsHeader from '@/components/DetailsHeader';
import DescriptionSection from '@/components/DescriptionSection';
import {useCart} from '@/components/CartContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SizesMap} from '@/types/types';
import { MaterialIcons } from '@expo/vector-icons';

type SelectedSize = 'S' | 'M' | 'L';
const sizeKeyMap: Record<SelectedSize, keyof SizesMap> = {
  S: 'small',
  M: 'medium',
  L: 'large',
};

const Details = () => {
    const {addToCart}  = useCart();
    const [selectedSize, setSelectedSize] = useState<SelectedSize>('M'); 
    const setSizes = ['S', 'M', 'L'] as const;
    const [isOpen, setIsOpen] = useState(false);
    const syrups = ['Chocolate', 'Hazelnut', 'Carmel', 'Sugar Free Vanilla']
    const [selectedSyrups, setSelectedSyrups] = useState<string[]>([]);
    const {name, image_url, type, description, price, rating, calories, sizes} = useLocalSearchParams() as {name: string, image_url: string, type: string, description: string, price: string, rating: string, calories: string, sizes?: string};
    const sizesDic = useMemo<SizesMap | null>(() => {
    try {
        return sizes ? (JSON.parse(sizes) as SizesMap) : null;
        } catch {
        return null;
        }
    }, [sizes]);

    const hasSizes = !!sizesDic && Object.keys(sizesDic).length > 0;

    const buyNow = () => {
        if (hasSizes){
            addToCart(name, 1, sizeKeyMap[selectedSize], selectedSyrups.join(', '));
        }
        else{
            addToCart(name, 1);
        }
        router.back();
    }

    const handleSyrupPress = (syrup: string) => {
        setSelectedSyrups((prev) =>
        prev.includes(syrup) ? prev.filter((s) => s !== syrup) : [...prev, syrup]
        );
    };

   const basePrice = useMemo(() => {
    if (hasSizes && sizesDic) {
      const key = sizeKeyMap[selectedSize];
      return sizesDic[key]?.price ?? Number(price);
    }
    return Number(price);
  }, [hasSizes, sizesDic, selectedSize, price]);

  const selectedCalories = useMemo(() => {
    if (hasSizes && sizesDic) {
      const key = sizeKeyMap[selectedSize];
      return sizesDic[key]?.calories ?? Number(calories);
    }
    return Number(calories);
  }, [hasSizes, sizesDic, selectedSize, calories]);

  const totalPrice = useMemo(() => {
    const surcharge = selectedSyrups.length > 0 ? 1.5 : 0;
    return Number((basePrice + surcharge).toFixed(2));
  }, [basePrice, selectedSyrups.length]);

    return (
        <GestureHandlerRootView className='bg-[#F9F9F9] w-full h-full'>
            <SafeAreaView style = {{flex:1}}>
            <PageHeader title = {'Detail'} showHeaderRight = {true} backgroundColor = '#F9F9F9'/>
            <View className='h-full flex-col justify-between'>
                <ScrollView>
                    <View className='mx-5 items-center'>
                        <DetailsHeader image_url = {image_url} name = {name} type = {type} rating = {Number(rating)} calories = {selectedCalories}/>
                        <DescriptionSection description = {description}/>
                        {hasSizes && (
                            <View className = 'flex-col mb-3'>
                                <View className = 'mt-3'>
                                    <Text className="text-[#242424] text-lg font-[Sora-SemiBold] ml-1">
                                        Size
                                    </Text>
                                    <View className="flex-row justify-center items-center space-x-4 mt-3 mb-3">
                                        {setSizes.map((size) => (
                                            <Pressable key={size} className={`px-4 py-2 rounded-2xl w-[30%] items-center ${selectedSize === size ? 'bg-[#fdf5f0] border-2 border-[#C67C4E]' : 'bg-white'}`}
                                            onPress = {() => setSelectedSize(size)}>
                                                <Text className={`font-[Sora-SemiBold] ${selectedSize === size ? 'text-[#C67C4E]' : 'text-black'}`}>
                                                    {size}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                                <View className = 'flex-row items-center justify-between mt-2'>
                                    <View className = 'flex-row items-center'>
                                        <Text className="text-[#242424] text-lg font-[Sora-SemiBold] ml-1 mr-2">
                                            Flavors
                                        </Text>
                                        <Text className = 'text-[#C67C4E] text-md font-[Sora-SemiBold]'>
                                            (+$1.50)
                                        </Text>
                                    </View>
                                    <Pressable className = 'mr-2 items-right' onPress= {() => setIsOpen(!isOpen)}>
                                        <MaterialIcons name= {isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color="#C67C4E" />
                                    </Pressable>
                                </View>
                                {isOpen && (
                                    <View className = 'flex-col ml-1 mt-3 space-y-2'>
                                        {syrups.map((syrup) => {
                                            const selected = selectedSyrups.includes(syrup);
                                            return (
                                                <Pressable key={syrup} onPress={() => handleSyrupPress(syrup)} className={`px-2 py-2 rounded-2xl w-[60%] ${selected ? 'bg-[#C67C4E]' : 'bg-white'}`}>
                                                    <Text className={`font-[Sora-Regular] ${selected ? 'text-white' : 'text-black'}`}>
                                                        {syrup}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </ScrollView>
                <View className='flex-row justify-between bg-white rounded-tl-3xl rounded-tr-3xl px-6 pt-2 pb-3'>
                    <View>
                        <Text className="text-[#A2A2A2] text-base font-[Sora-Regular] pb-3">
                            Price
                        </Text>
                        <Text className="text-[#C67C4E] text-2xl font-[Sora-SemiBold]">
                            ${totalPrice.toFixed(2)}
                        </Text>
                    </View>
                    <Pressable className="bg-[#C67C4E] w-[70%] rounded-3xl items-center justify-center" 
                    onPress = {buyNow}>
                        <Text className="text-2xl color-white font-[Sora-SemiBold]">
                            Buy Now
                        </Text>
                    </Pressable>
                </View>
            </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default Details