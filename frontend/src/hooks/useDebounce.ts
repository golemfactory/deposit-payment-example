import { useEffect, useState } from "react";

export function useDebounce(
  value: unknown,
  delayMap: Map<unknown, number>,
  delay?: number
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const delayForValue = delayMap.get(value) || delay;
    if (delayForValue) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delayForValue);

      return () => {
        clearTimeout(handler);
      };
    } else {
      setDebouncedValue(value);
    }
  }, [value, delay]);

  return debouncedValue;
}
