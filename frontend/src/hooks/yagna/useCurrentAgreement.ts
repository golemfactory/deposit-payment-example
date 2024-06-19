import axios from "axios";
import { useUser } from "hooks/useUser";
import { useUserData } from "hooks/userUserData";
import { useEffect, useState } from "react";
import useSWR from "swr";

import * as YaTsClient from "ya-ts-client";
export type AgreementDTO = YaTsClient.MarketApi.AgreementDTO;

export const useCurrentAgreement = () => {
  const { data: userData, isLoading: isUserLoading } = useUserData();
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const { data, mutate } = useSWR<AgreementDTO>(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/agreement`,
    async (url) => {
      const response = await axios.get(url);
      return response.data;
    },
    {
      isPaused: () => {
        return isPaused;
      },
      refreshInterval: 1000,
    }
  );
  useEffect(() => {
    console.log(userData.currentAgreement?.id);
    setIsPaused(!userData.currentAgreement?.id);
    mutate();
  }, [userData.currentAgreement?.id]);
  return data;
};
