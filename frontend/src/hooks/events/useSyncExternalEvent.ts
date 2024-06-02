import { useCallback, useMemo, useSyncExternalStore } from "react";
import { Subject } from "rxjs";
import { Payload, Event } from "types/events";
import { useCall } from "wagmi";

const getId = (e: any) => e.id;
export const useSyncExternalEvents = ({
  key,
  eventKind,
}: {
  key: string;
  eventKind: Event;
}) => {
  const events$ = useMemo(() => {
    return new Subject<{
      kind: typeof eventKind;
      payload: Payload[typeof eventKind];
    }>();
  }, []);

  const store = useMemo(() => {
    return {
      getSnapshot: () => {
        return localStorage.getItem(key);
      },
      subscribe: () => {
        const callback = (event: StorageEvent) => {
          const lastEvent = JSON.parse(event.newValue || "[]").find(
            (e: any) =>
              !JSON.parse(event.oldValue || "[]")
                .map(getId)
                .includes(e.id)
          ) as { kind: typeof eventKind; payload: Payload[typeof eventKind] };
          if (lastEvent) {
            events$.next(lastEvent);
          }
        };
        window.addEventListener("storage", callback);
        return () => {
          window.removeEventListener("storage", callback);
        };
      },
    };
  }, []);

  const emit = useCallback((payload: Payload[typeof eventKind]) => {
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
    console.log("emitting", newEvents);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(newEvents),
        oldValue: JSON.stringify(currentEvents),
      })
    );
  }, []);

  return {
    events$,
    emit,
    currentEvents: useSyncExternalStore(store.subscribe, store.getSnapshot),
  };
};
