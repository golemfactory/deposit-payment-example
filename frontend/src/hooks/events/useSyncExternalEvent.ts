import { useCallback, useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { Payload, Event, ExtractPayload } from "types/events";
import useLocalStorageState from "use-local-storage-state";

const getId = (e: any) => e.id;

export const useSyncExternalEvents = <K extends Event>({
  key,
  eventKind,
}: {
  key: string;
  eventKind: K;
}) => {
  const [currentEvents, setCurrentEvents] = useLocalStorageState<any[]>(key, {
    defaultValue: [],
  });
  const events$ = useRef<null | Subject<any>>(null);
  const previousEvents = useRef<any[]>([]);

  const [isFirstRun, setIsFirstRun] = useState(true);
  if (!events$.current) {
    events$.current = new Subject<{
      kind: K;
      payload: Payload[typeof eventKind];
      id: number;
      timestamp: number;
    }>();
  }

  if (!previousEvents.current) {
    previousEvents.current = [];
  }

  const emit = useCallback((payload: ExtractPayload<K>) => {
    const currentEvents = JSON.parse(localStorage.getItem(key) || "[]");
    const newEvents = [
      ...currentEvents,
      {
        ...{
          kind: eventKind,
          payload,
        },
        id: currentEvents.length + 1,
        timestamp: Date.now(),
      },
    ];
    setCurrentEvents(newEvents);
  }, []);

  useEffect(() => {
    if (currentEvents) {
      currentEvents.forEach((e: any) => {
        if (e.kind === eventKind) {
          if (!previousEvents.current.find((p) => getId(p) === getId(e))) {
            events$.current?.next(e);
          }
        }
      });
      setIsFirstRun(false);
      if (!isFirstRun) {
        previousEvents.current = currentEvents;
      }
    }
  }, [currentEvents]);

  useEffect(() => {
    if (!isFirstRun) {
      previousEvents.current = currentEvents;
    }
  }, [isFirstRun]);

  return {
    events$: events$.current,
    emit,
  };
};
