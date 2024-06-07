import axios from "axios";
import useSWR from "swr";
import { parseEther } from "viem";

export const useCurrentAllocation = () => {
  // const { data, error } = useSWR<{
  //   totalAmount: string;
  //   spentAmount: string;
  //   remainingAmount: string;
  // }>(
  //   `${import.meta.env.VITE_BACKEND_HTTP_URL}/allocation`,
  //   async (url) => {
  //     const response = await axios.get(url);
  //     return response.data;
  //   },
  //   {
  //     refreshInterval: 10000,
  //   }
  // );
  return {
    currentAllocation: {
      totalAmount: parseEther("0"),
      spentAmount: parseEther("0"),
      remainingAmount: parseEther("0"),
    },
    isLoading: false,
    isError: false,
  }
  // return data
  //   ? {
  //       currentAllocation: {
  //         totalAmount: parseEther(data?.totalAmount || "0"),
  //         spentAmount: parseEther(data?.spentAmount || "0"),
  //         remainingAmount: parseEther(data?.remainingAmount || "0"),
  //       },
  //       isLoading: !error && !data,
  //       isError: error,
  //     }
  //   : {
  //       currentAllocation: {
  //         totalAmount: undefined,
  //         spentAmount: undefined,
  //         remainingAmount: undefined,
  //       },
  //       isLoading: !error && !data,
  //       isError: error,
  //     };
};
