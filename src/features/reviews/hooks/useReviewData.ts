import { useEffect, useState } from 'react';
import { getMockReviewData, ReviewData } from '../types/reviewTypes';

export function useReviewData(placeId: string) {
  const [data, setData] = useState<ReviewData | null>(null);
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
        setData(getMockReviewData(placeId));
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [placeId, reloadToken]);

  const retry = () => setReloadToken(token => token + 1);

  return { data, isLoading, isError, retry };
}