import { useState, useCallback } from 'react';
import { api } from '../services/api';

export function useApi<T = any>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (queryParams?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = path;
      if (queryParams) {
        const params = new URLSearchParams(queryParams).toString();
        url = `${path}?${params}`;
      }
      const result = await api<T>(url);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [path]);

  return { data, isLoading, error, fetch, setData };
}
