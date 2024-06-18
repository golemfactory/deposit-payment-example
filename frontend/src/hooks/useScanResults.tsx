import useSWRSubscription from "swr/subscription";
import { useEvents } from "./events/useEvents";
import { fileStatus } from "types/file";
import { Event } from "types/events";
import { match } from "ts-pattern";
import { useFileUploader } from "components/providers/fileUploader";
import debug from "debug";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";
const log = debug("useScanResults");

export const useScanResults = () => {
  log("useScanResults");
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

  const socketRef = useRef(
    io(`${import.meta.env.VITE_BACKEND_WS_URL}/scan-result`, {
      autoConnect: false,
    })
  );

  const [accessToken] = useLocalStorage("accessToken");

  useEffect(() => {
    if (accessToken) {
      socketRef.current.auth = { token: accessToken };
      socketRef.current.connect();
      console.log("connecting ");
      socketRef.current.on("event", (event) => {
        log("message", event);
        const file = JSON.parse(event);
        removeFile(file.id);
        emit(file, file.result);
      });
    }
  });

  return {
    events$,
    clean,
  };
};
