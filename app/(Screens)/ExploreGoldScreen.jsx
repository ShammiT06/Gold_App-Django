import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ExploreGoldScreen() {
  const router = useRouter();

  // ⭐ CHECK IF USER ALREADY SAW THIS SCREEN
  useEffect(() => {
    const checkFirstTime = async () => {
      const seen = await AsyncStorage.getItem("hasSeenExplore");
      if (seen === "true") {
        // Already seen → redirect immediately
        router.replace("/Screens/GoldShopScreen");
      }
    };

    checkFirstTime();
  }, []);

  // ⭐ SAVE FLAG WHEN BUTTON IS CLICKED
  const handleExplore = async () => {
    await AsyncStorage.setItem("hasSeenExplore", "true");
    router.push("/Screens/GoldShopScreen");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>

        {/* TOP IMAGE */}
        <Image
          source={require("../../assets/Golds/gold3.png")}
          style={styles.topImage}
        />

        {/* TWO SIDE IMAGES */}
        <View style={styles.rowImages}>
          <Image
            source={require("../../assets/Golds/gold2.png")}
            style={[styles.sideImage, { height: 300, width: "50%", borderRadius: 20 }]}
          />
          <Image
            source={require("../../assets/Golds/gold1.png")}
            style={styles.sideImage}
          />
        </View>

        {/* TEXT */}
        <Text style={styles.title}>
          Discover pure gold, crafted to perfection.
        </Text>
        <Text style={styles.subtitle}>
          Shop trusted designs with guaranteed purity.
        </Text>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleExplore}>
          <Text style={styles.buttonText}>Explore Products</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    resizeMode: "cover",
    marginBottom: 20,
  },

  rowImages: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  sideImage: {
    width: "48%",
    height: 220,
    borderRadius: 20,
    resizeMode: "cover",
  },

  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 10,
  },

  button: {
    backgroundColor: "#F9A825",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: "center",
    width: "75%",
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
