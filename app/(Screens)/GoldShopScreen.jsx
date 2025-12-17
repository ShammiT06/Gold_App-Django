import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";

// ⭐ Base URL (change only here)
const BASE_URL = "http://192.168.1.11:8081";

// ⭐ Helper to fix image URL
const getImageUrl = (path) => {
  if (!path) return null;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function GoldShopScreen() {
  const [shopId, setShopId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadShop = async () => {
      const id = await AsyncStorage.getItem("shop_id");
      setShopId(id);

      if (id) {
        fetchCategories(id);
        fetchProducts(id);
      }
    };
    loadShop();
  }, []);

  // Fetch categories
  const fetchCategories = async (shop_id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/getcategory/${shop_id}/`);
      setCategories(res.data);
    } catch (err) {
      console.log("Category Fetch Error:", err);
    }
  };

  // Fetch products
  const fetchProducts = async (shop_id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/getproduct/${shop_id}/`);
      setProducts(res.data);
    } catch (err) {
      console.log("Product Fetch Error:", err);
    }
  };

  const filteredProducts = selectedCat
    ? products.filter((p) => p.category === selectedCat)
    : products;

  /* =================== CATEGORY CHIP UI =================== */

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedCat(item.id)}
      style={[
        styles.categoryChip,
        selectedCat === item.id && styles.categoryChipActive,
      ]}
    >
      {item.image ? (
        <Image
          source={{ uri: getImageUrl(item.image) }}
          style={styles.categoryIcon}
        />
      ) : (
        <View style={styles.placeholderCircle}>
          <Ionicons name="image-outline" size={20} color="#777" />
        </View>
      )}

      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  );

  /* =================== PRODUCT CARD UI =================== */

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      {item.image ? (
        <Image
          source={{ uri: getImageUrl(item.image) }}
          style={styles.productImage}
        />
      ) : (
        <View style={styles.noImageBox}>
          <Ionicons name="image-outline" size={40} color="#999" />
        </View>
      )}

      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>₹ {item.price}</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF5EB" }}>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace("/(tabs)")}
      >
        <Ionicons name="arrow-back" size={22} color="#000" />
      </TouchableOpacity>

      {/* OFFER CARD */}
      <View style={styles.offerCard}>
        <View>
          <Text style={styles.offerTitle}>Gold Offer</Text>
          <Text style={styles.offerPercent}>35%</Text>
        </View>

        <Image
          source={require("../../assets/Golds/goldbar.png")}
          style={{ width: 100, height: 80 }}
          resizeMode="contain"
        />
      </View>

      {/* CATEGORY LIST */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategory}
        contentContainerStyle={styles.categoryList}
      />

      {/* PRODUCT GRID */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}
      />
    </ScrollView>
  );
}

/* =================== STYLES =================== */

const styles = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 100,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  offerCard: {
    backgroundColor: "#000",
    marginTop: 70,
    marginHorizontal: 15,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  offerTitle: { color: "#fff", fontSize: 18 },
  offerPercent: { color: "#fff", fontSize: 26, fontWeight: "bold" },

  categoryList: {
    paddingVertical: 15,
    paddingLeft: 15,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DDD",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#fff",
  },
  categoryChipActive: {
    borderColor: "#F6B100",
    backgroundColor: "#FFF7D9",
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  categoryIcon: {
    width: 22,
    height: 22,
    borderRadius: 5,
  },
  placeholderCircle: {
    width: 22,
    height: 22,
    borderRadius: 12,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },

  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  noImageBox: {
    width: "100%",
    height: 150,
    backgroundColor: "#EEE",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    color: "#444",
  },
  productPrice: {
    marginTop: 3,
    fontSize: 15,
    color: "#F5A623",
    fontWeight: "bold",
  },
});
