import { use } from "i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { Payload, Event, ExtractPayload } from "types/events";
import useLocalStorageState from "use-local-storage-state";
import { v4 as uuidv4 } from "uuid";
const getId = (e: any) => e.id;

export const useEvents = <K extends Event>({
  key,
  eventKind,
}: {
  key: string;
  eventKind: K | ((s: string) => K);
}) => {
  if (typeof eventKind !== "function") {
    const kindOfEvent = eventKind;
    eventKind = (s: string) => kindOfEvent;
  }

  const [currentEvents, setCurrentEvents] = useLocalStorageState<any[]>(key, {
    defaultValue: [],
  });

  const events$ = useRef<null | Subject<any>>(null);
  const previousEvents = useRef<any[]>([]);

  const [isFirstRun, setIsFirstRun] = useState(true);
  if (!events$.current) {
    events$.current = new Subject<{
      kind: K;
      payload: Payload[typeof eventKind extends (s: string) => infer R ? R : K];
      id: number;
      timestamp: number;
    }>();
  }

  if (!previousEvents.current) {
    previousEvents.current = [];
  }

  const emit = useCallback(
    (payload: ExtractPayload<K>, eventType: string = "") => {
      const currentEvents = JSON.parse(localStorage.getItem(key) || "[]");

      const newEvents = [
        ...currentEvents,
        {
          ...{
            kind: eventKind(eventType),
            payload,
          },
          //@ts-ignore
          id: payload?.id || uuidv4(),
          timestamp: Date.now(),
        },
      ];

      setCurrentEvents(newEvents);
    },
    []
  );

  useEffect(() => {
    if (currentEvents) {
      currentEvents.forEach((e: any) => {
        if (!previousEvents.current.find((p) => getId(p) === getId(e))) {
          events$.current?.next(e);
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
    clean: () => {
      setCurrentEvents([]);
    },
  };
};
