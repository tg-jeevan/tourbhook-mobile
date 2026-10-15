import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { BottomNavBar } from './BottomNavBar';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 24, left: 0, right: 0 }),
}));

describe('BottomNavBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all four tabs evenly with equal flex: 1 distribution', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      renderer = ReactTestRenderer.create(<BottomNavBar active="explore" />);
    });

    const root = renderer.root;
    const tabKeys = ['explore', 'trips', 'groups', 'profile'];
    const tabs = tabKeys.map(key => root.findByProps({ testID: `tab-${key}` }));

    expect(tabs.length).toBe(4);

    // Verify all 4 tabs have equal width via flex: 1
    tabs.forEach(tab => {
      expect(tab.props.style).toEqual(
        expect.objectContaining({
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        })
      );
    });

    // Check tab labels
    expect(root.findByProps({ children: 'Explore' })).toBeTruthy();
    expect(root.findByProps({ children: 'My Trips' })).toBeTruthy();
    expect(root.findByProps({ children: 'Groups' })).toBeTruthy();
    expect(root.findByProps({ children: 'Profile' })).toBeTruthy();
  });

  it('aligns icons and labels on consistent baselines across active and inactive tabs', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      renderer = ReactTestRenderer.create(<BottomNavBar active="explore" />);
    });

    const root = renderer.root;
    const tabKeys = ['explore', 'trips', 'groups', 'profile'];
    const tabs = tabKeys.map(key => root.findByProps({ testID: `tab-${key}` }));

    // Active tab (Explore)
    expect(tabs[0].props.accessibilityState).toEqual({ selected: true });
    // Inactive tabs
    expect(tabs[1].props.accessibilityState).toEqual({ selected: false });

    // All tabs must have an icon container with width: 32, height: 32, marginBottom: 3
    tabKeys.forEach(key => {
      const iconContainer = root.findByProps({ testID: `icon-container-${key}` });
      expect(iconContainer.props.style).toEqual(
        expect.objectContaining({
          width: 32,
          height: 32,
          marginBottom: 3,
        })
      );
    });
  });

  it('navigates to the corresponding screen on tab press', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      renderer = ReactTestRenderer.create(<BottomNavBar active="explore" />);
    });

    const root = renderer.root;

    // Press My Trips
    act(() => {
      root.findByProps({ testID: 'tab-trips' }).props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('MyItineraries');

    // Press Groups
    act(() => {
      root.findByProps({ testID: 'tab-groups' }).props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('GroupMatching');

    // Press Profile
    act(() => {
      root.findByProps({ testID: 'tab-profile' }).props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('ProfileMenu');

    // Press Explore
    act(() => {
      root.findByProps({ testID: 'tab-explore' }).props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('ExploreFeed');
  });

  it('respects safe-area insets at the bottom', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      renderer = ReactTestRenderer.create(<BottomNavBar active="explore" />);
    });

    const container = renderer.root.findByProps({ testID: 'bottom-nav-bar' });
    expect(container).toBeTruthy();
    expect(container.props.style).toContainEqual({ paddingBottom: 24 });
  });
});
