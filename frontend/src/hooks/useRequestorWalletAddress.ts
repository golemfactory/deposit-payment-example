import axios from "axios";
import useSWR from "swr";

export const useRequestorWalletAddress = (): (
  | {
      data: {
        wallet?: `0x${string}`;
      };
      error: undefined;
    }
  | {
      data: undefined;
      error: Error;
    }
  | {
      data: undefined;
      error: undefined;
    }
) & {
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR<{
    data: { wallet: `0x${string}` };
  }>(`${import.meta.env.VITE_BACKEND_HTTP_URL}/requestor`, axios.get);
  return {
    data: { wallet: data?.data.wallet },
    error,
    isLoading: isLoading,
  };
};
