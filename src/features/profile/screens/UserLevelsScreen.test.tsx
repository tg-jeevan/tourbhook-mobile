import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import UserLevelsScreen from './UserLevelsScreen';
import { useAuth } from '../../../core/auth/AuthContext';
import { useSubscription } from '../data/subscriptionStore';
import { useItineraryState } from '../../trips/data/itineraryStore';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock('../../../core/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../data/subscriptionStore', () => ({
  useSubscription: jest.fn(),
}));

jest.mock('../../trips/data/itineraryStore', () => ({
  useItineraryState: jest.fn(),
}));

describe('UserLevelsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: { name: 'Test User' },
    });
    (useSubscription as jest.Mock).mockReturnValue({
      isPremium: false,
    });
    (useItineraryState as jest.Mock).mockReturnValue({
      itineraries: [
        { id: '1', title: 'Trip 1' },
        { id: '2', title: 'Trip 2' },
        { id: '3', title: 'Trip 3' },
      ],
    });
  });

  it('renders correctly with calculated Explorer tier for 3 trips', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UserLevelsScreen />);
    });
    const root = renderer!.root;

    // Header title
    const headerTitle = root.findAllByProps({ children: 'User Levels' });
    expect(headerTitle.length).toBeGreaterThan(0);

    // Current Level card heading and dynamic level
    const currentLevelName = root.findByProps({ testID: 'current-level-name' });
    expect(currentLevelName.props.children).toBe('Explorer');

    // Progress percentage
    const progressPercent = root.findByProps({ testID: 'progress-percent' });
    expect(progressPercent.props.children).toBe('0%');

    // Next level message
    const nextLevelMsg = root.findByProps({ testID: 'next-level-message' });
    expect(nextLevelMsg.props.children).toBe(
      'Complete 5 more trips to reach Adventurer!'
    );

    // All Levels heading
    const allLevelsHeading = root.findAllByProps({ children: 'All Levels' });
    expect(allLevelsHeading.length).toBeGreaterThan(0);

    // All 5 tiers are displayed
    expect(root.findAllByProps({ children: 'Wanderer' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Explorer' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Adventurer' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Globetrotter' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Legend' }).length).toBeGreaterThan(0);

    // CURRENT badge
    const currentBadge = root.findByProps({ testID: 'current-badge' });
    expect(currentBadge).toBeDefined();
  });

  it('renders Wanderer at 0% when user has 0 trips', () => {
    (useItineraryState as jest.Mock).mockReturnValue({
      itineraries: [],
    });

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UserLevelsScreen />);
    });
    const root = renderer!.root;

    const currentLevelName = root.findByProps({ testID: 'current-level-name' });
    expect(currentLevelName.props.children).toBe('Wanderer');

    const progressPercent = root.findByProps({ testID: 'progress-percent' });
    expect(progressPercent.props.children).toBe('0%');

    const nextLevelMsg = root.findByProps({ testID: 'next-level-message' });
    expect(nextLevelMsg.props.children).toBe(
      'Complete 3 more trips to reach Explorer!'
    );
  });

  it('triggers navigation.goBack on back and close button taps', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UserLevelsScreen />);
    });
    const root = renderer!.root;

    const backButton = root.findByProps({ testID: 'back-button' });
    ReactTestRenderer.act(() => {
      backButton.props.onPress();
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);

    const closeButton = root.findByProps({ testID: 'close-button' });
    ReactTestRenderer.act(() => {
      closeButton.props.onPress();
    });
    expect(mockGoBack).toHaveBeenCalledTimes(2);
  });
});
