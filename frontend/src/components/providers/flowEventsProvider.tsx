import { F } from "ramda";
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
});

export const FlowEventsProvider = ({ children }: PropsWithChildren) => {
  const flowEvents = useRef({
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
  });

  return (
    <FlowEventsContext.Provider value={flowEvents.current}>
      {children}
    </FlowEventsContext.Provider>
  );
};

export const useFlowEvents = () => {
  return useContext(FlowEventsContext);
};
