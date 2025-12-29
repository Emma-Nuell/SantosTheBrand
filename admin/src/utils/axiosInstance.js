import axios from "axios";
import { getToken } from "./auth";

const api = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: api,
  timeout: 40000, // 20s timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth tokens
instance.interceptors.request.use(
  (config) => {
    const token = getToken(); // Get from localStorage/cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default instance;