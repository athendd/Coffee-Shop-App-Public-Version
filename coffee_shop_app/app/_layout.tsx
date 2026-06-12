/// <reference types="nativewind/types" />
import { Stack } from "expo-router";
import { useFonts } from 'expo-font'
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { CartProvider } from "../components/CartContext";
import {RootSiblingParent} from 'react-native-root-siblings';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
    "Sora-SemiBold": require("../assets/fonts/Sora-SemiBold.ttf"),
    "Sora-Bold": require("../assets/fonts/Sora-Bold.ttf"),
  });

  //Wait for the fonts to load
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded){ return undefined;}
  
  return (
    <CartProvider>
      <RootSiblingParent>
        <Stack>
          <Stack.Screen name="index" 
            options = {{headerShown: false}}
          />
          <Stack.Screen name = "details"
          options = {{headerShown: true}}
          />
          <Stack.Screen name = "thankyou"
          options = {{headerShown: false}}
          />
          <Stack.Screen name = "(tabs)"
          options = {{headerShown: false}}
          />
        </Stack>
      </RootSiblingParent>
    </CartProvider>
    );
}
