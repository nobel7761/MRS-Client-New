import axios from "axios";
import { toast } from "react-toastify";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3333");

console.log("API Base URL:", baseURL);

const client = axios.create({
  baseURL,
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    }
    return Promise.reject(error);
  }
);

export default client;
