"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegistrationData,
  User,
  UserRole,
  UserType,
} from "@/types/auth";
import client from "@/lib/api";
import Cookies from "js-cookie";

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

interface RegistrationResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  message: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check token validity on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get token from localStorage first, then cookies
        const token =
          (typeof window !== "undefined" &&
            localStorage.getItem("accessToken")) ||
          Cookies.get("token");
        const user = Cookies.get("user");
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;

        if (token && user) {
          // Set state immediately for better UX
          setState((prev) => ({
            ...prev,
            token,
            user: JSON.parse(user),
            isAuthenticated: true,
            isLoading: false,
          }));

          // Optionally validate token with backend
          // If token is expired, the interceptor will handle refresh
        } else if (refreshToken) {
          // We have refresh token but no access token - try to refresh
          try {
            const response = await client.post("/auth/refresh-token", {
              refreshToken,
            });
            const {
              accessToken,
              refreshToken: newRefreshToken,
              user,
            } = response.data;

            // Update stored tokens
            if (typeof window !== "undefined") {
              localStorage.setItem("accessToken", accessToken);
              if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
              }
              Cookies.set("token", accessToken, { expires: 7, path: "/" });
              if (user) {
                Cookies.set("user", JSON.stringify(user), {
                  expires: 7,
                  path: "/",
                });
              }
            }

            setState({
              user: user || JSON.parse(Cookies.get("user") || "{}"),
              token: accessToken,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            // Refresh failed - clear everything
            if (typeof window !== "undefined") {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              Cookies.remove("token", { path: "/" });
              Cookies.remove("user", { path: "/" });
            }
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await client.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      const { accessToken, refreshToken, user } = response.data;

      // Store access token in localStorage and cookies
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
      }
      Cookies.set("token", accessToken, { expires: 7, path: "/" }); // Expires in 7 days
      Cookies.set("user", JSON.stringify(user), { expires: 7, path: "/" });

      setState({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect based on role and userType
      const userType = user.userType || (user as any)?.userType;
      let redirectPath = "/";

      if (user.role === UserRole.SUPER_ADMIN && userType === UserType.OWNER) {
        redirectPath = "/admin";
      } else if (
        user.role === UserRole.ADMIN &&
        userType === UserType.COLLECTOR
      ) {
        redirectPath = "/admin";
      } else if (
        user.role === UserRole.USER &&
        userType === UserType.COLLECTOR
      ) {
        redirectPath = "/admin";
      } else if (user.role === UserRole.USER && userType === UserType.VISITOR) {
        redirectPath = "/";
      } else {
        redirectPath = "/";
      }

      router.push(redirectPath);

      toast.success("Login successful");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const register = async (registrationData: RegistrationData) => {
    try {
      const response = await client.post<RegistrationResponse>(
        "/auth/register",
        registrationData
      );
      const { accessToken, refreshToken, user } = response.data;

      // Store access token in localStorage and cookies
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
      }
      Cookies.set("token", accessToken, { expires: 7, path: "/" }); // Expires in 7 days
      Cookies.set("user", JSON.stringify(user), { expires: 7, path: "/" });

      setState({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect to home page after successful registration
      router.push("/");
      toast.success("Registration successful! Welcome to NICAA!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Try to call logout endpoint if token exists
      const token =
        (typeof window !== "undefined" &&
          localStorage.getItem("accessToken")) ||
        Cookies.get("token");

      if (token) {
        try {
          await client.post(
            "/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          // Ignore logout API errors - we'll clear local storage anyway
          console.error("Logout API error:", error);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage and cookies
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      Cookies.remove("token", { path: "/" });
      Cookies.remove("user", { path: "/" });
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.push("/");
      toast.success("Logged out successfully");
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
