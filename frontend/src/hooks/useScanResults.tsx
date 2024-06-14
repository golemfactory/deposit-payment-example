import useSWRSubscription from "swr/subscription";
import { useEvents } from "./events/useEvents";
import { fileStatus } from "types/file";
import { Event } from "types/events";
import { match } from "ts-pattern";
import { useFileUploader } from "components/providers/fileUploader";

export const useScanResults = () => {
  const { emit, events$, clean } = useEvents({
    key: "scanResults",
    eventKind: (s: any) => {
      return match(s)
        .with(fileStatus.CLEAN, () => Event.FILE_SCAN_OK)
        .with(fileStatus.INFECTED, () => Event.FILE_SCAN_ERROR)
        .otherwise(() => Event.FILE_SCAN_ERROR);
    },
  });

  const { removeFile } = useFileUploader();

  useSWRSubscription("scanResult", (key, { next }) => {
    const eventSource = new WebSocket(
      `${import.meta.env.VITE_BACKEND_HTTP_URL.replace("http", "ws")}/scan-result`
    );

    eventSource.addEventListener("message", (event) => {
      const file = JSON.parse(event.data);
      removeFile(file.id);
      emit(file, file.result);
    });

    return () => eventSource.close();
  });

  return {
    events$,
    clean,
  };
};
