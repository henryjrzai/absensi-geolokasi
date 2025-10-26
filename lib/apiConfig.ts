import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const API_URL = "https://absensi-fikom.tempakodedevelopment.my.id/api";
export const API_BASE_URL = "https://absensi-fikom.tempakodedevelopment.my.id";

let inMemoryToken: string | null = null;

export function setAccessToken(token: string | null) {
  inMemoryToken = token;
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = inMemoryToken ?? (await AsyncStorage.getItem("token"));
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
