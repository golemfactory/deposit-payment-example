import axios from "axios";
import useSWRMutation from "swr/mutation";
import { useDebounce } from "@uidotdev/usehooks";

export const useTopUpAllocation = () => {
  const { trigger, isMutating } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/top-up-allocation`,
    (url, { arg: amount }: { arg: number }) => {
      return axios.put(url, { amount });
    }
  );
  const isTopingUp = useDebounce(isMutating, 1000);
  return {
    trigger,
    isTopingUp,
  };
};
