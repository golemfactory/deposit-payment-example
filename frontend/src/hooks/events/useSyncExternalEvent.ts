import { useCallback, useMemo, useSyncExternalStore } from "react";
import { Subject } from "rxjs";
import { useCall } from "wagmi";

const getId = (e: any) => e.id;
export const useSyncExternalEvents = (key: string) => {
  const events$ = useMemo(() => {
    return new Subject();
  }, []);

  const store = useMemo(() => {
    return {
      getSnapshot: () => {
        return localStorage.getItem(key);
      },
      subscribe: () => {
        const callback = (event: StorageEvent) => {
          console.log("storage event", event);
          const lastEvent = JSON.parse(event.newValue || "[]").find(
            (e: any) =>
              !JSON.parse(event.oldValue || "[]")
                .map(getId)
                .includes(e.id)
          );
          console.log("last event", lastEvent);
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

  const emit = useCallback((event: any) => {
    const currentEvents = JSON.parse(localStorage.getItem(key) || "[]");
    const newEvents = [
      ...currentEvents,
      { ...event, id: currentEvents.length + 1 },
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
