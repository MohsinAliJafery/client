import axios from "axios";
import { setupTokenInterceptor } from "./tokenRefresh";

// Create Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

setupTokenInterceptor(API);

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    // Get user token from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
