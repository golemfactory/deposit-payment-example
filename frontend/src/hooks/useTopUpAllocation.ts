import axios from "axios";
import useSWRMutation from "swr/mutation";

export const useTopUpAllocation = () => {
  const { trigger, isMutating } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_URL}/top-up-allocation`,
    (url, { arg: amount }: { arg: number }) => {
      return axios.put(url, { amount });
    }
  );
  return {
    trigger,
    isMutating,
  };
};
