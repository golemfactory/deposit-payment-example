import { FileUploader } from "components/molecules/Uploader";
import { useUser } from "hooks/useUser";
import { Card } from "react-daisyui";
import { UserState } from "types/user";
import { copy } from "utils/copy";
import { useScanResults } from "hooks/useScanResults";
import { useEffect, useState } from "react";
import { useYagnaEvents } from "hooks/events/useYagnaEvents";
import { Event } from "types/events";
import { useDepositPaymentEvents } from "hooks/events/usePaymentEvents";
import { useFlowEvents } from "components/providers/flowEventsProvider";
import { set } from "ramda";
export const Action = () => {
  const { user } = useUser();
  //TODO : this logic should be move outside of this component
  // probably we should extend user state provider to handle this

  const [state, setState] = useState<
    | UserState
    | "HAS_FILE_SCANNED"
    | "AGREEMENT_RELEASED"
    | "DEPOSIT_RELEASED"
    | "WAITING_FOR_PROVIDER_PAYMENT"
    | "WAITING_FOR_OWNER_PAYMENT"
  >(user.state);

  useEffect(() => {
    if (
      state !== "WAITING_FOR_OWNER_PAYMENT" &&
      state !== "WAITING_FOR_PROVIDER_PAYMENT"
    ) {
      setState(user.state);
    }
  }, [user.state]);

  const { events$: scanResults$ } = useScanResults();
  const { events$: yagnaEvents$ } = useYagnaEvents();
  const { events$: flowEvents$ } = useFlowEvents();
  const { events$: paymentEvents$ } = useDepositPaymentEvents();
  useEffect(() => {
    const scanResultSub = scanResults$.subscribe((event) => {
      if (
        event.kind === Event.FILE_SCAN_OK ||
        event.kind === Event.FILE_SCAN_ERROR
      ) {
        setState("HAS_FILE_SCANNED");
      }
    });

    const yagnaSub = yagnaEvents$.subscribe((event) => {
      if (event.kind === Event.AGREEMENT_TERMINATED) {
        setState("AGREEMENT_RELEASED");
      }
    });

    const flowSub = flowEvents$.subscribe((event) => {
      if (event === "releaseAllocation") {
        setState("WAITING_FOR_OWNER_PAYMENT");
      }

      if (event === "releaseAgreement") {
        setState("WAITING_FOR_PROVIDER_PAYMENT");
      }
    });

    const paymentsSub = paymentEvents$.subscribe((event) => {
      if (event.kind === Event.DEPOSIT_PROVIDER_PAYMENT) {
        setState((prev) => {
          if (prev !== "DEPOSIT_RELEASED") {
            return "AGREEMENT_RELEASED";
          }
          return prev;
        });
      }
      if (event.kind === Event.DEPOSIT_FEE_PAYMENT) {
        console.log("DEPOSIT_FEE_PAYMENT");
        setState("DEPOSIT_RELEASED");
      }
    });

    return () => {
      scanResultSub.unsubscribe();
      yagnaSub.unsubscribe();
      flowSub.unsubscribe();
      paymentsSub.unsubscribe();
    };
  }, []);

  return (
    <>
      <Card className="p-2">
        <Card.Body>
          <Card.Title className="mb-2">{copy[state].title}</Card.Title>
          <div dangerouslySetInnerHTML={copy[state].message}></div>
          {state === "DEPOSIT_RELEASED" ? (
            <div className="grid grid-cols-12 mt-12 ">
              <div className="col-start-6 col-span-2">
                <button
                  className="btn"
                  onClick={() => {
                    flowEvents$.complete();
                  }}
                >
                  Restart session
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </Card.Body>
        {}
      </Card>
      {user.currentAgreement?.state === "Approved" ? (
        <>
          <FileUploader />
          {/* <CloseSession /> */}
        </>
      ) : (
        ""
      )}
    </>
  );
};
