import axios from "axios";
import useSWRMutation from "swr/mutation";

import { useActionDebounce } from "hooks/useActionDbounce";

export const useCreateAllocation = () => {
  const { trigger, isMutating } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/me`,
    function () {
      return axios.post(`${import.meta.env.VITE_BACKEND_HTTP_URL}/allocation`);
    }
  );

  const isCreating = useActionDebounce(isMutating, 1000);

  return {
    createAllocation: trigger,
    isCreating,
  };
};
