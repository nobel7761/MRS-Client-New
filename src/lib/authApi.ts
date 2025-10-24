import api from "./api";

/**
 * Authentication API functions
 */

export interface ForgotPasswordRequest {
  identifier: string; // Email or phone number
}

export interface ForgotPasswordResponse {
  message: string;
  token?: string; // Only for testing, remove in production
  resetLink?: string; // Only for testing, remove in production
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * Request password reset
 * Sends a password reset link to the user's email
 */
export const forgotPassword = async (
  identifier: string
): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    { identifier }
  );
  return response.data;
};

/**
 * Reset password using token from email
 */
export const resetPasswordWithToken = async (
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>(
    "/auth/reset-password-with-token",
    { token, newPassword }
  );
  return response.data;
};

export interface Collector {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  userType: string;
  status: string;
  role: string;
  membershipCategory: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all collectors (users with userType "COLLECTOR")
 */
export const getCollectors = async (): Promise<Collector[]> => {
  const response = await api.get<Collector[]>("/user/collectors");
  return response.data;
};
