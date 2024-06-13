import axios from "axios";
import useSWRMutation from "swr/mutation";

import { useActionDebounce } from "hooks/useActionDbounce";

export const useReleaseAgreement = () => {
  const { trigger, isMutating } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/release-agreement`,
    function (url, { arg }: { arg: string }) {
      return axios.post(url, {
        agreementId: arg,
      });
    }
  );

  const isReleasing = useActionDebounce(isMutating, 1000);
  return {
    releaseAgreement: trigger,
    isReleasing,
  };
};
