import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Sparkline from "../../components/Sparkline";

const investments = [
  { metal: "Gold", amount: "-3,474", weight: "+46g", color: "#EFB12F", trend: "green" },
  { metal: "Silver", amount: "-3,474", weight: "+46g", color: "#C0C0C0", trend: "red" },
  { metal: "Silver", amount: "-3,474", weight: "+46g", color: "#C0C0C0", trend: "green" },
  { metal: "Gold", amount: "-3,474", weight: "+46g", color: "#EFB12F", trend: "green" },
];

export default function PortFolioScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* TOP CARD */}
        <View style={styles.topCard}>
          <Ionicons name="cube" size={70} color="#fff" style={{ marginRight: 15 }} />

          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle}>Your Gold</Text>
            <Text style={styles.goldWeight}>1.34 kg</Text>
          </View>
        </View>

        {/* LAST INVESTMENTS */}
        <Text style={styles.sectionTitle}>Last Investments</Text>

        {investments.map((item, index) => (
          <View key={index} style={styles.investCard}>
            
            {/* LEFT AREA */}
            <View style={styles.leftBox}>
              <Text style={[styles.metalName, { color: item.color }]}>
                {item.metal}
              </Text>

              <Ionicons
                name={item.metal === "Gold" ? "cube" : "disc-outline"}
                size={30}
                color={item.color}
                style={{ marginTop: 4 }}
              />
            </View>

            {/* MID GRAPH */}
            <View style={styles.trendContainer}>
              <Sparkline
                color={item.trend === "green" ? "green" : "red"}
              />
            </View>

            {/* RIGHT AREA */}
            <View style={styles.rightBox}>
              <Text style={styles.amount}>{item.amount}</Text>
              <Text style={[styles.weight, { color: item.color }]}>
                {item.weight}
              </Text>
            </View>

          </View>
        ))}

        {/* PERSONAL SCHEMES */}
        <Text style={styles.sectionTitle}>Personal Schemes</Text>
        <View style={styles.largeBox} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* TOP CARD */
  topCard: {
    width: "90%",
    backgroundColor: "#F6A623",
    alignSelf: "center",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },

  topTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  goldWeight: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },

  /* SECTION TITLE */
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 30,
    marginLeft: 20,
    marginBottom: 10,
    color: "#444",
  },

  /* INVESTMENT CARD */
  investCard: {
    width: "90%",
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  leftBox: {
    width: 65,
    alignItems: "center",
  },
  metalName: {
    fontSize: 15,
    fontWeight: "600",
  },

  /* GRAPH AREA */
  trendContainer: {
    flex: 1,
    alignItems: "center",
  },

  /* RIGHT BOX */
  rightBox: {
    width: 60,
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 17,
    fontWeight: "600",
    color: "#444",
  },
  weight: {
    marginTop: 3,
    fontSize: 13,
  },

  /* PERSONAL SCHEME BOX */
  largeBox: {
    width: "90%",
    height: 170,
    backgroundColor: "#e5e5e5",
    alignSelf: "center",
    borderRadius: 15,
    marginTop: 10,
  },
});
