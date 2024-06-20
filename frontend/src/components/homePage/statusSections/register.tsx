import { useFlowEvents } from "components/providers/flowEventsProvider";
import { useUser } from "hooks/useUser";
import { useEffect } from "react";

export const Register = () => {
  const { user } = useUser();
  const { events$: flowEvents$, releaseAgreement } = useFlowEvents();

  return (
    <div className="stats shadow pt-4 pb-4">
      <div className="stat ">
        <div className="stat-title">Registered</div>
        <div className="stat-value">
          {user.isRegistered() ? "OK" : "Not registered"}{" "}
        </div>
      </div>
    </div>
  );
};
