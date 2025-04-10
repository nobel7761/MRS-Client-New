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
  User,
} from "@/types/auth";
import client from "@/lib/api";
import Cookies from "js-cookie";

interface LoginResponse {
  user: User;
  accessToken: string;
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

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    if (token && user) {
      setState((prev) => ({
        ...prev,
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
        isLoading: false,
      }));
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await client.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      const { accessToken, user } = response.data;

      // Set cookies
      Cookies.set("token", accessToken, { expires: 7 }); // Expires in 7 days
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      setState({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect based on role
      const redirectPath = user.role === "USER" ? "/" : "/admin";
      router.push(redirectPath);

      toast.success("Login successful");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
