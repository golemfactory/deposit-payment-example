import axios from "axios";
import useSWRMutation from "swr/mutation";

import { useActionDebounce } from "hooks/useActionDbounce";
import { useFlowEvents } from "components/providers/flowEventsProvider";

export const useReleaseAllocation = () => {
  const { releaseAllocation } = useFlowEvents();
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
    releaseAllocation: (arg?: any) => {
      trigger(arg).then(() => {
        releaseAllocation();
      });
    },
    isReleasing,
  };
};
