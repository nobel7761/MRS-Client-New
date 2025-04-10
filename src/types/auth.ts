export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum UserType {
  MARKETING = "MARKETING",
  HR = "HR",
  OPERATIONS = "OPERATIONS",
  EMPLOYEE = "EMPLOYEE",
  OWNER = "OWNER",
}

export interface User {
  _id: string;
  email: string;
  phone?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  status: UserStatus;
  userType: UserType;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
