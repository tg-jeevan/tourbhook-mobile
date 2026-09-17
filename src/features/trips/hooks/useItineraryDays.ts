import { useEffect, useState } from 'react';
import { getMockItineraryDays, ItineraryDay } from '../types/itineraryPackingTypes';

export function useItineraryDays(tripId: string) {
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);

    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        setDays(getMockItineraryDays());
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [tripId, reloadToken]);

  const retry = () => setReloadToken(token => token + 1);

  return { days, isLoading, isError, retry };
}