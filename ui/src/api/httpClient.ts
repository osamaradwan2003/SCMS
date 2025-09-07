import axios from "axios";
import { LOGIN_PATH, TOKEN_KEY } from "@/utils/contstance";
// Create axios instance with base configuration
const httpClient = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = LOGIN_PATH;
    }
    return Promise.reject(error);
  }
);

export { httpClient };
