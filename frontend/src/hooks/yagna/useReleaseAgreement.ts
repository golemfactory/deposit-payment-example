import axios from "axios";
import useSWRMutation from "swr/mutation";

import { useActionDebounce } from "hooks/useActionDbounce";
import { useFlowEvents } from "components/providers/flowEventsProvider";

export const useReleaseAgreement = () => {
  const { releaseAgreement } = useFlowEvents();
  const { trigger, isMutating, data } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/release-agreement`,
    function (url, { arg }: { arg: string }) {
      return axios.post(url, {
        agreementId: arg,
      });
    }
  );

  const isReleasing = useActionDebounce(isMutating, 1000);
  return {
    releaseAgreement: (arg?: any) => {
      trigger(arg).then(() => {
        releaseAgreement();
      });
    },
    isReleasing,
  };
};
