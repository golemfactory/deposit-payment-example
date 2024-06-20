import axios from "axios";
import { useYagnaEvents } from "hooks/events/useYagnaEvents";
import { useUser } from "hooks/useUser";
import { useUserData } from "hooks/userUserData";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Event } from "types/events";
import * as YaTsClient from "ya-ts-client";
export type AgreementDTO = YaTsClient.MarketApi.AgreementDTO;

export const useCurrentAgreement = () => {
  const { data: userData, isLoading: isUserLoading } = useUserData();
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const { events$: yagnaEvents$ } = useYagnaEvents();
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
    const sub = yagnaEvents$.subscribe((event) => {
      if (event.kind === Event.AGREEMENT_TERMINATED) {
        setIsPaused(true);
      }
      if (event.kind === Event.AGREEMENT_SIGNED) {
        mutate();
        setIsPaused(false);
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);
  return data;
};
