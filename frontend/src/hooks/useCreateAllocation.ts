import axios from "axios";
import useSWRMutation from "swr/mutation";

export const useCreateAllocation = () => {
  const { trigger, isMutating } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_URL}/me`,
    function () {
      return axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-allocation`
      );
    }
  );
  return {
    createAllocation: trigger,
    isCreating: isMutating,
  };
};