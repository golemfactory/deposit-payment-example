import axios from "axios";
import useSWRMutation from "swr/mutation";

import { useActionDebounce } from "hooks/useActionDbounce";

export const useReleaseAllocation = () => {
  const { trigger, isMutating } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/me`,
    function () {
      return axios.post(
        `${import.meta.env.VITE_BACKEND_HTTP_URL}/release-allocation`
      );
    }
  );
  const isReleasing = useActionDebounce(isMutating, 1000);
  return {
    releaseAllocation: trigger,
    isReleasing,
  };
};
