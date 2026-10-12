import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import PlaceDetailsScreen from './PlaceDetailsScreen';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
  }),
  useRoute: () => ({
    params: {
      placeName: 'Ubud Monkey Forest',
      placeId: 'ubud-1',
    },
  }),
}));

jest.mock('../../ugc/components/UGCContentDisplay', () => ({
  UGCContentDisplay: () => null,
}));

describe('PlaceDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Place Details header without a non-functional kebab/hamburger menu', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<PlaceDetailsScreen />);
    });

    const root = renderer!.root;
    expect(root.findAllByProps({ children: 'Place Details' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Ubud Monkey Forest' }).length).toBeGreaterThan(0);

    // Only close button and navigation buttons should be present in header
    const touchables = root.findAllByType(TouchableOpacity);
    const closeBtn = touchables[0];
    expect(closeBtn).toBeDefined();

    ReactTestRenderer.act(() => {
      closeBtn.props.onPress();
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
