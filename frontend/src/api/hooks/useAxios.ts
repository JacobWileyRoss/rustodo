import { useState } from 'react';
import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios';

interface UseAxiosReturn {
  sendRequest: (config: AxiosRequestConfig) => Promise<AxiosResponse>;
  data: AxiosResponse | null;
  loading: boolean;
  error: string | null;
}

const useAxios = (): UseAxiosReturn => {
  const [data, setData] = useState<AxiosResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios(config);
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendRequest,
    data,
    loading,
    error,
  };
};

export default useAxios;
