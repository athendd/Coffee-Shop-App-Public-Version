import { Text, View, ImageBackground, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PageHeader from '@/components/PageHeader'

const AboutUs = () => {
  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-[#F7F3EF] flex-1">
        <PageHeader title="About Us" showHeaderRight={false} backgroundColor='white'/>
        <ScrollView className="pb-10">
          <View className="items-center px-3">
            <ImageBackground
              source={require("../../assets/images/coffee.jpg")}
              className="w-full h-64 rounded-3xl overflow-hidden shadow-md"
              imageStyle={{ borderRadius: 24 }}
            >
              <View className="bg-white/90 w-full p-3 rounded-b-3xl absolute bottom-0">
                <Text className="text-[#C67C4E]/80 text-lg font-[Sora-SemiBold] mt-1">
                  Exceptional coffee & baked goods, fairly priced.
                </Text>
              </View>
            </ImageBackground>
          </View>
          <View className="px-5 mt-6">
            <View className="bg-white rounded-2xl p-5 shadow-sm">
              <Text className="text-xl font-[Sora-SemiBold] text-[#C67C4E]">
                Our Mission
              </Text>
              <Text className="font-[Sora-Regular] text-base leading-6 mt-2 text-neutral-700">
                Our mission is simple: serve exceptional coffee and fresh-baked goods at prices everyone can love.
              </Text>
            </View>
          </View>
          <View className="px-5 mt-4">
            <View className="bg-white rounded-2xl p-5 shadow-sm">
              <Text className="text-xl font-[Sora-SemiBold] text-[#C67C4E]">
                Our Story
              </Text>
              <Text className="font-[Sora-Regular] text-base leading-6 mt-2 text-neutral-700">
                Founder Andrew Thynne grew up in a coffee-obsessed home, where mornings started with the aroma of freshly ground beans.
                In 2025, that passion became Andrew’s Café—a place devoted to rich flavor, warm hospitality, and everyday value.
              </Text>
            </View>
          </View>
          <View className="px-5 mt-4">
            <View className="bg-white rounded-2xl p-5 shadow-sm">
              <Text className="text-xl font-[Sora-SemiBold] text-[#C67C4E]">
                Our Beans
              </Text>
              <Text className="font-[Sora-Regular] text-base leading-6 mt-2 text-neutral-700">
                Our journey begins in the highlands of Brazil, where beans are carefully harvested and hand-sorted. From there, they travel
                to the U.S. to be processed and dried, then arrive at our roastery to be small-batch roasted and freshly ground for brewing.
                The result? A cup that’s smooth, balanced, and memorably delicious.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default AboutUs;
