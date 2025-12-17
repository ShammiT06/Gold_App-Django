import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Slot, useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../(tabs)/index";

export default function Layout() {
  const router = useRouter();

  const tabs = [
  { name: "index", icon: "home-outline" },
  { name: "portfolio", icon: "briefcase-outline" },

  { name: null, icon: null }, // ← EMPTY CENTER SLOT

  { name: "scheme", icon: "gift-outline" },
  { name: "profile", icon: "person-circle-outline" },
];


  return (
    <View style={{ flex: 1 }}>
      <Slot />

      {/* Curved Bottom Bar */}
      <View style={styles.container}>
        <Svg width={430} height={80} viewBox="0 0 430 80" style={styles.svg}>
          <Path d="M0 20 Q215 -20 430 20 L430 80 L0 80 Z" fill="white" />
        </Svg>

        {/* 5 Equal Tabs */}
    <View style={styles.tabContainer}>
  {tabs.map((tab, index) => (
    <TouchableOpacity
      key={index}
      disabled={!tab.name}
      onPress={() => {
  if (!tab.name) return;

  if (tab.name === "index") {
    router.push("/");   
  } else {
    router.push(`/${tab.name}`);
  }
}}
      style={styles.tabButton}
    >
      {tab.icon && (
        <Ionicons name={tab.icon} size={26} color="#333" />
      )}
    </TouchableOpacity>
  ))}
</View>

        {/* Floating Center SHOP Button */}
       <TouchableOpacity
  style={styles.centerButton}
  onPress={() => router.push("/shop")}
>
  <Ionicons name="storefront-outline" size={30} color="white" />
</TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 90,
    alignItems: "center",
  },
  svg: {
    position: "absolute",
    bottom: 0,
  },
 tabContainer: {
  flexDirection: "row",
  justifyContent: "space-around",  // equal spacing
  alignItems: "center",
  width: "100%",
  position: "absolute",
  bottom: 15,
  paddingHorizontal: 20,
},

tabButton: {
  flex: 1,
  alignItems: "center",
},

centerButton: {
  position: "absolute",
  bottom: 28,
  backgroundColor: "#3b82f6",
  width: 70,
  height: 70,
  borderRadius: 35,
  justifyContent: "center",
  alignItems: "center",
  elevation: 8,
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 5,
},

});
