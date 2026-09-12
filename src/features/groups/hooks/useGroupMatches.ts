import { useEffect, useMemo, useState } from 'react';
import { CategoryFilter, getMockTravelGroups, TravelGroup } from '../types/groupTypes';

export function useGroupMatches(category: CategoryFilter) {
  const [allGroups, setAllGroups] = useState<TravelGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setAllGroups(getMockTravelGroups());
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const groups = useMemo(() => {
    if (category === 'All') return allGroups;
    return allGroups.filter(group => group.categories.includes(category.toLowerCase()));
  }, [allGroups, category]);

  const joinGroup = (groupId: string) => {
    setJoinedGroupIds(prev => (prev.includes(groupId) ? prev : [...prev, groupId]));
  };

  return { groups, isLoading, joinedGroupIds, joinGroup };
}