import { useEffect, useRef, useState } from 'react';

export type PackingItemSource = 'base' | 'ai';

export interface PackingItem {
  id: string;
  name: string;
  checked: boolean;
  source: PackingItemSource;
}

const MOCK_AI_SUGGESTIONS = ['Reef-safe sunscreen', 'Sarong for temples', 'Insect repellent', 'Power adapter'];

const SUGGESTION_INTERVAL_MS = 4000;

export function usePackingRecommendations(existingNames: string[]) {
  const [recommendations, setRecommendations] = useState<PackingItem[]>([]);
  const existingNamesRef = useRef(existingNames);
  existingNamesRef.current = existingNames;

  useEffect(() => {
    let cancelled = false;
    let suggestionIndex = 0;

    const scheduleNext = () => {
      return setTimeout(() => {
        if (cancelled) return;

        while (suggestionIndex < MOCK_AI_SUGGESTIONS.length) {
          const candidate = MOCK_AI_SUGGESTIONS[suggestionIndex];
          suggestionIndex += 1;

          const alreadyPresent = existingNamesRef.current
            .map(n => n.toLowerCase())
            .includes(candidate.toLowerCase());

          if (!alreadyPresent) {
            setRecommendations(prev => [
              ...prev,
              { id: `ai-${candidate}`, name: candidate, checked: false, source: 'ai' as const },
            ]);
            break;
          }
        }

        if (suggestionIndex < MOCK_AI_SUGGESTIONS.length) {
          timerId = scheduleNext();
        }
      }, SUGGESTION_INTERVAL_MS);
    };

    let timerId = scheduleNext();
    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, []);

  return recommendations;
}