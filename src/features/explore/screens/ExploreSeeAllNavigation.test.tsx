import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import ExploreFeedScreen from './ExploreFeedScreen';
import AllDestinationsScreen from './AllDestinationsScreen';
import ReelViewerScreen from './ReelViewerScreen';
import GroupMatchingScreen from '../../groups/screens/GroupMatchingScreen';
import { MOCK_DESTINATIONS, searchExploreContent } from '../data/mockExploreData';
import { MOCK_UGC_ITEMS } from '../../ugc/data/mockUGCData';
import { getMockTravelGroups } from '../../groups/types/groupTypes';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../../core/auth/AuthContext', () => ({
  useAuth: () => ({ user: { isVerified: false } }),
}));

jest.mock('../../profile/data/subscriptionStore', () => ({
  useSubscription: () => ({ plan: 'free', isPremium: false }),
}));

describe('Explore Section See All Navigation and Collection Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('1. ExploreFeedScreen See All and Card Navigation', () => {
    it('Travel Reels See All navigates to the complete reels collection', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<ExploreFeedScreen />);
      });

      const seeAllReels = renderer!.root.findByProps({ testID: 'see-all-travel-reels' });
      expect(seeAllReels).toBeTruthy();

      act(() => {
        seeAllReels.props.onPress();
      });

      expect(mockNavigate).toHaveBeenCalledWith('ExploreCollection', {
        contentType: 'reels',
      });
    });

    it('Popular Destinations See All navigates to AllDestinations', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<ExploreFeedScreen />);
      });

      const seeAllDestinations = renderer!.root.findByProps({
        testID: 'see-all-popular-destinations',
      });
      expect(seeAllDestinations).toBeTruthy();

      act(() => {
        seeAllDestinations.props.onPress();
      });

      expect(mockNavigate).toHaveBeenCalledWith('AllDestinations');
    });

    it('Suggested Travel Groups See All navigates to existing GroupMatching screen', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<ExploreFeedScreen />);
      });

      const seeAllGroups = renderer!.root.findByProps({
        testID: 'see-all-suggested-groups',
      });
      expect(seeAllGroups).toBeTruthy();

      act(() => {
        seeAllGroups.props.onPress();
      });

      expect(mockNavigate).toHaveBeenCalledWith('GroupMatching');
    });

    it('Destination card navigates to DestinationDetails with destination ID and formatted name', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<ExploreFeedScreen />);
      });

      const firstDest = MOCK_DESTINATIONS[0];
      const destCard = renderer!.root.findByProps({
        testID: `destination-card-${firstDest.id}`,
      });
      expect(destCard).toBeTruthy();

      act(() => {
        destCard.props.onPress();
      });

      expect(mockNavigate).toHaveBeenCalledWith('DestinationDetails', {
        destinationId: firstDest.id,
        destinationName: `${firstDest.name}, ${firstDest.country}`,
      });
    });

    it('Group card navigates to GroupDetails with group ID', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<ExploreFeedScreen />);
      });

      const groupCards = renderer!.root.findAll(
        (node) =>
          typeof node.props.testID === 'string' &&
          node.props.testID.startsWith('group-card-')
      );

      expect(groupCards.length).toBeGreaterThan(0);

      act(() => {
        groupCards[0].props.onPress();
      });

      expect(mockNavigate).toHaveBeenCalledWith('GroupDetails', {
        groupId: expect.any(String),
      });
    });

    it('Suggested Travel Groups preview displays at most 5 groups while data has more', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<ExploreFeedScreen />);
      });

      const uniquePreviewGroupIds = new Set(
        renderer!.root
          .findAll(
            (node) =>
              typeof node.props.testID === 'string' &&
              node.props.testID.startsWith('group-card-')
          )
          .map((n) => n.props.testID)
      );

      const totalPublicGroups = getMockTravelGroups().filter(
        group => group.visibility !== 'private',
      );
      expect(totalPublicGroups.length).toBeGreaterThan(5);
      expect(uniquePreviewGroupIds.size).toBe(5);
    });

    it('does not expose private groups through Explore search', () => {
      const results = searchExploreContent('Rome Antiquities');

      expect(
        results.some(result => result.type === 'group' && result.id === 'group-12'),
      ).toBe(false);
    });
  });

  describe('2. AllDestinationsScreen', () => {
    it('renders all destinations from the data source with name, location, and rating', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<AllDestinationsScreen />);
      });

      const uniqueDestIds = new Set(
        renderer!.root
          .findAll(
            (node) =>
              typeof node.props.testID === 'string' &&
              node.props.testID.startsWith('destination-item-')
          )
          .map((n) => n.props.testID)
      );

      expect(uniqueDestIds.size).toBe(MOCK_DESTINATIONS.length);
    });

    it('tapping a destination navigates to DestinationDetails preserving ID and metadata', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<AllDestinationsScreen />);
      });

      const dest = MOCK_DESTINATIONS[0];
      const destItem = renderer!.root.findByProps({
        testID: `destination-item-${dest.id}`,
      });

      act(() => {
        destItem.props.onPress();
      });

      expect(mockNavigate).toHaveBeenCalledWith('DestinationDetails', {
        destinationId: dest.id,
        destinationName: `${dest.name}, ${dest.country}`,
        country: dest.country,
      });
    });

    it('filters destinations using category chips', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<AllDestinationsScreen />);
      });

      const beachChip = renderer!.root.findByProps({ testID: 'category-chip-beach' });
      act(() => {
        beachChip.props.onPress();
      });

      const uniqueBeachIds = new Set(
        renderer!.root
          .findAll(
            (node) =>
              typeof node.props.testID === 'string' &&
              node.props.testID.startsWith('destination-item-')
          )
          .map((n) => n.props.testID)
      );

      const expectedBeachCount = MOCK_DESTINATIONS.filter(
        (d) => d.category.toLowerCase() === 'beach'
      ).length;
      expect(uniqueBeachIds.size).toBe(expectedBeachCount);
    });

    it('filters destinations using search field and handles empty state', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<AllDestinationsScreen />);
      });

      const searchInput = renderer!.root.findByProps({
        testID: 'all-destinations-search-input',
      });

      // Search for Tokyo
      act(() => {
        searchInput.props.onChangeText('Tokyo');
      });

      const uniqueTokyoIds = new Set(
        renderer!.root
          .findAll(
            (node) =>
              typeof node.props.testID === 'string' &&
              node.props.testID.startsWith('destination-item-')
          )
          .map((n) => n.props.testID)
      );

      expect(uniqueTokyoIds.size).toBe(1);

      // Search for non-existent destination
      act(() => {
        searchInput.props.onChangeText('NonExistentCityXYZ');
      });

      const emptyState = renderer!.root.findByProps({
        testID: 'all-destinations-empty-state',
      });
      expect(emptyState).toBeTruthy();
    });
  });

  describe('3. ReelViewerScreen', () => {
    it('displays only approved reels and excludes pending or rejected UGC', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<ReelViewerScreen />);
      });

      const feed = renderer!.root.findByProps({ testID: 'approved-reels-feed' });
      const data: any[] = feed.props.data;

      expect(data.length).toBeGreaterThan(0);

      // Ensure every item in data is approved
      data.forEach((item) => {
        expect(item.status).toBe('approved');
      });

      // Explicitly verify known pending and rejected IDs are NOT in data
      const pendingAndRejectedIds = MOCK_UGC_ITEMS.filter(
        (item) => item.status === 'pending' || item.status === 'rejected'
      ).map((item) => item.id);

      pendingAndRejectedIds.forEach((badId) => {
        const found = data.some((item) => item.id === badId);
        expect(found).toBe(false);
      });
    });

    it('filters reels by Instagram and YouTube platforms', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<ReelViewerScreen />);
      });

      // Filter to Instagram
      const igFilter = renderer!.root.findByProps({ testID: 'filter-reels-instagram' });
      act(() => {
        igFilter.props.onPress();
      });

      let feed = renderer!.root.findByProps({ testID: 'approved-reels-feed' });
      feed.props.data.forEach((item: any) => {
        expect(item.platform).toBe('instagram');
        expect(item.status).toBe('approved');
      });

      // Filter to YouTube
      const ytFilter = renderer!.root.findByProps({ testID: 'filter-reels-youtube' });
      act(() => {
        ytFilter.props.onPress();
      });

      feed = renderer!.root.findByProps({ testID: 'approved-reels-feed' });
      feed.props.data.forEach((item: any) => {
        expect(item.platform).toBe('youtube');
        expect(item.status).toBe('approved');
      });
    });

    it('supports vertically swipeable reels feed with paging', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<ReelViewerScreen />);
      });

      const feed = renderer!.root.findByProps({ testID: 'approved-reels-feed' });
      expect(feed.props.pagingEnabled).toBe(true);
      expect(feed.props.snapToAlignment).toBe('start');
      expect(feed.props.decelerationRate).toBe('fast');
      expect(feed.props.data.length).toBeGreaterThan(1);
    });

    it('back button navigates back to Explore', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<ReelViewerScreen />);
      });

      const backBtn = renderer!.root.findByProps({ testID: 'reel-viewer-back-btn' });
      act(() => {
        backBtn.props.onPress();
      });

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('4. GroupMatchingScreen (Complete Groups Screen)', () => {
    it('renders full public groups without the 5-item preview restriction and supports pagination', () => {
      let renderer: ReactTestRenderer.ReactTestRenderer;
      act(() => {
        renderer = ReactTestRenderer.create(<GroupMatchingScreen />);
      });

      // Advance timers by 500ms for useGroupMatches load timer (400ms)
      act(() => {
        jest.advanceTimersByTime(500);
      });

      const totalPublicGroups = getMockTravelGroups().filter(
        group => group.visibility !== 'private',
      );
      expect(totalPublicGroups.length).toBeGreaterThan(5);

      const matchingCards = renderer!.root.findAll(
        (node) =>
          typeof node.props.testID === 'string' &&
          node.props.testID.startsWith('matching-group-card-')
      );
      expect(matchingCards.length).toBeGreaterThan(0);

      // Verify load more button exists when total groups exceed initial page size
      let loadMoreBtns = renderer!.root.findAll(
        (node) => node.props.testID === 'load-more-groups-btn'
      );
      expect(loadMoreBtns.length).toBeGreaterThan(0);

      // Trigger pagination until all public groups are displayed
      while (loadMoreBtns.length > 0) {
        act(() => {
          loadMoreBtns[0].props.onPress();
        });
        loadMoreBtns = renderer!.root.findAll(
          (node) => node.props.testID === 'load-more-groups-btn'
        );
      }

      const updatedUniqueCards = new Set(
        renderer!.root
          .findAll(
            (node) =>
              typeof node.props.testID === 'string' &&
              node.props.testID.startsWith('matching-group-card-')
          )
          .map((n) => n.props.testID)
      );
      // All groups are accessible on the full screen
      expect(updatedUniqueCards.size).toBe(totalPublicGroups.length);
    });
  });
});
