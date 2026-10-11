import { User } from '../../../core/auth/AuthContext';

/**
 * Standard explorer levels supported across Tourbhook.
 */
export const EXPLORER_LEVELS = {
  WANDERER: 'Wanderer',
  EXPLORER: 'Explorer',
  ADVENTURER: 'Adventurer',
  GLOBETROTTER: 'Globetrotter',
  LEGEND: 'Legend',
} as const;

export type ExplorerLevelType = (typeof EXPLORER_LEVELS)[keyof typeof EXPLORER_LEVELS];

export interface UserLevelTier {
  id: string;
  name: string;
  minTrips: number;
  maxTrips: number;
  rangeLabel: string;
  iconBg: string;
  iconColor: string;
}

/**
 * Standard 5 Explorer Level Tiers with trip thresholds.
 */
export const USER_LEVEL_TIERS: UserLevelTier[] = [
  {
    id: 'wanderer',
    name: 'Wanderer',
    minTrips: 0,
    maxTrips: 2,
    rangeLabel: '0–2 trips',
    iconBg: '#F1F5F9',
    iconColor: '#94A3B8',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    minTrips: 3,
    maxTrips: 7,
    rangeLabel: '3–7 trips',
    iconBg: '#EDE9FE',
    iconColor: '#8B5CF6',
  },
  {
    id: 'adventurer',
    name: 'Adventurer',
    minTrips: 8,
    maxTrips: 15,
    rangeLabel: '8–15 trips',
    iconBg: '#FEF3C7',
    iconColor: '#F59E0B',
  },
  {
    id: 'globetrotter',
    name: 'Globetrotter',
    minTrips: 16,
    maxTrips: 30,
    rangeLabel: '16–30 trips',
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
  },
  {
    id: 'legend',
    name: 'Legend',
    minTrips: 31,
    maxTrips: Infinity,
    rangeLabel: '31+ trips',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
  },
];

export interface UserLevelProgress {
  currentTier: UserLevelTier;
  currentLevelName: string;
  nextTier: UserLevelTier | null;
  progressPercent: number;
  tripsRemaining: number;
  isMaxLevel: boolean;
  nextLevelMessage: string;
  tripCount: number;
}

/**
 * Calculates current explorer level tier, progress percentage toward next level,
 * and remaining trips required from actual user data and trip counts.
 */
export function calculateUserLevelProgress(
  tripCount?: number,
  user?: User | null,
  isPremium?: boolean
): UserLevelProgress {
  const safeTripCount = Math.max(
    0,
    typeof tripCount === 'number' && !isNaN(tripCount) ? tripCount : 0
  );

  let tierIndex = -1;

  const explicitLevel = user?.level || (user as any)?.explorerLevel;
  if (explicitLevel && typeof explicitLevel === 'string') {
    const cleanLevel = explicitLevel.toLowerCase();
    tierIndex = USER_LEVEL_TIERS.findIndex(
      (t) =>
        cleanLevel.includes(t.name.toLowerCase()) ||
        cleanLevel.includes(t.id.toLowerCase())
    );
  }

  if (tierIndex === -1) {
    if (user?.premium || isPremium) {
      const naturalIndex = USER_LEVEL_TIERS.findIndex(
        (t) => safeTripCount >= t.minTrips && safeTripCount <= t.maxTrips
      );
      const adventurerIndex = USER_LEVEL_TIERS.findIndex(
        (t) => t.id === 'adventurer'
      );
      tierIndex = Math.max(
        naturalIndex >= 0 ? naturalIndex : 0,
        adventurerIndex
      );
    } else {
      tierIndex = USER_LEVEL_TIERS.findIndex(
        (t) => safeTripCount >= t.minTrips && safeTripCount <= t.maxTrips
      );
      if (tierIndex === -1) {
        tierIndex = safeTripCount >= 31 ? USER_LEVEL_TIERS.length - 1 : 0;
      }
    }
  }

  const currentTier = USER_LEVEL_TIERS[tierIndex] || USER_LEVEL_TIERS[0];
  const isMaxLevel = tierIndex === USER_LEVEL_TIERS.length - 1;

  if (isMaxLevel) {
    return {
      currentTier,
      currentLevelName: currentTier.name,
      nextTier: null,
      progressPercent: 100,
      tripsRemaining: 0,
      isMaxLevel: true,
      nextLevelMessage: 'Highest level achieved! You are a master explorer.',
      tripCount: safeTripCount,
    };
  }

  const nextTier = USER_LEVEL_TIERS[tierIndex + 1];
  const tripsNeededForNext = nextTier.minTrips;
  const tripsRemaining = Math.max(0, tripsNeededForNext - safeTripCount);

  const tierSpan = nextTier.minTrips - currentTier.minTrips;
  const completedInTier = Math.max(0, safeTripCount - currentTier.minTrips);
  const progressPercent =
    tierSpan > 0
      ? Math.min(100, Math.max(0, Math.round((completedInTier / tierSpan) * 100)))
      : 0;

  const nextLevelMessage =
    tripsRemaining === 1
      ? `Complete 1 more trip to reach ${nextTier.name}!`
      : `Complete ${tripsRemaining} more trips to reach ${nextTier.name}!`;

  return {
    currentTier,
    currentLevelName: currentTier.name,
    nextTier,
    progressPercent,
    tripsRemaining,
    isMaxLevel: false,
    nextLevelMessage,
    tripCount: safeTripCount,
  };
}

/**
 * Resolves the explorer level for a user.
 * 1. Checks explicit level set on user profile (e.g. Wanderer, Explorer, Adventurer, Globetrotter, Legend).
 * 2. Checks trip count if available.
 * 3. Checks subscription tier (Premium members are elevated to Adventurer).
 * 4. Defaults gracefully to Explorer (standard Free tier).
 */
export function getExplorerLevel(
  user?: User | null,
  isPremium?: boolean,
  tripCount?: number
): string {
  if (user?.level) {
    return user.level;
  }
  if ((user as any)?.explorerLevel) {
    return (user as any).explorerLevel;
  }
  if (typeof tripCount === 'number' && !isNaN(tripCount)) {
    const progress = calculateUserLevelProgress(tripCount, user, isPremium);
    return progress.currentLevelName;
  }
  if (user?.premium || isPremium) {
    return EXPLORER_LEVELS.ADVENTURER;
  }
  return EXPLORER_LEVELS.EXPLORER;
}

/**
 * Determines whether the user account is verified.
 * Checks explicit isVerified / verified flag on user object.
 * Defaults to true for the current client-side demo profile when no backend flag exists.
 */
export function getUserVerificationStatus(user?: User | null): boolean {
  if (!user) return true;
  if (typeof user.isVerified === 'boolean') {
    return user.isVerified;
  }
  if (typeof (user as any).verified === 'boolean') {
    return (user as any).verified;
  }
  return true;
}
