import { useEffect, useState, useCallback } from 'react';
import {
  ItineraryDay,
  TimelineItem,
} from '../types/itineraryPackingTypes';
import { itineraryStore } from '../data/itineraryStore';

export function useItineraryDays(tripId: string) {
  const [days, setDays] = useState<ItineraryDay[]>(() =>
    itineraryStore.getItineraryDays(tripId)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  // Sync state whenever tripId changes or the store updates
  useEffect(() => {
    setDays(itineraryStore.getItineraryDays(tripId));

    const unsubscribe = itineraryStore.subscribe(() => {
      setDays(itineraryStore.getItineraryDays(tripId));
    });
    return unsubscribe;
  }, [tripId]);

  useEffect(() => {
    if (reloadToken === 0) return;
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);

    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        setDays(itineraryStore.getItineraryDays(tripId));
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [tripId, reloadToken]);

  const retry = () => setReloadToken((token) => token + 1);

  const deleteActivity = useCallback(
    (dayIndex: number, activityId: string) => {
      setDays((prev) => {
        const copy = [...prev];
        if (!copy[dayIndex]) return prev;
        copy[dayIndex] = {
          ...copy[dayIndex],
          items: copy[dayIndex].items.filter((item) => item.id !== activityId),
        };
        itineraryStore.setItineraryDays(tripId, copy);
        return copy;
      });
    },
    [tripId],
  );

  const duplicateActivity = useCallback(
    (dayIndex: number, activity: TimelineItem) => {
      setDays((prev) => {
        const copy = [...prev];
        if (!copy[dayIndex]) return prev;
        const targetIndex = copy[dayIndex].items.findIndex(
          (item) => item.id === activity.id,
        );
        const newItem: TimelineItem = {
          ...activity,
          id: `${activity.id}-copy-${Date.now()}`,
          title: `${activity.title} (Copy)`,
        };
        const newItems = [...copy[dayIndex].items];
        if (targetIndex >= 0) {
          newItems.splice(targetIndex + 1, 0, newItem);
        } else {
          newItems.push(newItem);
        }
        copy[dayIndex] = {
          ...copy[dayIndex],
          items: newItems,
        };
        itineraryStore.setItineraryDays(tripId, copy);
        return copy;
      });
    },
    [tripId],
  );

  const updateActivity = useCallback(
    (dayIndex: number, updatedActivity: TimelineItem) => {
      setDays((prev) => {
        const copy = [...prev];
        if (!copy[dayIndex]) return prev;
        copy[dayIndex] = {
          ...copy[dayIndex],
          items: copy[dayIndex].items.map((item) =>
            item.id === updatedActivity.id ? updatedActivity : item,
          ),
        };
        itineraryStore.setItineraryDays(tripId, copy);
        return copy;
      });
    },
    [tripId],
  );

  const addActivity = useCallback(
    (dayIndex: number, newActivity: TimelineItem) => {
      setDays((prev) => {
        const copy = [...prev];
        if (!copy[dayIndex]) return prev;
        copy[dayIndex] = {
          ...copy[dayIndex],
          items: [...copy[dayIndex].items, newActivity],
        };
        itineraryStore.setItineraryDays(tripId, copy);
        return copy;
      });
    },
    [tripId],
  );

  return {
    days,
    setDays,
    isLoading,
    isError,
    retry,
    deleteActivity,
    duplicateActivity,
    updateActivity,
    addActivity,
  };
}
