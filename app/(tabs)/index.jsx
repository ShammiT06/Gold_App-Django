import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width } = Dimensions.get("window");

const BASE_URL = "http://192.168.0.8:8081";

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function HomeScreen() {
    const [name, setName] = useState("");
    const [shopId, setShopId] = useState(null);

    const [goldRate, setGoldRate] = useState(null);
    const [goldCategory, setGoldCategory] = useState("");

    const [silverRate, setSilverRate] = useState(null);
    const [silverCategory, setSilverCategory] = useState("");

    const [cost, setCost] = useState("");
    const [interestPercent, setInterestPercent] = useState(0);
    const [result, setResult] = useState(null);

    const [ads, setAds] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const storedName = await AsyncStorage.getItem("name");
            const storedShopId = await AsyncStorage.getItem("shop_id");

            setName(storedName || "User");
            setShopId(storedShopId);

            if (storedShopId) {
                fetchGoldRate(storedShopId);
                fetchSilverRate(storedShopId);
                fetchAds(storedShopId);
            }
        };
        loadData();
    }, []);

    const fetchGoldRate = async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/getgoldprice/${id}/`);
            setGoldRate(res.data.rate);
            setGoldCategory(res.data.category);
        } catch (e) {
            console.log("Gold Error:", e);
        }
    };

    const fetchSilverRate = async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/getsilverprice/${id}/`);
            setSilverRate(res.data.rate);
            setSilverCategory(res.data.category);
        } catch (e) {
            console.log("Silver Error:", e);
        }
    };

    const fetchAds = async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/get_add/${id}/`);
            setAds(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.log("Ads Error:", e);
            setAds([]);
        }
    };

    const handleTotalCost = () => {
        const grams = Number(cost) || 0;
        const rate = Number(goldRate) || 0;

        const goldCost = grams * rate;
        const interestEarned = (goldCost * interestPercent) / 100;
        const maturity = goldCost + interestEarned;

        setResult({
            grams: grams.toFixed(2),
            rate: rate.toFixed(2),
            goldCost: goldCost.toFixed(2),
            interestEarned: interestEarned.toFixed(2),
            interestPercent,
            maturity: maturity.toFixed(2),
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* HEADER */}
                <View style={styles.bgtop}>
                    <Text style={styles.bgtxt}>Hi</Text>
                    <Text style={styles.name}>{name}</Text>

                    {/* GOLD + SILVER SCROLL */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width * 0.9}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingLeft: 15, marginTop: 20 }}
                    >
                        {/* GOLD CARD */}
                        <LinearGradient
                            colors={["#F4C542", "#EFAF2E", "#E98F1A"]}
                            style={[styles.rateCard, { marginRight: 15 }]}
                        >
                            <Text style={styles.goldtxt}>Today Gold Rate</Text>

                            <View style={styles.rate}>
                                <Ionicons name="cube-outline" size={48} color="#FFF" />
                                <View style={{ alignItems: "flex-end" }}>
                                    <Text style={styles.todayrate}>
                                        {goldRate ? `₹ ${goldRate}` : "Loading..."}
                                    </Text>
                                    <Text style={styles.ktLabel}>{goldCategory}</Text>
                                </View>
                            </View>
                        </LinearGradient>

                        {/* SILVER CARD */}
                        <LinearGradient
                            colors={["#D9D9D9", "#BFBFBF", "#A8A8A8"]}
                            style={[styles.rateCard, { marginRight: 15 }]}
                        >
                            <Text style={styles.goldtxt}>Today Silver Rate</Text>

                            <View style={styles.rate}>
                                <Ionicons name="sparkles-outline" size={48} color="#FFF" />
                                <View style={{ alignItems: "flex-end" }}>
                                    <Text style={styles.todayrate}>
                                        {silverRate ? `₹ ${silverRate}` : "Loading..."}
                                    </Text>
                                    <Text style={styles.ktLabel}>{silverCategory}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </ScrollView>
                </View>

                {/* ADS HORIZONTAL SCROLL */}
                <View style={styles.adsWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width * 0.8}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingLeft: 20 }}
                    >
                        {ads.length > 0 ? (
                            ads.map((item, index) => (
                                <View key={index} style={[styles.adCard, { marginRight: 20 }]}>
                                    <Image
                                        source={{ uri: getImageUrl(item.image) }}
                                        style={styles.adImage}
                                    />
                                    <Text style={styles.adTitle}>{item.title}</Text>
                                    <Text style={styles.adDesc} numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ marginLeft: 20, color: "#666" }}>
                                No advertisements available
                            </Text>
                        )}
                    </ScrollView>
                </View>

                {/* CALCULATOR */}
                <View style={styles.card}>
                    <Text style={styles.heading}>Gold Interest Calculator</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Weight (grams)</Text>
                        <Text style={styles.label}>Interest (%)</Text>
                    </View>

                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Enter grams"
                            value={cost}
                            onChangeText={setCost}
                        />

                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={String(interestPercent)}
                            onChangeText={(v) => setInterestPercent(Number(v))}
                        />
                    </View>

                    <View style={styles.sliderRow}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={50}
                            step={1}
                            value={interestPercent}
                            onValueChange={setInterestPercent}
                        />
                        <Text>{interestPercent}%</Text>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleTotalCost}>
                        <Ionicons name="calculator-outline" size={20} color="#fff" />
                        <Text style={styles.btnText}>Calculate</Text>
                    </TouchableOpacity>

                    {result && (
                        <View style={styles.resultCard}>
                            <Text style={styles.resultTitle}>Calculation Summary</Text>
                            <Text style={styles.resultText}>Weight: {result.grams} g</Text>
                            <Text style={styles.resultText}>Rate: ₹{result.rate}</Text>
                            <Text style={styles.resultText}>Gold Cost: ₹{result.goldCost}</Text>

                            <Text style={styles.resultText}>
                                Interest ({result.interestPercent}%): ₹{result.interestEarned}
                            </Text>

                            <Text style={styles.resultFinal}>
                                Final Amount: ₹{result.maturity}
                            </Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFF5EB",
    },

    bgtop: {
        backgroundColor: "#484848",
        paddingVertical: 20,
        paddingBottom: 30,
    },

    bgtxt: {
        paddingLeft: 20,
        fontSize: 15,
        color: "#fff",
    },

    name: {
        fontSize: 22,
        paddingLeft: 20,
        marginTop: 5,
        color: "#E37200",
        fontWeight: "600",
    },

    rateCard: {
        width: width * 0.9,
        borderRadius: 20,
        padding: 20,
    },

    goldtxt: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 10,
    },

    rate: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    todayrate: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
    },

    ktLabel: {
        fontSize: 12,
        color: "#fff",
        marginTop: -6,
    },

    adsWrapper: { marginTop: 22 },

    adCard: {
        width: width * 0.8,
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 12,
        elevation: 5,
    },

    adImage: {
        width: "100%",
        height: 140,
        borderRadius: 12,
    },

    adTitle: { fontSize: 16, fontWeight: "700", marginTop: 10 },

    adDesc: { fontSize: 13, color: "#777", marginTop: 4 },

    card: {
        backgroundColor: "#fff",
        width: "90%",
        padding: 20,
        borderRadius: 20,
        alignSelf: "center",
        marginTop: 25,
    },

    heading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#A11616",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    label: { fontSize: 14, color: "#444" },

    input: {
        width: "47%",
        height: 45,
        borderWidth: 1,
        borderColor: "#F8A21A",
        borderRadius: 10,
        paddingHorizontal: 10,
    },

    sliderRow: { flexDirection: "row", alignItems: "center", marginVertical: 15 },

    slider: { flex: 1 },

    button: {
        backgroundColor: "#E78E1E",
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginTop: 10,
        gap: 8,
    },

    btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },

    resultCard: {
        marginTop: 20,
        backgroundColor: "#FFF3D4",
        padding: 15,
        borderRadius: 12,
    },

    resultTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },

    resultText: { fontSize: 15, marginBottom: 5 },

    resultFinal: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#228B22",
    },
});
