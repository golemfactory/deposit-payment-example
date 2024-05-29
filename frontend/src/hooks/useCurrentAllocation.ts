import axios from "axios";
import useSWR from "swr";

export const useCurrentAllocation = () => {
  const { data, error } = useSWR(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/allocation`,
    async (url) => {
      const response = await axios.get(url);
      return response.data;
    },
    {
      refreshInterval: 10000,
    }
  );

  return {
    currentAllocation: data,
    isLoading: !error && !data,
    isError: error,
  };
};
