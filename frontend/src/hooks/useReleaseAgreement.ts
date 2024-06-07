import axios from "axios";
import useSWRMutation from "swr/mutation";

export const useReleaseAgreement = () => {
  const { trigger } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/release-agreement`,
    function (url, { arg }: { arg: string }) {
      return axios.post(url, {
        agreementId: arg,
      });
    }
  );
  return {
    releaseAgreement: trigger,
  };
};
