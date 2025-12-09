import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Shop() {
  const router = useRouter();

  useEffect(() => {
    const checkLaunch = async () => {
      const seen = await AsyncStorage.getItem("hasSeenExplore");

      if (seen === "true") {
        // Already seen → go directly to product shop
        router.replace("/(Screens)/GoldShopScreen");
      } else {
        // First time → show Explore screen
        router.replace("/(Screens)/ExploreGoldScreen");
      }
    };

    checkLaunch();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="gold" />
    </View>
  );
}
