import useSWRSubscription from "swr/subscription";
import { useEvents } from "./events/useEvents";
import { fileStatus } from "types/file";
import { Event } from "types/events";
import { match } from "ts-pattern";

export const useScanResults = () => {
  const { emit, events$ } = useEvents({
    key: "scanResults",
    eventKind: (s: any) => {
      return match(s.result)
        .with(fileStatus.CLEAN, () => Event.FILE_SCAN_OK)
        .with(fileStatus.INFECTED, () => Event.FILE_SCAN_ERROR)
        .otherwise(() => Event.FILE_SCAN_ERROR);
    },
  });

  useSWRSubscription("scanResult", (key, { next }) => {
    const eventSource = new WebSocket(
      `${import.meta.env.VITE_BACKEND_HTTP_URL.replace("http", "ws")}/scan-result`
    );

    eventSource.addEventListener("message", (event) => {
      const file = JSON.parse(event.data);
      console.log("Emmiting event", file);
      emit(file, file.result);
    });

    return () => eventSource.close();
  });

  return {
    events$,
  };
};
