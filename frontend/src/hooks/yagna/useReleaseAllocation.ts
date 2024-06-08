import axios from "axios";
import useSWRMutation from "swr/mutation";

export const useReleaseAllocation = () => {
  const { trigger } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/me`,
    function () {
      return axios.post(
        `${import.meta.env.VITE_BACKEND_HTTP_URL}/release-allocation`
      );
    }
  );
  return {
    releaseAllocation: trigger,
  };
};
