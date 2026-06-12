import React, { useEffect, useState } from 'react';
import { Product, ProductCategory } from '@/types/types';
import { fetchProducts } from '@/services/productService';
import { Text, View,ImageBackground, FlatList, StatusBar, Pressable   } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {router} from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import Toast from 'react-native-root-toast';
import { useCart } from '@/components/CartContext';
import Banner from '@/components/Banner';
import SearchArea from '@/components/SearchArea';
import Octicons from '@expo/vector-icons/Octicons';

const Home = () => {

  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [shownProducts, setShownProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const uniqueCategories = Array.from(productCategories).map((category) => ({ id: category.id, select: selectedCategory === category.id })); 
    setProductCategories(uniqueCategories);

    if (selectedCategory === 'All') {
      setShownProducts(products);
    } else {
      const filteredProducts = products.filter((product) => product.category === selectedCategory);
      setShownProducts(filteredProducts);
    }

  }, [selectedCategory]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        const categories = productsData.map((product) => product.category);
        categories.unshift('All');
        const uniqueCategories = Array.from(new Set(categories)).map((category) => ({ id: category, select: selectedCategory === category })); 

        setProductCategories(uniqueCategories);
        setProducts(productsData);
        setShownProducts(productsData);

      } catch (err) {
        setError("Error fetching products"+err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  const addButton = (name:string, sizes: string) => {
    let size = '';
    if (sizes){
      size = 'medium';
    }
    addToCart(name, 1, size || undefined);
    Toast.show(`${name} added to cart`, {
      duration: Toast.durations.SHORT,
    });
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className='w-full h-full'>
        <StatusBar barStyle="light-content" backgroundColor="#222222" />
        <FlatList 
            horizontal={false}
            columnWrapperStyle={{ justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}
            numColumns={2} 
            keyExtractor={(item, index) => index.toString()}
            data= {shownProducts}

            renderItem={({item}) => (
              <View 
                className='w-[48%] mt-5 bg-white rounded-2xl p-1.5 flex justify-between'>
                <Pressable
                  onPress={() => { 
                    router.push( { pathname: '/details', params: {
                      name: item.name, 
                      image_url: item.image_url,
                      type: item.category, 
                      price: item.price,
                      rating: item.rating,
                      description: item.description,
                      sizes: JSON.stringify(item.sizes),
                      calories: item.calories,
                    }} ) 
                    }
                  }
                >
                  <ImageBackground 
                    source= {{ uri: item.image_url}}
                    className='w-full h-36'
                    imageStyle={{ borderRadius: 20 }}
                  >
                    <View className="flex-row bg-black/40 w-[45%] h-[25%] rounded-l-3xl rounded-t-2xl absolute top-0 right-0 items-center justify-center">
                      <Octicons name="star-fill" size={18} color="#FBBE21" />
                      <Text
                        className="text-white text-m font-[Sora-SemiBold] ml-2"
                      >
                        {item.rating}
                      </Text>
                    </View>
                  </ImageBackground>
                  <Text
                    className="text-[#242424] text-lg font-[Sora-SemiBold] ml-1 mt-2"
                  >{item.name}
                  </Text>
                  <Text
                    className="text-[#A2A2A2] text-sm font-[Sora-Regular] ml-1 mt-1"
                  >{item.category}
                  </Text>
                </Pressable>

                <View 
                  className="flex-row justify-between ml-1 mt-4 mb-2"
                >
                  <Text
                    className="text-[#050505] text-xl font-[Sora-SemiBold] "
                  >
                    ${item.price}
                  </Text>
                  
                    <Pressable
                      onPress = {() => addButton(item.name, JSON.stringify(item.sizes))}
                    >
                      <View
                        className='mr-2 p-2 -mt-1 bg-[#C67C4E] rounded-xl'
                      >
                        <AntDesign name="plus" size={20} color="white" />
                      </View>
                    </Pressable>

                  </View>
                


              </View>
          )}
          
          ListHeaderComponent={() => (
          <View className='flex'>
            <SearchArea data = {products}/>
            <Banner />
            
            <View
              className='flex items-center'
            >
              <FlatList 
                className='mt-6 w-[90%] mb-2'
                data = {productCategories}
                horizontal={true}
                renderItem={({item}) => (
                  <Pressable
                    onPress={() => setSelectedCategory(item.id)}
                  >
                    <Text
                      className={`text-sm mr-4 font-[Sora-Regular] p-3 rounded-lg 
                        ${item.select ? 'text-white' : 'text-[#313131]'}
                        ${item.select ? 'bg-[#C67C4E]' : 'bg-[#EDEDED] '}
                        `}
                      >{item.id}
                    </Text>
                  </Pressable>
                )}
              />

            </View>

          </View>

          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Home