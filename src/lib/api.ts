import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3333");

const client = axios.create({
  baseURL,
  withCredentials: true, // IMPORTANT: Required for cookies to work
});

// Queue for requests that failed due to 401 while token is being refreshed
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - Add access token to requests
client.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage first (more reliable), then cookies
    const token =
      (typeof window !== "undefined" && localStorage.getItem("accessToken")) ||
      Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure credentials are included for cookies
    config.withCredentials = true;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh token endpoint itself
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        // Refresh failed - clear tokens and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          Cookies.remove("token", { path: "/" });
          Cookies.remove("user", { path: "/" });
          window.location.href = "/login";
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Try to refresh token
        const response = await axios.post(
          `${baseURL}/auth/refresh-token`,
          { refreshToken }, // Send in body as fallback
          {
            withCredentials: true, // Also try cookie
            headers: { "Content-Type": "application/json" },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update stored tokens
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
          // Also update cookie for backward compatibility
          Cookies.set("token", accessToken, { expires: 7, path: "/" });
        }

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        return client(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        processQueue(refreshError, null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          Cookies.remove("token", { path: "/" });
          Cookies.remove("user", { path: "/" });
          window.location.href = "/login";
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
