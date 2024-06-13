import axios from "axios";
import { useUser } from "hooks/useUser";
import { use } from "i18next";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { parseEther } from "viem";

import * as YaTsClient from "ya-ts-client";

export type AllocationDTO = YaTsClient.PaymentApi.AllocationDTO;

export const useCurrentAllocation = () => {
  const { user } = useUser();
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const { data, error } = useSWR<AllocationDTO>(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/allocation`,
    async (url) => {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    {
      isPaused: () => {
        return user.currentAllocation?.id === undefined;
      },
      refreshInterval: 1000,
    }
  );

  return data
    ? {
        currentAllocation: {
          totalAmount: parseEther(data?.totalAmount || "0"),
          spentAmount: parseEther(data?.spentAmount || "0"),
          remainingAmount: parseEther(data?.remainingAmount || "0"),
        },
        isLoading: !error && !data,
        isError: error,
      }
    : {
        currentAllocation: {
          totalAmount: undefined,
          spentAmount: undefined,
          remainingAmount: undefined,
        },
        isLoading: !error && !data,
        isError: error,
      };
};
