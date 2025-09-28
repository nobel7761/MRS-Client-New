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
}

interface RegistrationResponse {
  user: User;
  accessToken: string;
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
      Cookies.set("token", accessToken, { expires: 7, path: "/" }); // Expires in 7 days
      Cookies.set("user", JSON.stringify(user), { expires: 7, path: "/" });

      setState({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect based on role and userType
      const userType = user.userType || (user as any)?.usetType;
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
      const { accessToken, user } = response.data;

      // Set cookies
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

  const logout = () => {
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
