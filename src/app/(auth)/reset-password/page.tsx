"use client";

import { NextPage } from "next";
import { Suspense } from "react";
import ResetPasswordComponent from "@/components/pages/public/auth/reset-password";

const ResetPasswordPage: NextPage = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-auto p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4"
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
              <p className="text-white text-lg">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordComponent />
    </Suspense>
  );
};

export default ResetPasswordPage;
