import { View, Text, Pressable} from 'react-native'
import React, {useState, useEffect} from 'react'
import PageHeader from '@/components/PageHeader'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ProductList from '@/components/CartProductList'
import {Product} from '@/types/types'
import {useCart} from '@/components/CartContext'
import {fetchProducts} from '@/services/productService'
import { Ionicons } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {router} from 'expo-router'
import {SafeAreaView} from 'react-native-safe-area-context';

const Order = () => {
    const{cartItems, setQuantityCart, emptyCart} = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [isDelivery, setIsDelivery] = useState<boolean>(true);
    const calculateTotalPrice = (products: Product[], items: { [key: string]: { name: string; qty: number; size?: string; syrups?: string } }) => {
            return Object.entries(items).reduce((total, [itemKey, { name, qty, size, syrups }]) => {
                const product = products.find(p => p.name.trim().toLowerCase() === name.trim().toLowerCase());

                let price = product?.price;
                if (product && product.sizes){
                    price = product.sizes[size as keyof typeof product.sizes]?.price || product.price;
                }

                if (product && syrups && price){
                    price = price + 1.5;
                }

                return total + (product && price ? price * qty : 0);
            }, 0);
        };

    useEffect(() => {
        const totalPrice = calculateTotalPrice(products, cartItems);
        setTotalPrice(totalPrice);
    }, [cartItems, products]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productsData = await fetchProducts();
                setProducts(productsData);

                const newTotalPrice = calculateTotalPrice(productsData, cartItems);
                setTotalPrice(newTotalPrice);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
            setLoading(false);
        };
        loadProducts();
    }, []);

    const orderNow = () => {
        emptyCart();
        router.push('/thankyou')
    }

    return (
        <GestureHandlerRootView className='bg-[#F9F9F9] w-full h-full'>
            <SafeAreaView style = {{flex:1}}>
            <PageHeader title = 'Order' showHeaderRight = {false} backgroundColor = '#F9F9F9'/>
            <View className='flex-1 flex-col justify-between'>
                <View className='flex-1'>
                    <ProductList products = {products} items = {cartItems} setQuantities = {setQuantityCart} totalPrice = {totalPrice} isDelivery = {isDelivery} setIsDelivery={setIsDelivery}></ProductList>
                </View>
                <View className='bg-white rounded-tl-3xl rounded-tr-3xl px-7 pt-3 pb-6 postion-absolute bottom-0 '>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex-row items-center'>
                            <Ionicons name = 'wallet-outline' size = {28} style = {{color: '#C67C4E', marginRight: 10}}></Ionicons>
                            <View>
                                <Text className="text-[#242424] text-base font-[Sora-SemiBold] pb-1 ml-3">
                                Cash/Wallet
                                </Text>
                            </View>
                        </View>
                        <MaterialIcons name = 'keyboard-arrow-down' size = {28} style = {{color: 'black'}}></MaterialIcons>
                    </View>
                    <Pressable className={`${totalPrice=== 0 ? 'bg-[#EDEDED]' : 'bg-[#C67C4E]' }  2-full rounded-2xl items-center justify-center mt-6 py-3`}
                    disabled = {totalPrice === 0}
                    onPress = {() => {
                        emptyCart();
                        setTotalPrice(0);
                        orderNow();
                    }}>
                        <Text className="text-xl color-white font-[Sora-SemiBold]">
                            Order
                        </Text>
                    </Pressable>
                </View>
            </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default Order;