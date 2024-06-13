import { F } from "ramda";
import { PropsWithChildren, createContext, useContext } from "react";
import { Subject } from "rxjs";

const FlowEventsContext = createContext({
  events$: new Subject(),
  closeSession: () => {
    console.log("close");
  },
});

export const FlowEventsProvider = ({ children }: PropsWithChildren) => {
  const flowEvents = new Subject();
  const closeSession = () => {
    console.log("close");
    flowEvents.complete();
  };

  return (
    <FlowEventsContext.Provider value={{ events$: flowEvents, closeSession }}>
      {children}
    </FlowEventsContext.Provider>
  );
};

export const useFlowEvents = () => {
  return useContext(FlowEventsContext);
};
