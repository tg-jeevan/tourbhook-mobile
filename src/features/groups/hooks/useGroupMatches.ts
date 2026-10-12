import { useEffect, useMemo, useState } from 'react';
import { CategoryFilter, TravelGroup } from '../types/groupTypes';
import { groupStore } from '../data/groupStore';

export function useGroupMatches(category: CategoryFilter) {
  const [allGroups, setAllGroups] = useState<TravelGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);

    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        setAllGroups(groupStore.getDiscoverableGroups());
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    const unsubscribe = groupStore.subscribe(() => {
      setTick(t => t + 1);
      setAllGroups(groupStore.getDiscoverableGroups());
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const groups = useMemo(() => {
    if (category === 'All') return allGroups;
    return allGroups.filter(group =>
      group.categories.includes(category.toLowerCase()),
    );
  }, [allGroups, category]);

  const joinGroup = (groupId: string) => {
    groupStore.joinGroup(groupId);
  };

  const isJoined = (groupId: string) => {
    return groupStore.isGroupJoined(groupId);
  };

  const retry = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      setAllGroups(groupStore.getDiscoverableGroups());
      setIsLoading(false);
    }, 300);
  };

  return {
    groups,
    isLoading,
    isError,
    retry,
    isJoined,
    joinGroup,
  };
}
