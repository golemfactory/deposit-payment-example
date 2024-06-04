import axios from "axios";
import useSWRMutation from "swr/mutation";

export const useCreateAgreement = () => {
  const { trigger, isMutating } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/me`,
    function () {
      return axios.post(
        `${import.meta.env.VITE_BACKEND_HTTP_URL}/create-agreement`
      );
    }
  );

  return {
    createAgreement: trigger,
    isCreating: isMutating,
  };
};
