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
import { init, set } from "ramda";
import { AnimatePresence, Variants, motion } from "framer-motion";
export const Action = () => {
  const { user } = useUser();
  //TODO : this logic should be move outside of this component
  // probably we should extend user state provider to handle this

  const variants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
      height: "0px",
      top: "-20px",
    },
  };
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
  const { events$: flowEvents$, restartSession } = useFlowEvents();
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
      if (event === "restartSession") {
        setState(user.state);
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
          <AnimatePresence>
            <motion.h1
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              key={copy[state]?.title || state}
              transition={{ ease: "easeOut", duration: 0.5 }}
              className="text-xl font-semibold mb-4"
            >
              {copy[state]?.title || state}
            </motion.h1>
          </AnimatePresence>
          <AnimatePresence>
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              key={copy[state]?.message || state}
              transition={{ ease: "easeOut", duration: 0.5 }}
              dangerouslySetInnerHTML={
                copy[state]?.message || {
                  __html: <div>{state}</div>,
                }
              }
            ></motion.div>
          </AnimatePresence>
          {state === "DEPOSIT_RELEASED" ? (
            <div className="grid grid-cols-12 mt-12 ">
              <div className="col-start-6 col-span-2">
                <button
                  className="btn"
                  onClick={() => {
                    restartSession();
                    // flowEvents$.complete();
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
