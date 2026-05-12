import { useEffect, useState } from "react";

interface UseDebounceOptions<T> {
  value: T;
  delay?: number;
}
export const useDebounce = <T>({
  value,
  delay = 500,
}: UseDebounceOptions<T>) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};
