import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { Subject } from "rxjs";
import { Payload, Event, ExtractPayload } from "types/events";

const getId = (e: any) => e.id;

export const useSyncExternalEvents = <K extends Event>({
  key,
  eventKind,
}: {
  key: string;
  eventKind: K;
}) => {
  const events$ = useMemo(() => {
    console.log("werwe");
    return new Subject<{
      kind: K;
      payload: Payload[typeof eventKind];
      id: number;
      timestamp: number;
    }>();
  }, []);

  const previousEvents = useRef<any[]>([]);

  const store = useRef({
    getSnapshot: () => {
      const events = localStorage.getItem(key);
      return events;
    },
    subscribe: (listener: () => void) => {
      window.addEventListener("storage", listener);
      return () => {
        window.removeEventListener("storage", listener);
      };
    },
  });

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
    localStorage.setItem(key, JSON.stringify(newEvents));
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(newEvents),
        oldValue: JSON.stringify(currentEvents),
      })
    );
  }, []);

  const currentEvents = useSyncExternalStore(
    store.current.subscribe,
    store.current.getSnapshot
  );

  useEffect(() => {
    console.log("allo");
    if (currentEvents) {
      console.log("currentEvents", currentEvents);
      const events = JSON.parse(currentEvents);
      events.forEach((e: any) => {
        if (e.kind === eventKind) {
          console.log("proper kins");
          console.log("calling next");
          events$.next(e);
        }
      });
    }
  }, [currentEvents]);
  return {
    events$,
    emit,
  };
};
