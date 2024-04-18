import axios from "axios";
import useSWRMutation from "swr/mutation";

export const useReleaseAgreement = () => {
  const { trigger } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_URL}/release-agreement`,
    axios.post
  );
  return {
    releaseAgreement: trigger,
  };
};
