import axios from "axios";
import { useUser } from "hooks/useUser";
import useSWR from "swr";

import * as YaTsClient from "ya-ts-client";
export type AgreementDTO = YaTsClient.MarketApi.AgreementDTO;

export const useCurrentAgreement = () => {
  const { user } = useUser();

  const { data, error } = useSWR<AgreementDTO>(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/agreement`,
    async (url) => {
      const response = await axios.get(url);
      return response.data;
    },
    {
      isPaused: () => {
        return user.currentAllocation?.id === undefined;
      },
      refreshInterval: 1000,
    }
  );

  return data;
};
