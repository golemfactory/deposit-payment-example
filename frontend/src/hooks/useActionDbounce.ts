import { set } from "ramda";
import { useEffect, useState } from "react";
import { isDocumentDefined } from "swr/dist/_internal";

export const useActionDebounce = (
  isPerforming: boolean,
  delay: number = 1000
) => {
  const [debouncedIsPerforming, setDebouncedIsPerforming] = useState(false);

  useEffect(() => {
    if (isPerforming) {
      setDebouncedIsPerforming(true);
    } else {
      const handler = setTimeout(() => {
        setDebouncedIsPerforming(false);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    }
  }, [isPerforming, delay]);

  return debouncedIsPerforming;
};
