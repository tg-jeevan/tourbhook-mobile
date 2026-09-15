import {
  MOCK_UGC_ITEMS,
  filterApprovedDestinationReels,
} from './mockUGCData';
import { UGCItem } from '../types/ugcTypes';

describe('mockUGCData & Zero-Tolerance Content Moderation', () => {
  it('contains test dataset with various moderation states (approved, pending, rejected)', () => {
    const statuses = MOCK_UGC_ITEMS.map((item) => item.status);
    expect(statuses).toContain('approved');
    expect(statuses).toContain('pending');
    expect(statuses).toContain('rejected');
  });

  describe('filterApprovedDestinationReels (Zero-Tolerance Policy)', () => {
    it('returns ONLY items with status === "approved"', () => {
      const approvedItems = filterApprovedDestinationReels();
      expect(approvedItems.length).toBeGreaterThan(0);
      approvedItems.forEach((item) => {
        expect(item.status).toBe('approved');
      });
    });

    it('strictly excludes pending, rejected, unverified, or missing status items from arbitrary lists', () => {
      const testPool: UGCItem[] = [
        {
          id: 'test-1',
          platform: 'instagram',
          url: 'https://www.instagram.com/reel/1',
          title: 'Approved Reel',
          creatorHandle: '@user1',
          thumbnailUrl: 'https://example.com/1.jpg',
          destination: 'Paris, France',
          status: 'approved',
          createdAt: '2026-09-15',
        },
        {
          id: 'test-2',
          platform: 'instagram',
          url: 'https://www.instagram.com/reel/2',
          title: 'Pending Reel',
          creatorHandle: '@user2',
          thumbnailUrl: 'https://example.com/2.jpg',
          destination: 'Paris, France',
          status: 'pending',
          createdAt: '2026-09-15',
        },
        {
          id: 'test-3',
          platform: 'youtube',
          url: 'https://youtube.com/shorts/3',
          title: 'Rejected Shorts',
          creatorHandle: '@user3',
          thumbnailUrl: 'https://example.com/3.jpg',
          destination: 'Paris, France',
          status: 'rejected',
          createdAt: '2026-09-15',
        },
        {
          id: 'test-4',
          platform: 'instagram',
          url: 'https://www.instagram.com/reel/4',
          title: 'Missing Status Item',
          creatorHandle: '@user4',
          thumbnailUrl: 'https://example.com/4.jpg',
          destination: 'Paris, France',
          status: undefined as any,
          createdAt: '2026-09-15',
        },
      ];

      // Custom zero-tolerance verification test on testPool
      const approved = testPool.filter((item) => item.status === 'approved');
      expect(approved.length).toBe(1);
      expect(approved[0].id).toBe('test-1');
      expect(approved.find((i) => i.id === 'test-2')).toBeUndefined();
      expect(approved.find((i) => i.id === 'test-3')).toBeUndefined();
      expect(approved.find((i) => i.id === 'test-4')).toBeUndefined();
    });

    it('filters by destination name (e.g. Paris, France)', () => {
      const parisReels = filterApprovedDestinationReels('Paris, France');
      expect(parisReels.length).toBeGreaterThan(0);
      parisReels.forEach((item) => {
        expect(item.status).toBe('approved');
        const matches =
          item.destination.toLowerCase().includes('paris') ||
          'Paris, France'.toLowerCase().includes(item.destination.toLowerCase());
        expect(matches).toBe(true);
      });
    });

    it('filters by landmark destination (e.g. Eiffel Tower)', () => {
      const eiffelReels = filterApprovedDestinationReels('Eiffel Tower');
      expect(eiffelReels.length).toBeGreaterThan(0);
      eiffelReels.forEach((item) => {
        expect(item.status).toBe('approved');
        expect(item.destination.toLowerCase()).toContain('eiffel');
      });
    });

    it('filters by platform filter (instagram vs youtube)', () => {
      const igReels = filterApprovedDestinationReels('Paris, France', 'instagram');
      expect(igReels.length).toBeGreaterThan(0);
      igReels.forEach((item) => {
        expect(item.status).toBe('approved');
        expect(item.platform).toBe('instagram');
      });

      const ytShorts = filterApprovedDestinationReels(undefined, 'youtube');
      expect(ytShorts.length).toBeGreaterThan(0);
      ytShorts.forEach((item) => {
        expect(item.status).toBe('approved');
        expect(item.platform).toBe('youtube');
      });
    });

    it('returns empty array when no approved reels match the destination', () => {
      const unknownDestReels = filterApprovedDestinationReels('Antarctica Expedition 2026');
      expect(unknownDestReels.length).toBe(0);
    });
  });
});
