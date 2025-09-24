"use client";

import { useState, useEffect } from "react";
import { emailApi } from "@/lib/emailApi";

export default function TestApiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApiCall = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Making API call...");
      const result = await emailApi.healthCheck();
      console.log("API Response:", result);
      setData(result);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApiCall();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <button
        onClick={testApiCall}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Loading..." : "Test API Call"}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold">API Response:</h2>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Data type: {typeof data}</p>
        <p>Data is null: {data === null ? "Yes" : "No"}</p>
        <p>Data has status: {data && data.status ? "Yes" : "No"}</p>
        {data && data.status && <p>Status: {data.status}</p>}
      </div>
    </div>
  );
}
