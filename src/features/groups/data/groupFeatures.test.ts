import { groupStore } from './groupStore';
import { CATEGORY_FILTERS, TravelGroup } from '../types/groupTypes';

describe('Group Feature: Creation, Search, Pagination & Sharing', () => {
  beforeEach(() => {
    groupStore.reset();
  });

  describe('Create Group Functionality', () => {
    test('rejects creation when group name is empty or only whitespace', () => {
      expect(() => {
        groupStore.createGroup({ name: '' });
      }).toThrow('Group name is required');

      expect(() => {
        groupStore.createGroup({ name: '    ' });
      }).toThrow('Group name is required');
    });

    test('creates a new group, prepends to store, and automatically joins the creator', () => {
      const initialCount = groupStore.getGroups().length;

      const newGroup = groupStore.createGroup({
        name: 'Kyoto Sunrise Photographers',
        destination: 'Kyoto, Japan',
        description: 'Chasing the best morning light across Fushimi Inari and Arashiyama.',
        category: 'Culture',
        travelDates: '10 Nov – 18 Nov',
        maxMembers: 6,
      });

      expect(newGroup.id).toBeDefined();
      expect(newGroup.name).toBe('Kyoto Sunrise Photographers');
      expect(newGroup.location).toBe('Kyoto, Japan');
      expect(newGroup.categoryLabel).toBe('CULTURE');
      expect(newGroup.categories).toContain('culture');
      expect(newGroup.memberCount).toBe(1);
      expect(newGroup.maxMembers).toBe(6);

      // Verify creator is marked as joined
      expect(groupStore.isGroupJoined(newGroup.id)).toBe(true);

      // Verify group appears at the top of getGroups()
      const allGroups = groupStore.getGroups();
      expect(allGroups.length).toBe(initialCount + 1);
      expect(allGroups[0].id).toBe(newGroup.id);

      // Verify initial welcome message was posted
      const messages = groupStore.getGroupMessages(newGroup.id);
      expect(messages.length).toBe(1);
      expect(messages[0].type).toBe('system');
    });

    test('creator can leave and rejoin their created group', () => {
      const group = groupStore.createGroup({ name: 'Solo Backpacker Meet' });
      expect(groupStore.isGroupJoined(group.id)).toBe(true);

      groupStore.leaveGroup(group.id);
      expect(groupStore.isGroupJoined(group.id)).toBe(false);

      groupStore.joinGroup(group.id);
      expect(groupStore.isGroupJoined(group.id)).toBe(true);
    });

    test('supports creating a group with multiple selected categories', () => {
      const newGroup = groupStore.createGroup({
        name: 'Alpine Hikers & Photographers',
        destination: 'Zermatt, Switzerland',
        categories: ['Adventure', 'Hiking', 'Photography'],
        maxMembers: 8,
      });

      expect(newGroup.categories).toEqual(['adventure', 'hiking', 'photography']);
      expect(newGroup.tags).toContain('Adventure');
      expect(newGroup.tags).toContain('Hiking');
      expect(newGroup.tags).toContain('Photography');
      expect(newGroup.tags).toContain('Trip');
      expect(newGroup.categoryLabel).toBe('ADVENTURE');

      // Verify retrieval from store matches persisted categories
      const fetched = groupStore.getGroupById(newGroup.id);
      expect(fetched?.categories).toEqual(['adventure', 'hiking', 'photography']);
    });

    test('updates an existing group with modified categories and fields', () => {
      const group = groupStore.createGroup({
        name: 'Beach Walkers',
        destination: 'Goa',
        categories: ['Beach'],
      });

      // Update group: add Nature and Food, remove Beach
      const updated = groupStore.updateGroup(group.id, {
        name: 'Goa Food & Nature Explorers',
        categories: ['Food', 'Nature'],
      });

      expect(updated.name).toBe('Goa Food & Nature Explorers');
      expect(updated.categories).toEqual(['food', 'nature']);
      expect(updated.tags).toContain('Food');
      expect(updated.tags).toContain('Nature');
      expect(updated.tags).not.toContain('Beach');
      expect(updated.categoryLabel).toBe('FOOD');

      // Confirm persisted in store
      const persisted = groupStore.getGroupById(group.id);
      expect(persisted?.categories).toEqual(['food', 'nature']);
      expect(persisted?.name).toBe('Goa Food & Nature Explorers');
    });

    test('rejects update when categories array is empty', () => {
      const group = groupStore.createGroup({
        name: 'Road Trip Crew',
        categories: ['Road Trips'],
      });

      expect(() => {
        groupStore.updateGroup(group.id, { categories: [] });
      }).toThrow('At least one category is required');
    });

    test('rejects update for non-existent group', () => {
      expect(() => {
        groupStore.updateGroup('non-existent-group-999', { name: 'New Name' });
      }).toThrow('Group with id non-existent-group-999 not found');
    });
  });

  describe('Search & Category Filtering Interaction', () => {
    const filterGroups = (
      groups: TravelGroup[],
      category: string,
      searchQuery: string
    ) => {
      let result = groups;

      if (category !== 'All') {
        const catLower = category.toLowerCase();
        result = result.filter(
          (g) =>
            g.categories.includes(catLower) ||
            g.categoryLabel?.toLowerCase() === catLower ||
            g.tags.some((t) => t.toLowerCase() === catLower)
        );
      }

      const query = searchQuery.trim().toLowerCase();
      if (query) {
        result = result.filter((g) => {
          const matchName = g.name.toLowerCase().includes(query);
          const matchDesc = g.description ? g.description.toLowerCase().includes(query) : false;
          const matchLocation = g.location ? g.location.toLowerCase().includes(query) : false;
          const matchTags = g.tags.some((t) => t.toLowerCase().includes(query));
          const matchCategories = g.categories.some((c) => c.toLowerCase().includes(query));
          const matchCategoryLabel = g.categoryLabel ? g.categoryLabel.toLowerCase().includes(query) : false;

          return (
            matchName ||
            matchDesc ||
            matchLocation ||
            matchTags ||
            matchCategories ||
            matchCategoryLabel
          );
        });
      }

      return result;
    };

    test('searches groups by name case-insensitively', () => {
      const all = groupStore.getGroups();
      const results = filterGroups(all, 'All', 'bali');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].name).toContain('Bali');
    });

    test('searches groups by destination/location', () => {
      const all = groupStore.getGroups();
      const results = filterGroups(all, 'All', 'switzerland');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].location).toContain('Switzerland');
    });

    test('searches groups by interest tags or description', () => {
      const all = groupStore.getGroups();
      const results = filterGroups(all, 'All', 'tapas');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].name).toContain('Barcelona');
    });

    test('combines category filtering with search query correctly', () => {
      const all = groupStore.getGroups();

      // Search 'hik' under 'Adventure' -> matches Swiss Alps / Peru
      const adventureHikers = filterGroups(all, 'Adventure', 'hik');
      expect(adventureHikers.length).toBeGreaterThan(0);
      expect(adventureHikers.every((g) => g.categories.includes('adventure'))).toBe(true);

      // Search 'hik' under 'Food' -> should yield 0 matches
      const foodHikers = filterGroups(all, 'Food', 'hik');
      expect(foodHikers.length).toBe(0);
    });

    test('returns empty array when search query matches nothing', () => {
      const all = groupStore.getGroups();
      const results = filterGroups(all, 'All', 'xyz123nonexistentgroup');
      expect(results.length).toBe(0);
    });
  });

  describe('Pagination & Load More Logic', () => {
    test('pages groups into chunks without duplicates', () => {
      const all = groupStore.getGroups();
      const PAGE_SIZE = 4;

      const page1 = all.slice(0, 1 * PAGE_SIZE);
      expect(page1.length).toBe(4);

      const page2 = all.slice(0, 2 * PAGE_SIZE);
      expect(page2.length).toBe(8);

      // Ensure no duplicate IDs in page2
      const ids = page2.map((g) => g.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(page2.length);

      // Verify that page 1 is a direct prefix of page 2
      expect(page2.slice(0, 4)).toEqual(page1);
    });

    test('detects when all groups have been loaded', () => {
      const all = groupStore.getGroups();
      const PAGE_SIZE = 4;
      const totalPages = Math.ceil(all.length / PAGE_SIZE);

      const allLoaded = all.slice(0, totalPages * PAGE_SIZE);
      expect(allLoaded.length).toBe(all.length);
    });
  });

  describe('Group Sharing Formatter', () => {
    test('builds informative share message without fake public links', () => {
      const group = groupStore.getGroupById('group-paris')!;
      const destText = group.location ? `\n📍 Destination: ${group.location}` : '';
      const datesText = group.travelDates ? `\n📅 Dates: ${group.travelDates}` : '';
      const message = `Check out this travel group on Tourbhook!\n\n👥 ${group.name}\n${group.description || 'Join fellow travelers exploring together.'}${destText}${datesText}\n\nDownload the Tour Bhook app to connect and travel together.`;

      expect(message).toContain('Paris Explorers');
      expect(message).toContain('📍 Destination: Paris, France');
      expect(message).toContain('12 Oct – 18 Oct');
      expect(message).toContain('Download the Tour Bhook app');
      // Must not contain fake web URLs
      expect(message).not.toContain('http://');
      expect(message).not.toContain('https://');
    });
  });
});
