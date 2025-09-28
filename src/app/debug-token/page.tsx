"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import directApi from "@/lib/directApi";

export default function DebugTokenPage() {
  const [token, setToken] = useState<string | null>(null);
  const [cookieToken, setCookieToken] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Get token from auth context
    const authToken = Cookies.get("token");
    setCookieToken(authToken || null);

    // Also get from auth context
    const contextToken = (user as any)?.token;
    setToken(contextToken);
  }, [user]);

  const testWithDirectApi = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const result = await directApi.get("/user/all");
      setTestResult({ success: true, data: result.data });
    } catch (error: any) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testWithManualFetch = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const token = Cookies.get("token");

      const response = await fetch("http://localhost:3333/api/user/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setTestResult({ success: true, data });
    } catch (error: any) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (cookieToken) {
      navigator.clipboard.writeText(cookieToken);
      alert("Token copied to clipboard!");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Token Debug Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Token Information */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Token Information</h2>

          <div className="space-y-3">
            <div>
              <label className="font-semibold">Auth Status:</label>
              <p
                className={isAuthenticated ? "text-green-600" : "text-red-600"}
              >
                {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
              </p>
            </div>

            <div>
              <label className="font-semibold">User:</label>
              <p>{user ? `${user.firstName} ${user.lastName}` : "None"}</p>
            </div>

            <div>
              <label className="font-semibold">Token from Cookies:</label>
              <p className="text-sm break-all">
                {cookieToken ? (
                  <span className="text-green-600">
                    ✅ Found ({cookieToken.length} chars)
                  </span>
                ) : (
                  <span className="text-red-600">❌ Not found</span>
                )}
              </p>
              {cookieToken && (
                <div className="mt-2">
                  <button
                    onClick={copyToken}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Copy Token
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="font-semibold">Token Preview:</label>
              <p className="text-xs font-mono bg-gray-200 p-2 rounded">
                {cookieToken
                  ? `${cookieToken.substring(0, 50)}...`
                  : "No token"}
              </p>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>

          <div className="space-y-3">
            <button
              onClick={testWithDirectApi}
              disabled={loading}
              className="w-full bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test with Direct API"}
            </button>

            <button
              onClick={testWithManualFetch}
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test with Manual Fetch"}
            </button>

            {testResult && (
              <div
                className={`p-3 rounded ${
                  testResult.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <h3 className="font-bold">
                  {testResult.success ? "✅ Success" : "❌ Error"}
                </h3>
                <pre className="text-xs mt-2 overflow-auto max-h-40">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-yellow-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure you're logged in first</li>
          <li>Check if the token is being retrieved from cookies</li>
          <li>Try both test buttons to see which one works</li>
          <li>Check the browser console for detailed logs</li>
          <li>Copy the token and test it manually in Postman</li>
        </ol>
      </div>
    </div>
  );
}
