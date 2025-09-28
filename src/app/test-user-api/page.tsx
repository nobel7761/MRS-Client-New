"use client";

import { useState } from "react";
import directApi from "@/lib/directApi";
import { useAuth } from "@/contexts/AuthContext";

export default function TestUserApiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token, isAuthenticated } = useAuth();

  const testUserApiCall = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await directApi.get("/user/all");
      setData(result.data);
    } catch (err: any) {
      console.error("❌ API Error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test User API Call</h1>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Auth Status:</h2>
        <p>Authenticated: {isAuthenticated ? "✅ Yes" : "❌ No"}</p>
        <p>User: {user ? `${user.firstName} ${user.lastName}` : "None"}</p>
        <p>Token: {token ? "✅ Present" : "❌ Missing"}</p>
      </div>

      <button
        onClick={testUserApiCall}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Test /user/all API Call"}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Success! API Response:</h3>
          <pre className="mt-2 text-sm overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-bold">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure you're logged in</li>
          <li>Check the browser console for detailed debug logs</li>
          <li>Click the test button to call the API</li>
          <li>Check if the token is being sent in the Authorization header</li>
        </ol>
      </div>
    </div>
  );
}
