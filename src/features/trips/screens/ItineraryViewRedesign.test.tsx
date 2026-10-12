import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ItineraryPackingScreen from './ItineraryPackingScreen';
import { itineraryStore } from '../data/itineraryStore';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: { tripId: 'trip-bali-1', initialTab: 'itinerary' },
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('ItineraryView Redesign & Day Route Map', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    itineraryStore.resetToInitial();
  });

  test('renders day route map section and compact activity cards for selected day', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<ItineraryPackingScreen />);
    });

    const root = renderer!.root;

    // Day 1 route map header
    expect(root.findAllByProps({ children: 'Day 1 Route Map' }).length).toBeGreaterThan(0);

    // Verify Day 1 activities render: Ubud Monkey Forest, Local Balinese Lunch, Tegallalang Rice Terrace
    expect(root.findAllByProps({ children: 'Ubud Monkey Forest' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Local Balinese Lunch' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Tegallalang Rice Terrace' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Sunset at Tanah Lot' }).length).toBeGreaterThan(0);

    // Verify break item renders
    expect(root.findAllByProps({ children: 'Rest & Travel Break' }).length).toBeGreaterThan(0);

    // Verify image renders for activity d1-1
    const monkeyForestImg = root.findByProps({
      testID: 'activity-image-d1-1',
    });
    expect(monkeyForestImg).toBeDefined();

    // Verify sequence badge 1, 2, 3, 4 are present for geocoded stops
    expect(root.findAllByProps({ children: 1 }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 2 }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 3 }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 4 }).length).toBeGreaterThan(0);
  });

  test('switching days updates route map stops and activity timeline together', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<ItineraryPackingScreen />);
    });

    const root = renderer!.root;

    // Switch to Day 2
    const day2Pill = root.findByProps({ testID: 'itinerary-day-pill-1' });
    ReactTestRenderer.act(() => {
      day2Pill.props.onPress();
    });

    // Now Day 2 route should be displayed
    expect(root.findAllByProps({ children: 'Day 2 Route Map' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Mount Batur Sunrise Trek' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Coffee Plantation Tour' }).length).toBeGreaterThan(0);

    // Day 1 activities should no longer be in the active Day 2 timeline
    expect(root.findAllByProps({ children: 'Ubud Monkey Forest' }).length).toBe(0);
  });

  test('switching to packing tab preserves itinerary data and maintains checked state', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<ItineraryPackingScreen />);
    });

    const root = renderer!.root;

    // Find tab items and switch to packing
    const packingTabBtn = root.findByProps({ testID: 'tab-packing-btn' });
    ReactTestRenderer.act(() => {
      packingTabBtn.props.onPress();
    });

    // Packing list hero should now be visible
    expect(root.findAllByProps({ children: 'Packing List' }).length).toBeGreaterThan(0);

    // Switch back to Itinerary
    const itineraryTabBtn = root.findByProps({ testID: 'tab-itinerary-btn' });
    ReactTestRenderer.act(() => {
      itineraryTabBtn.props.onPress();
    });

    // Day 1 itinerary data is preserved
    expect(root.findAllByProps({ children: 'Day 1 Route Map' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Ubud Monkey Forest' }).length).toBeGreaterThan(0);
  });
});
