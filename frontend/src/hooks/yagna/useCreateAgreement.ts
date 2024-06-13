import axios from "axios";
import useSWRMutation from "swr/mutation";

import { useActionDebounce } from "hooks/useActionDbounce";
export const useCreateAgreement = () => {
  const { trigger, isMutating } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/me`,
    function () {
      return axios.post(
        `${import.meta.env.VITE_BACKEND_HTTP_URL}/create-agreement`
      );
    }
  );
  const isCreating = useActionDebounce(isMutating, 1000);
  return {
    createAgreement: trigger,
    isCreating: isCreating,
  };
};
