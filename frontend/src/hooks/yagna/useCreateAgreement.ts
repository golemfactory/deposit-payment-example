import axios from "axios";
import useSWRMutation from "swr/mutation";
import { useSnackbar } from "notistack";
import { useActionDebounce } from "hooks/useActionDbounce";
import { useEffect } from "react";
export const useCreateAgreement = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { trigger, isMutating, error } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/me`,
    function () {
      return axios.post(
        `${import.meta.env.VITE_BACKEND_HTTP_URL}/create-agreement`
      );
    }
  );

  useEffect(() => {
    if (error) {
      enqueueSnackbar("Error creating agreement", { variant: "error" });
      console.error("Error creating agreement", error);
    }
  }, [error]);

  const isCreating = useActionDebounce(isMutating, 1000);
  return {
    createAgreement: trigger,
    isCreating: isCreating,
  };
};
