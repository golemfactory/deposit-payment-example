import { useRef, useState } from "react";
import useSWRSubscription from "swr/subscription";
import * as R from "ramda";
import { useFileUploader } from "components/providers/fileUploader";
export const useScanResults = () => {
  const scanResults = useRef<object[]>([]);
  const { removeFile } = useFileUploader();
  const { data, error } = useSWRSubscription("scanResult", (key, { next }) => {
    const eventSource = new WebSocket(
      `${import.meta.env.VITE_BACKEND_HTTP_URL.replace("http", "ws")}/scan-result`
    );

    eventSource.addEventListener("message", (event) => {
      const file = JSON.parse(event.data);
      const newResults = R.uniqWith(
        // @ts-ignore
        R.eqProps("id"),
        scanResults.current.concat([file])
      );
      scanResults.current = newResults;
      removeFile(file.id);
      next(null, newResults);
    });

    return () => eventSource.close();
  });

  return {
    data: data || [],
    error,
  };
};
