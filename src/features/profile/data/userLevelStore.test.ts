import {
  getExplorerLevel,
  getUserVerificationStatus,
  EXPLORER_LEVELS,
  USER_LEVEL_TIERS,
  calculateUserLevelProgress,
} from './userLevelStore';

describe('userLevelStore', () => {
  it('returns explicit user level when defined on user object', () => {
    expect(getExplorerLevel({ name: 'Alice', level: 'Wanderer' })).toBe(
      EXPLORER_LEVELS.WANDERER
    );
    expect(getExplorerLevel({ name: 'Bob', level: 'Explorer' })).toBe(
      EXPLORER_LEVELS.EXPLORER
    );
    expect(getExplorerLevel({ name: 'Charlie', level: 'Adventurer' })).toBe(
      EXPLORER_LEVELS.ADVENTURER
    );
    expect(
      getExplorerLevel({ name: 'Diana', level: 'Globetrotter (Level 3)' })
    ).toBe('Globetrotter (Level 3)');
  });

  it('supports explorerLevel alias when provided on user object', () => {
    const user = { name: 'Dan', explorerLevel: 'Adventurer' } as any;
    expect(getExplorerLevel(user)).toBe(EXPLORER_LEVELS.ADVENTURER);
  });

  it('elevates user to Adventurer if premium is active and level is not specified', () => {
    expect(getExplorerLevel({ name: 'Premium User', premium: true })).toBe(
      EXPLORER_LEVELS.ADVENTURER
    );
    expect(getExplorerLevel({ name: 'Subscriber User' }, true)).toBe(
      EXPLORER_LEVELS.ADVENTURER
    );
  });

  it('defaults to Explorer when no explicit level or premium flag exists', () => {
    expect(getExplorerLevel({ name: 'Free User' }, false)).toBe(
      EXPLORER_LEVELS.EXPLORER
    );
    expect(getExplorerLevel(null, false)).toBe(EXPLORER_LEVELS.EXPLORER);
    expect(getExplorerLevel(undefined, false)).toBe(EXPLORER_LEVELS.EXPLORER);
  });

  describe('getUserVerificationStatus', () => {
    it('returns true when user isVerified is explicitly true', () => {
      expect(getUserVerificationStatus({ name: 'Verified User', isVerified: true })).toBe(true);
    });

    it('returns false when user isVerified is explicitly false', () => {
      expect(getUserVerificationStatus({ name: 'Unverified User', isVerified: false })).toBe(false);
    });

    it('returns true when verified alias is true', () => {
      expect(getUserVerificationStatus({ name: 'Verified User', verified: true } as any)).toBe(true);
    });

    it('returns false when verified alias is false', () => {
      expect(getUserVerificationStatus({ name: 'Unverified User', verified: false } as any)).toBe(false);
    });

    it('defaults gracefully to true for demo profile when flag is omitted', () => {
      expect(getUserVerificationStatus({ name: 'Standard User' })).toBe(true);
      expect(getUserVerificationStatus(null)).toBe(true);
    });
  });

  describe('calculateUserLevelProgress and USER_LEVEL_TIERS', () => {
    it('defines the 5 standard explorer tiers with accurate trip thresholds', () => {
      expect(USER_LEVEL_TIERS).toHaveLength(5);
      expect(USER_LEVEL_TIERS.map((t) => t.name)).toEqual([
        'Wanderer',
        'Explorer',
        'Adventurer',
        'Globetrotter',
        'Legend',
      ]);
      expect(USER_LEVEL_TIERS[0].rangeLabel).toBe('0–2 trips');
      expect(USER_LEVEL_TIERS[1].rangeLabel).toBe('3–7 trips');
      expect(USER_LEVEL_TIERS[2].rangeLabel).toBe('8–15 trips');
      expect(USER_LEVEL_TIERS[3].rangeLabel).toBe('16–30 trips');
      expect(USER_LEVEL_TIERS[4].rangeLabel).toBe('31+ trips');
    });

    it('calculates 0% progress and next level requirement for 0 trips Wanderer', () => {
      const progress = calculateUserLevelProgress(0);
      expect(progress.currentTier.name).toBe('Wanderer');
      expect(progress.nextTier?.name).toBe('Explorer');
      expect(progress.progressPercent).toBe(0);
      expect(progress.tripsRemaining).toBe(3);
      expect(progress.nextLevelMessage).toBe('Complete 3 more trips to reach Explorer!');
      expect(progress.isMaxLevel).toBe(false);
    });

    it('calculates 33% progress for 1 trip Wanderer', () => {
      const progress = calculateUserLevelProgress(1);
      expect(progress.currentTier.name).toBe('Wanderer');
      expect(progress.progressPercent).toBe(33);
      expect(progress.tripsRemaining).toBe(2);
      expect(progress.nextLevelMessage).toBe('Complete 2 more trips to reach Explorer!');
    });

    it('calculates 67% progress for 2 trips Wanderer', () => {
      const progress = calculateUserLevelProgress(2);
      expect(progress.currentTier.name).toBe('Wanderer');
      expect(progress.progressPercent).toBe(67);
      expect(progress.tripsRemaining).toBe(1);
      expect(progress.nextLevelMessage).toBe('Complete 1 more trip to reach Explorer!');
    });

    it('calculates Explorer tier and 5 remaining trips for 3 trips', () => {
      const progress = calculateUserLevelProgress(3);
      expect(progress.currentTier.name).toBe('Explorer');
      expect(progress.nextTier?.name).toBe('Adventurer');
      expect(progress.progressPercent).toBe(0);
      expect(progress.tripsRemaining).toBe(5);
      expect(progress.nextLevelMessage).toBe('Complete 5 more trips to reach Adventurer!');
    });

    it('calculates 40% progress for 5 trips Explorer', () => {
      const progress = calculateUserLevelProgress(5);
      expect(progress.currentTier.name).toBe('Explorer');
      expect(progress.progressPercent).toBe(40);
      expect(progress.tripsRemaining).toBe(3);
      expect(progress.nextLevelMessage).toBe('Complete 3 more trips to reach Adventurer!');
    });

    it('calculates Adventurer tier for 8 to 15 trips', () => {
      const progress = calculateUserLevelProgress(8);
      expect(progress.currentTier.name).toBe('Adventurer');
      expect(progress.nextTier?.name).toBe('Globetrotter');
      expect(progress.tripsRemaining).toBe(8);
    });

    it('calculates Globetrotter tier for 16 to 30 trips', () => {
      const progress = calculateUserLevelProgress(20);
      expect(progress.currentTier.name).toBe('Globetrotter');
      expect(progress.nextTier?.name).toBe('Legend');
      expect(progress.tripsRemaining).toBe(11);
    });

    it('handles Legend max level completed state for 31+ trips', () => {
      const progress = calculateUserLevelProgress(35);
      expect(progress.currentTier.name).toBe('Legend');
      expect(progress.isMaxLevel).toBe(true);
      expect(progress.nextTier).toBeNull();
      expect(progress.progressPercent).toBe(100);
      expect(progress.tripsRemaining).toBe(0);
      expect(progress.nextLevelMessage).toBe(
        'Highest level achieved! You are a master explorer.'
      );
    });

    it('handles missing/undefined trip count gracefully without crashing', () => {
      const progress = calculateUserLevelProgress(undefined);
      expect(progress.currentTier.name).toBe('Wanderer');
      expect(progress.progressPercent).toBe(0);
      expect(progress.tripCount).toBe(0);
    });

    it('respects explicit level on user profile when provided', () => {
      const progress = calculateUserLevelProgress(0, { name: 'Alice', level: 'Adventurer' });
      expect(progress.currentTier.name).toBe('Adventurer');
      expect(progress.nextTier?.name).toBe('Globetrotter');
    });
  });
});
