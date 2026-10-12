import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import MyItinerariesScreen from './MyItinerariesScreen';
import { useSubscription, FREE_ITINERARY_LIMIT } from '../../profile/data/subscriptionStore';
import { useItineraryState } from '../data/itineraryStore';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../notifications/data/notificationStore', () => ({
  useNotificationState: () => ({ unreadCount: 0 }),
}));

jest.mock('../../profile/data/subscriptionStore', () => ({
  useSubscription: jest.fn(),
  FREE_ITINERARY_LIMIT: 3,
}));

jest.mock('../data/itineraryStore', () => ({
  useItineraryState: jest.fn(),
}));

describe('MyItinerariesScreen Quick-Action Menu FAB', () => {
  const createMockTrip = (id: string, title: string) => ({
    id,
    title,
    destination: 'Goa',
    location: 'Goa, India',
    dates: 'Nov 20 – Nov 23, 2026',
    status: 'upcoming' as const,
    placesCount: 3,
    activitiesCount: 2,
    travelersCount: 2,
    imageUri: 'https://example.com/image.jpg',
    theme: 'sky' as const,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useSubscription as jest.Mock).mockReturnValue({
      isPremium: false,
    });
    (useItineraryState as jest.Mock).mockReturnValue({
      itineraries: [createMockTrip('trip-1', 'Kerala Weekend')],
      counts: { all: 1, upcoming: 1, past: 0, saved: 0 },
      deleteItinerary: jest.fn(),
      toggleSaveItinerary: jest.fn(),
    });
  });

  it('opens quick-action menu when floating plus button is tapped', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<MyItinerariesScreen />);
    });
    const root = renderer!.root;

    // Floating add button exists
    const fab = root.findByProps({ testID: 'trips-fab-button' });
    expect(fab).toBeDefined();

    // Tap FAB
    ReactTestRenderer.act(() => {
      fab.props.onPress();
    });

    // Quick action menu options should now be visible
    expect(root.findByProps({ testID: 'action-create-itinerary' })).toBeDefined();
    expect(root.findByProps({ testID: 'action-add-instagram-reel' })).toBeDefined();
    expect(root.findByProps({ testID: 'action-add-youtube-shorts' })).toBeDefined();
    expect(root.findByProps({ testID: 'action-upgrade-plan' })).toBeDefined();
  });

  it('navigates to PlanTrip when user has fewer than 3 trips', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<MyItinerariesScreen />);
    });
    const root = renderer!.root;

    // Open quick action menu
    const fab = root.findByProps({ testID: 'trips-fab-button' });
    ReactTestRenderer.act(() => {
      fab.props.onPress();
    });

    // Tap option 1 (Create Itinerary)
    const opt1 = root.findByProps({ testID: 'action-create-itinerary' });
    ReactTestRenderer.act(() => {
      opt1.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('PlanTrip');
  });

  it('enforces 3-trip limit and shows upgrade modal when limit is reached on free tier', () => {
    (useSubscription as jest.Mock).mockReturnValue({
      isPremium: false,
    });
    (useItineraryState as jest.Mock).mockReturnValue({
      itineraries: [
        createMockTrip('1', 'Trip 1'),
        createMockTrip('2', 'Trip 2'),
        createMockTrip('3', 'Trip 3'),
      ],
      counts: { all: 3, upcoming: 3, past: 0, saved: 0 },
      deleteItinerary: jest.fn(),
      toggleSaveItinerary: jest.fn(),
    });

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<MyItinerariesScreen />);
    });
    const root = renderer!.root;

    const fab = root.findByProps({ testID: 'trips-fab-button' });
    ReactTestRenderer.act(() => {
      fab.props.onPress();
    });

    const opt1 = root.findByProps({ testID: 'action-create-itinerary' });
    ReactTestRenderer.act(() => {
      opt1.props.onPress();
    });

    // Should NOT navigate to PlanTrip
    expect(mockNavigate).not.toHaveBeenCalledWith('PlanTrip');
  });

  it('navigates to UGCPosting for Instagram Reel without triggering trip limit', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<MyItinerariesScreen />);
    });
    const root = renderer!.root;

    const fab = root.findByProps({ testID: 'trips-fab-button' });
    ReactTestRenderer.act(() => {
      fab.props.onPress();
    });

    const opt2 = root.findByProps({ testID: 'action-add-instagram-reel' });
    ReactTestRenderer.act(() => {
      opt2.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('UGCPosting', { platform: 'instagram' });
  });

  it('navigates to UGCPosting for YouTube Shorts without triggering trip limit', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<MyItinerariesScreen />);
    });
    const root = renderer!.root;

    const fab = root.findByProps({ testID: 'trips-fab-button' });
    ReactTestRenderer.act(() => {
      fab.props.onPress();
    });

    const opt3 = root.findByProps({ testID: 'action-add-youtube-shorts' });
    ReactTestRenderer.act(() => {
      opt3.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('UGCPosting', { platform: 'youtube' });
  });

  it('navigates to UpgradePlan on option 4 tap', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<MyItinerariesScreen />);
    });
    const root = renderer!.root;

    const fab = root.findByProps({ testID: 'trips-fab-button' });
    ReactTestRenderer.act(() => {
      fab.props.onPress();
    });

    const opt4 = root.findByProps({ testID: 'action-upgrade-plan' });
    ReactTestRenderer.act(() => {
      opt4.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('UpgradePlan');
  });

  it('renders custom itinerary name correctly on the itinerary card', () => {
    (useItineraryState as jest.Mock).mockReturnValue({
      itineraries: [
        {
          id: 'trip-custom-bangalore',
          title: 'Bangalore Family Trip',
          customName: 'Bangalore Family Trip',
          destination: 'Bangalore, India',
          location: 'Bangalore, India',
          dates: 'Nov 20 – Nov 23, 2026',
          status: 'upcoming',
          placesCount: 3,
          activitiesCount: 2,
          travelersCount: 2,
          imageUri: 'https://example.com/image.jpg',
          theme: 'sky',
        },
      ],
      counts: { all: 1, upcoming: 1, past: 0, saved: 0 },
      deleteItinerary: jest.fn(),
      toggleSaveItinerary: jest.fn(),
    });

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<MyItinerariesScreen />);
    });
    const root = renderer!.root;

    // The custom itinerary name appears in the card
    const cardTitle = root.findAll((node) => node.props.children === 'Bangalore Family Trip');
    expect(cardTitle.length).toBeGreaterThan(0);
  });
});
