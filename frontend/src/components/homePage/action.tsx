import { FileUploader } from "components/molecules/Uploader";
import { useUser } from "hooks/useUser";
import { useCurrentAgreement } from "hooks/yagna/useCurrentAgreement";
import { Card } from "react-daisyui";
import { CloseSession } from "./closeSession";
import { match } from "ts-pattern";
import { UserState } from "types/user";
import { copy } from "utils/copy";
import { useScanResults } from "hooks/useScanResults";
import { useEffect, useState } from "react";
import { useDepositReleasedEvents } from "hooks/events/useDepositReleasedEvents";
import { useYagnaEvents } from "hooks/events/useYagnaEvents";
import { Event } from "types/events";
import { useDepositPaymentEvents } from "hooks/events/usePaymentEvents";
export const Action = () => {
  const currentAgreement = useCurrentAgreement();

  const { user } = useUser();

  const [state, setState] = useState<
    UserState | "HAS_FILE_SCANNED" | "AGREEMENT_RELEASED" | "DEPOSIT_RELEASED"
  >(user.state);

  useEffect(() => {
    if (
      !["HAS_FILE_SCANNED", "AGREEMENT_RELEASED", "DEPOSIT_RELEASED"].includes(
        state
      )
    ) {
      setState(user.state);
    }
  }, [user.state]);

  const { events$: scanResults$ } = useScanResults();
  const { events$: depositResults$ } = useDepositPaymentEvents();
  const { events$: yagnaEvents$ } = useYagnaEvents();
  useEffect(() => {
    const subscription = scanResults$.subscribe((event) => {
      console.log(event);
      if (
        event.kind === Event.FILE_SCAN_OK ||
        event.kind === Event.FILE_SCAN_ERROR
      ) {
        console.log("setting");
        setState("HAS_FILE_SCANNED");
      }
    });

    const subscription2 = depositResults$.subscribe((event) => {
      console.log(event);
      if (event.kind === Event.DEPOSIT_FEE_PAYMENT) {
        // setState("DEPOSIT_RELEASED");
      }
    });

    const subscription3 = yagnaEvents$.subscribe((event) => {
      if (event.kind === Event.AGREEMENT_TERMINATED) {
        setState("AGREEMENT_RELEASED");
      }
    });

    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
      subscription3.unsubscribe();
    };
  }, []);

  return (
    <>
      <Card className="p-2">
        <Card.Body>
          <Card.Title>
            {copy[state].title} {state}
          </Card.Title>
          <div dangerouslySetInnerHTML={copy[state].message}></div>
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
