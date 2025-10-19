import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import logo from "@/public/nicaa-logo-white-bg.png";
import backgroundImage from "@/public/background.jpg";
import Image from "next/image";
import { toast } from "react-toastify";
import { resetPasswordWithToken } from "@/lib/authApi";
import Link from "next/link";

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

const ResetPasswordComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      toast.error("Invalid reset link. Please request a new password reset.");
      router.push("/login");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
  });

  // Watch password fields for real-time validation
  const newPassword = watch("newPassword", "");
  const confirmPassword = watch("confirmPassword", "");

  // Password criteria checker (same as registration)
  const checkPasswordCriteria = (password: string) => {
    return {
      length: password.length >= 8 && password.length <= 16,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };
  };

  const passwordCriteria = checkPasswordCriteria(newPassword);
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword.length > 0;
  const passwordsDontMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  // Check if all requirements are met
  const isPasswordValid = useMemo(() => {
    return (
      passwordCriteria.length &&
      passwordCriteria.uppercase &&
      passwordCriteria.lowercase &&
      passwordCriteria.number &&
      passwordCriteria.specialChar &&
      passwordsMatch
    );
  }, [passwordCriteria, passwordsMatch]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    try {
      const response = await resetPasswordWithToken(token, data.newPassword);

      toast.success(response.message || "Password reset successfully!");
      setResetSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. The link may have expired.";
      toast.error(errorMessage);
    }
  };

  if (!token) {
    return null;
  }

  if (resetSuccess) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-[#1B2028]/95 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <FiCheck className="text-white text-3xl" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Password Reset Successful!
          </h2>
          <p className="text-gray-300 mb-6">
            Your password has been successfully reset. You can now login with
            your new password.
          </p>
          <p className="text-gray-400 text-sm">Redirecting to login page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Right Side - Feature Showcase */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full md:w-1/2 bg-white p-4 md:p-8 flex flex-col justify-center items-center order-1 md:order-2 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage.src})` }}
        >
          <div className="max-w-md w-full text-center">
            <div className="flex justify-center items-center mb-4 md:mb-8">
              <Image
                src={logo}
                alt="NICAA"
                width={500}
                height={500}
                className="w-3/4 h-3/4"
                priority
              />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2 md:mb-4">
              NICAA
            </h2>
            <p className="text-white text-sm md:text-base mb-4 md:mb-8">
              National Ideal College Alumni Association
            </p>
          </div>
        </motion.div>

        {/* Left Side - Reset Password Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full md:w-1/2 p-4 md:p-8 bg-[#1B2028]/95 order-2 md:order-1"
        >
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl md:text-3xl font-semibold text-white my-8 md:mb-12 text-center">
              Reset Your Password
            </h1>

            <p className="text-gray-300 text-sm md:text-base mb-6 text-center">
              Please enter your new password below.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              <div>
                <label className="block text-white mb-2 text-sm md:text-base">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword")}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm md:text-base"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg md:text-xl"
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Password Strength Indicator - Same as Registration */}
                {newPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <p className="text-xs text-gray-400 mb-2">
                      Password Requirements:
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {passwordCriteria.length ? (
                          <FaCheck className="text-green-500 text-sm" />
                        ) : (
                          <FaTimes className="text-red-500 text-sm" />
                        )}
                        <span
                          className={`text-xs ${
                            passwordCriteria.length
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          8-16 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordCriteria.uppercase ? (
                          <FaCheck className="text-green-500 text-sm" />
                        ) : (
                          <FaTimes className="text-red-500 text-sm" />
                        )}
                        <span
                          className={`text-xs ${
                            passwordCriteria.uppercase
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          One uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordCriteria.lowercase ? (
                          <FaCheck className="text-green-500 text-sm" />
                        ) : (
                          <FaTimes className="text-red-500 text-sm" />
                        )}
                        <span
                          className={`text-xs ${
                            passwordCriteria.lowercase
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          One lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordCriteria.number ? (
                          <FaCheck className="text-green-500 text-sm" />
                        ) : (
                          <FaTimes className="text-red-500 text-sm" />
                        )}
                        <span
                          className={`text-xs ${
                            passwordCriteria.number
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          One number
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordCriteria.specialChar ? (
                          <FaCheck className="text-green-500 text-sm" />
                        ) : (
                          <FaTimes className="text-red-500 text-sm" />
                        )}
                        <span
                          className={`text-xs ${
                            passwordCriteria.specialChar
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          One special character (@$!%*?&)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {errors.newPassword && (
                  <p className="mt-1 text-red-500 text-xs md:text-sm">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white mb-2 text-sm md:text-base">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm md:text-base"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg md:text-xl"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="flex items-center gap-2">
                      {passwordsMatch ? (
                        <>
                          <FaCheck className="text-green-500 text-sm" />
                          <span className="text-xs text-green-400">
                            Passwords match
                          </span>
                        </>
                      ) : passwordsDontMatch ? (
                        <>
                          <FaTimes className="text-red-500 text-sm" />
                          <span className="text-xs text-red-400">
                            Passwords do not match
                          </span>
                        </>
                      ) : null}
                    </div>
                  </motion.div>
                )}

                {errors.confirmPassword && (
                  <p className="mt-1 text-red-500 text-xs md:text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isPasswordValid}
                className="w-full px-4 py-2 md:py-3 bg-blue-600 text-white flex items-center justify-center gap-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-400 text-sm md:text-base"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
