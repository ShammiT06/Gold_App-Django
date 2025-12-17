import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");   // this will be sent as name in API
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------
  // 🔥 LOGIN FUNCTION
  // ------------------------
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      // Call Django API
      const res = await axios.post("http://192.168.1.11:8081/api/user/", {
        name: email,        // your backend expects this
        password: password,
      });

      const data = res.data;

      // Save user data in AsyncStorage
      await AsyncStorage.setItem("user_id", data.id.toString());
      await AsyncStorage.setItem("name", data.name);
      await AsyncStorage.setItem("email", data.email);
      await AsyncStorage.setItem("phone_number", data.phone_number);
      await AsyncStorage.setItem("shop_id", data.shop_id.toString());
      await AsyncStorage.setItem("shop_name", data.shop_name);

      setLoading(false);

      // Navigate to home
      router.replace("/(tabs)");

    } catch (error) {
      setLoading(false);
      Alert.alert("Login Failed", "Invalid credentials, try again");
    }
  };

  // ------------------------
  // 🔥 UI PART
  // ------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ------------------------
// 🔥 STYLES
// ------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
