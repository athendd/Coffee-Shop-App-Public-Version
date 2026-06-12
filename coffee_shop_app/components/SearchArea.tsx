import { Text, View, Pressable, TextInput, FlatList, Keyboard } from 'react-native';
import React, { useState, useMemo } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Product } from '@/types/types';
import {router} from 'expo-router';
import Toast from 'react-native-root-toast';
import { TextInputSubmitEditingEvent } from 'react-native/Libraries/Components/TextInput/TextInput';

interface SearchProps {
  data?: Product[];
}

const SearchArea = ({ data }: SearchProps) => {
    let one = false;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false); 

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return [] as Product[];
    }

    const filteredData = data?.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    return filteredData as Product[] ?? [];

  }, [searchTerm, data]);

  const handleSearch = (text: string) => {
    one = true;
    setSearchTerm(text);
    setIsOpen(!!text.trim());
  };

  const handleSearchInput = (input: string) => {
    const names = data?.map((product) => product.name.toLowerCase()) || [];
    if (names.includes(input.toLowerCase())){
        handleSelect(data?.find((product) => product.name.toLowerCase() === input.toLowerCase()) as Product);
    }
    setIsOpen(false);
    Toast.show(`Need to enter the name of an item`, {
        duration: Toast.durations.SHORT,
    });
  }

  const handleSelect = (item: Product) => {
    Keyboard.dismiss();
    setSearchTerm(item.name);
    setIsOpen(false);
    router.push( { pathname: '/details', params: {
        name: item.name, 
        image_url: item.image_url,
        type: item.category, 
        price: item.price,
        rating: item.rating,
        description: item.description,
        sizes: JSON.stringify(item.sizes),
        calories: item.calories,
        }}) 
  };

  const clear = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
      <View className="w-full items-center bg-[#222222] pb-6">
        <View className="w-[90%] pt-8">
          <Text className="text-[#A2A2A2] text-sm font-[Sora-Regular]">Location</Text>
          <Text className="text-white font-[Sora-Regular]">Hingham, MA</Text>

          <View className="w-full mt-5 flex-row justify-between relative">
            <View className="flex flex-row items-center w-[95%] h-14 px-4 bg-[#2A2A2A] rounded-2xl mr-3">
              <AntDesign name="search" size={20} color="white" />
              <TextInput
                placeholder="Search items..."
                placeholderTextColor="#aaa"
                value={searchTerm}
                onChangeText={handleSearch}
                onFocus={() => setIsOpen(!!searchTerm.trim())}
                className="flex-1 text-white ml-2"
                returnKeyType="search"
                onSubmitEditing={(e: TextInputSubmitEditingEvent) => handleSearchInput(e.nativeEvent.text)}
              />
              {searchTerm.length > 0 && (
                <Pressable onPress={clear} hitSlop={10}>
                  <AntDesign id="closecircle" size={18} color="#bbb" />
                </Pressable>
              )}
            </View>
            {isOpen && (
              <View className="absolute left-0 right-[20%] top-16 z-20">
                <View className="bg-[#1E1E1E] rounded-xl py-2">
                  {filteredProducts.length > 0 ? (
                    <FlatList
                      keyboardShouldPersistTaps="handled"
                      data={filteredProducts}
                      keyExtractor={(item) => `${item.name}-${item.category}`}
                      renderItem={({ item }) => (
                        <Pressable onPressIn={() => handleSelect(item)}>
                          <View className="px-3 py-2">
                            <Text className="text-white font-[Sora-Regular]">
                              {item.name}{' '}
                              {!!(item as any).category && (
                                <Text className="text-gray-400">({(item as any).category})</Text>
                              )}
                            </Text>
                          </View>
                        </Pressable>
                      )}
                      ItemSeparatorComponent={() => <View className="h-[1px] bg-[#2A2A2A]" />}
                    />
                  ) : (
                    <View className="px-3 py-3">
                      <Text className="text-gray-400 font-[Sora-Regular]">No matches</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
  );
};

export default SearchArea;
