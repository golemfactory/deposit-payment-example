import { PropsWithChildren, createContext, useContext, useRef } from "react";
import { Subject } from "rxjs";

const FlowEventsContext = createContext({
  events$: new Subject(),
  closeSession() {
    this.events$.next("close");
  },
  releaseAgreement() {
    this.events$.next("releaseAgreement");
  },
  releaseAllocation() {
    this.events$.next("releaseAllocation");
  },
  restartSession() {
    this.events$.next("restartSession");
  },
});

export const FlowEventsProvider = ({ children }: PropsWithChildren) => {
  const events = useRef(new Subject());
  return (
    <FlowEventsContext.Provider
      value={{
        events$: events.current,
        closeSession() {
          events.current.next("close");
        },
        releaseAgreement() {
          events.current.next("releaseAgreement");
        },
        releaseAllocation() {
          events.current.next("releaseAllocation");
        },
        restartSession() {
          events.current.next("restartSession");
        },
      }}
    >
      {children}
    </FlowEventsContext.Provider>
  );
};

export const useFlowEvents = () => {
  return useContext(FlowEventsContext);
};
