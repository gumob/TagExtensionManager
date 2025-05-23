import { useEffect, useState } from 'react';

import { chromeAPI } from '../api/chrome';

export function useChromeStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await chromeAPI.get<T>(key);
        if (storedValue !== null) {
          setValue(storedValue);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load value'));
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const setStoredValue = async (newValue: T) => {
    try {
      await chromeAPI.set(key, newValue);
      setValue(newValue);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save value'));
    }
  };

  return { value, setValue: setStoredValue, isLoading, error };
}
