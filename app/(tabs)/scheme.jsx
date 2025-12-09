import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Scheme() {
  return (
    <View style={styles.container}>
      
      {/* ICON */}
      <Ionicons name="cube-outline" size={80} color="#B8860B" />

      {/* TITLE */}
      <Text style={styles.title}>Schemes Coming Soon</Text>

      {/* SUBTEXT */}
      <Text style={styles.subText}>
        Your gold schemes will appear here once added.
      </Text>

    </View>
  );
}

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4A351D",
    marginTop: 15,
  },

  subText: {
    fontSize: 15,
    color: "#7A6A58",
    marginTop: 5,
    textAlign: "center",
  },
});
