import { useEffect, useMemo, useState } from 'react';
import { CategoryFilter, getMockTravelGroups, TravelGroup } from '../types/groupTypes';

export function useGroupMatches(category: CategoryFilter) {
  const [allGroups, setAllGroups] = useState<TravelGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    const timer = setTimeout(() => {
            if (cancelled) return;
      try {
        setAllGroups(getMockTravelGroups());
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
  }, [reloadToken]);

  const groups = useMemo(() => {
    if (category === 'All') return allGroups;
    return allGroups.filter(group => group.categories.includes(category.toLowerCase()));
  }, [allGroups, category]);

  const joinGroup = (groupId: string) => {
    setJoinedGroupIds(prev => (prev.includes(groupId) ? prev : [...prev, groupId]));
  };

  const retry = () => setReloadToken(token => token + 1);

  return { groups, isLoading, isError, retry, joinedGroupIds, joinGroup };
}