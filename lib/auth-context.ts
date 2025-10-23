import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "./apiConfig";

export async function signIn(credential: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      credential,
      password,
    });
    if (response.data?.token) {
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response.data.data)
      );
    } else {
      throw new Error("Token tidak ditemukan pada respons login.");
    }
    return response.data;
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "Login gagal";
    throw new Error(msg);
  }
}

// Fungsi untuk mendapatkan token
export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem("token");
  } catch (error) {
    console.log("Error getting token:", error);
    return null;
  }
}

// Fungsi untuk mendapatkan data user
export async function getUserData() {
  try {
    const userData = await AsyncStorage.getItem("userData");
    const parsedData = userData ? JSON.parse(userData) : null;
    return parsedData;
  } catch (error) {
    console.log("Error getting user data:", error);
    return null;
  }
}

// Fungsi untuk mendapatkan role user
export async function getUserRole(): Promise<string | null> {
  try {
    const userData = await getUserData();
    return userData?.role || null;
  } catch (error) {
    console.log("Error getting user role:", error);
    return null;
  }
}

// Fungsi untuk logout
export async function signOut() {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.log("Error during logout:", error);
  }
}

// Fungsi untuk cek apakah user sudah login
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}

// Fungsi untuk cek role user
export async function checkAuthAndRole(): Promise<{
  isAuthenticated: boolean;
  role: string | null;
}> {
  const token = await getToken();
  const role = await getUserRole();

  return {
    isAuthenticated: !!token,
    role: role,
  };
}
