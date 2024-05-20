import { useSyncExternalStore } from "react";
export const useLocalStorage = (key: string) => {
  const setState = (newValue: any) => {
    localStorage.setItem(key, newValue);
    window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
  };

  const getSnapshot = () => localStorage.getItem(key);

  const subscribe = (listener: () => void) => {
    window.addEventListener("storage", listener);
    return () => void window.removeEventListener("storage", listener);
  };

  const store = useSyncExternalStore(subscribe, getSnapshot);

  return [store, setState] as const;
};
