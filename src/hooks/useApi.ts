import { useState, useEffect } from "react";
import client from "@/lib/api";

interface UseApiOptions<T> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  lazy?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  loaded: boolean;
  error: any;
  callApi: (data?: any) => Promise<void>;
  reset: () => void;
}

export function useApi<T>({
  url,
  method = "GET",
  data: initialData,
  lazy = false,
}: UseApiOptions<T>): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<any>(null);

  const callApi = async (requestData?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.request({
        url,
        method,
        data: requestData || initialData,
      });
      setData(response.data);
      setLoaded(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setLoaded(false);
    setError(null);
  };

  useEffect(() => {
    if (!lazy) {
      callApi();
    }
  }, [url, method, lazy]);

  return { data, loading, loaded, error, callApi, reset };
}
