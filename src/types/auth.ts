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
  VISITOR = "VISITOR",
  COLLECTOR = "COLLECTOR",
  OWNER = "OWNER",
}

export enum MembershipCategory {
  FREE = "FREE",
  YEARLY = "YEARLY",
  PERMANENT = "PERMANENT",
}

export interface User {
  _id: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  status: UserStatus;
  userType: UserType;
  membershipCategory?: MembershipCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
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
  register: (registrationData: RegistrationData) => Promise<void>;
  logout: () => void;
}
