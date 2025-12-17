import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shopName, setShopName] = useState("");

  const [userId, setUserId] = useState(null);
  const [shopId, setShopId] = useState(null);

  const [kycDetails, setKycDetails] = useState(null);
  const [kycModal, setKycModal] = useState(false);

  // KYC form states
  const [panNumber, setPanNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [panImage, setPanImage] = useState(null);
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const storedName = await AsyncStorage.getItem("name");
    const storedEmail = await AsyncStorage.getItem("email");
    const storedShop = await AsyncStorage.getItem("shop_name");
    const uid = await AsyncStorage.getItem("user_id");
    const sid = await AsyncStorage.getItem("shop_id");

    setName(storedName || "User Name");
    setEmail(storedEmail || "yourmail@example.com");
    setShopName(storedShop || "My Gold Shop");
    setUserId(uid);
    setShopId(sid);

    fetchKyc(uid);
  };

  // LOAD EXISTING KYC
  const fetchKyc = async (uid) => {
    try {
      const res = await axios.get(`http://192.168.1.11:8081/api/getkyc/${uid}/`);
      setKycDetails(res.data);
    } catch (err) {
      console.log("No KYC found.");
    }
  };

  // PICK IMAGES
  const pickImage = async (setFunction) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setFunction(result.assets[0]);
    }
  };

  // SUBMIT KYC
  const submitKyc = async () => {
    if (!panNumber || !aadharNumber || !panImage || !aadharFront || !aadharBack) {
      return Alert.alert("Error", "All fields and images are required!");
    }

    let formData = new FormData();
    formData.append("user", userId);
    formData.append("shop", shopId);
    formData.append("pan_number", panNumber);
    formData.append("aadhar_number", aadharNumber);

    formData.append("pan_image", {
      uri: panImage.uri,
      name: "pan.jpg",
      type: "image/jpeg",
    });

    formData.append("aadhar_front", {
      uri: aadharFront.uri,
      name: "front.jpg",
      type: "image/jpeg",
    });

    formData.append("aadhar_back", {
      uri: aadharBack.uri,
      name: "back.jpg",
      type: "image/jpeg",
    });

    try {
      await axios.post("http://192.168.0.8:8081/api/kycsubmit/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "KYC Submitted Successfully!");
      setKycModal(false);
      fetchKyc(userId);
    } catch (err) {
      Alert.alert("Error", "Failed to submit KYC");
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <LinearGradient colors={["#F2C76E", "#E0A03A"]} style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </LinearGradient>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={90} color="#B8860B" />
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </View>

      {/* SECTIONS */}
      <View style={styles.optionList}>
        
        {/* SHOP NAME */}
        <View style={styles.optionItem}>
          <View style={styles.rowLeft}>
            <Ionicons name="storefront-outline" size={22} color="#B8860B" />
            <Text style={styles.optionText}>Shop Name</Text>
          </View>
          <Text style={styles.infoText}>{shopName}</Text>
        </View>

        {/* PRIVACY POLICY */}
        <View style={styles.optionItem}>
          <View style={styles.rowLeft}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#B8860B" />
            <Text style={styles.optionText}>Privacy Policy</Text>
          </View>
          <Text style={styles.infoText}>goldapp-thirdvizion</Text>
        </View>

        {/* HELP SUPPORT */}
        <View style={styles.optionItem}>
          <View style={styles.rowLeft}>
            <Ionicons name="mail-outline" size={22} color="#B8860B" />
            <Text style={styles.optionText}>Help & Support</Text>
          </View>
          <Text style={styles.infoText}>support@thirdvizion.com</Text>
        </View>

        {/* APP VERSION */}
        <View style={styles.optionItem}>
          <View style={styles.rowLeft}>
            <Ionicons name="information-circle-outline" size={22} color="#B8860B" />
            <Text style={styles.optionText}>App Version</Text>
          </View>
          <Text style={styles.infoText}>v1.0.0</Text>
        </View>

        {/* KYC SECTION */}
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => setKycModal(true)}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="document-text-outline" size={22} color="#B8860B" />
            <Text style={styles.optionText}>KYC</Text>
          </View>

          <Text style={[styles.infoText, { color: "#CE8B00", fontWeight: "700" }]}>
            {kycDetails?.is_kyc_verified
              ? "Verified"
              : kycDetails?.is_kyc_submitted
              ? "Pending"
              : "Not Submitted"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* KYC MODAL */}
      <Modal visible={kycModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalHeader}>Submit KYC</Text>

              {/* PAN NUMBER */}
              <Text style={styles.label}>PAN Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter PAN Number"
                value={panNumber}
                onChangeText={setPanNumber}
              />

              {/* AADHAR NUMBER */}
              <Text style={styles.label}>Aadhar Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Aadhar Number"
                value={aadharNumber}
                onChangeText={setAadharNumber}
              />

              {/* PAN IMAGE */}
              <Text style={styles.label}>Upload PAN Image</Text>
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => pickImage(setPanImage)}
              >
                {panImage ? (
                  <Image source={{ uri: panImage.uri }} style={styles.uploadImage} />
                ) : (
                  <Ionicons name="cloud-upload-outline" size={40} color="#B8860B" />
                )}
              </TouchableOpacity>

              {/* AADHAR FRONT */}
              <Text style={styles.label}>Upload Aadhar Front</Text>
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => pickImage(setAadharFront)}
              >
                {aadharFront ? (
                  <Image source={{ uri: aadharFront.uri }} style={styles.uploadImage} />
                ) : (
                  <Ionicons name="cloud-upload-outline" size={40} color="#B8860B" />
                )}
              </TouchableOpacity>

              {/* AADHAR BACK */}
              <Text style={styles.label}>Upload Aadhar Back</Text>
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => pickImage(setAadharBack)}
              >
                {aadharBack ? (
                  <Image source={{ uri: aadharBack.uri }} style={styles.uploadImage} />
                ) : (
                  <Ionicons name="cloud-upload-outline" size={40} color="#B8860B" />
                )}
              </TouchableOpacity>

              {/* SUBMIT BUTTON */}
              <TouchableOpacity style={styles.submitBtn} onPress={submitKyc}>
                <Text style={styles.submitText}>Submit KYC</Text>
              </TouchableOpacity>

              {/* CLOSE BUTTON */}
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setKycModal(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

/* ====================== STYLES ======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EB",
  },

  header: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  profileCard: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FFF",
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 20,
    elevation: 4,
  },

  profileName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#4A351D",
  },

  profileEmail: {
    marginTop: 4,
    fontSize: 15,
    color: "#7A6A58",
  },

  optionList: {
    marginTop: 25,
  },

  optionItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 15,
    elevation: 2,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#4A351D",
    fontWeight: "600",
  },

  infoText: {
    paddingLeft: 32,
    fontSize: 14,
    color: "#7A6A58",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },

  modalBox: {
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 15,
    maxHeight: "85%",
  },

  modalHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4A351D",
    marginBottom: 15,
  },

  label: {
    fontSize: 15,
    marginTop: 10,
    fontWeight: "700",
    color: "#4A351D",
  },

  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0C9A6",
    marginTop: 5,
  },

  uploadBox: {
    backgroundColor: "#FFF",
    height: 150,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0C9A6",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  uploadImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  submitBtn: {
    backgroundColor: "#E0A03A",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 25,
  },

  submitText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },

  closeBtn: {
    backgroundColor: "#B8860B",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 15,
  },

  closeText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
