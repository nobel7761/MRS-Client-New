import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3333");

const client = axios.create({
  baseURL,
});

client.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token", { path: "/" });
      Cookies.remove("user", { path: "/" });
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    }
    return Promise.reject(error);
  }
);

export default client;
