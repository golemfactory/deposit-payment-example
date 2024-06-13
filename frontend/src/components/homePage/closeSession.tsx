import { useFlowEvents } from "components/providers/flowEventsProvider";
import { useReleaseAgreement } from "hooks/yagna/useReleaseAgreement";
import { useReleaseAllocation } from "hooks/yagna/useReleaseAllocation";
import { useRef, useState } from "react";
import { Button } from "react-daisyui";
import { Subject } from "rxjs";

export const CloseSession = () => {
  const { closeSession } = useFlowEvents();

  return (
    <>
      <Button onClick={closeSession}>Cleanup </Button>
    </>
  );
};
