import { useState } from "react";
import useSWRSubscription from "swr/subscription";
import * as R from "ramda";
export const useScanResults = () => {
  const [scanResults, setScanResults] = useState<object[]>([]);
  const { data, error } = useSWRSubscription("scanResult", (key, { next }) => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/scan-result`
    );
    eventSource.onmessage = (event) => {
      const newResults = R.uniqWith(
        // @ts-ignore
        R.eqProps("id"),
        scanResults.concat([JSON.parse(event.data)])
      );
      next(null, newResults);
      setScanResults(newResults);
    };

    return () => eventSource.close();
  });

  return {
    data,
    error,
  };
};
