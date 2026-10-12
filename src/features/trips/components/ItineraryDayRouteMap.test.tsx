import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { ItineraryDayRouteMap } from './ItineraryDayRouteMap';
import { TimelineItem } from '../types/itineraryPackingTypes';

describe('ItineraryDayRouteMap', () => {
  const mockOnSelectStop = jest.fn();
  const mockOnExpandMap = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const geocodedItems: TimelineItem[] = [
    {
      id: 'act-1',
      type: 'activity',
      time: '09:00 AM',
      title: 'Ubud Monkey Forest',
      subtitle: 'Padangtegal',
      latitude: -8.5188,
      longitude: 115.2584,
    },
    {
      id: 'act-2',
      type: 'activity',
      time: '12:00 PM',
      title: 'Ubud Traditional Art Market',
      subtitle: 'Center Ubud',
      latitude: -8.5065,
      longitude: 115.2625,
    },
  ];

  test('renders day route card with stop count and route summary', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ItineraryDayRouteMap
          dayNumber={1}
          dayLabel="Day 1"
          items={geocodedItems}
          onSelectStop={mockOnSelectStop}
          onExpandMap={mockOnExpandMap}
        />
      );
    });

    const root = renderer!.root;

    // Header title
    expect(root.findAllByProps({ children: 'Day 1 Route Map' }).length).toBeGreaterThan(0);

    // Stops summary contains planned stops
    const subtitle = root
      .findAllByType(Text)
      .filter(
        (node) =>
          typeof node.props.children === 'string' &&
          node.props.children.includes('2 planned stops')
      );
    expect(subtitle.length).toBeGreaterThan(0);

    // Expand map button
    const expandBtn = root.findByProps({ testID: 'expand-full-map-btn' });
    expect(expandBtn).toBeDefined();

    ReactTestRenderer.act(() => {
      expandBtn.props.onPress();
    });
    expect(mockOnExpandMap).toHaveBeenCalledTimes(1);
  });

  test('renders empty state when day has no geocoded activities', () => {
    const nonGeocoded: TimelineItem[] = [
      {
        id: 'act-relax',
        type: 'activity',
        time: '10:00 AM',
        title: 'Spa & Relaxation',
        subtitle: 'Resort grounds',
      },
    ];

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ItineraryDayRouteMap
          dayNumber={2}
          dayLabel="Day 2"
          items={nonGeocoded}
          onSelectStop={mockOnSelectStop}
          onExpandMap={mockOnExpandMap}
        />
      );
    });

    const root = renderer!.root;

    // Empty state message rendered
    expect(
      root.findAllByProps({
        children: 'No geocoded stops for Day 2',
      }).length
    ).toBeGreaterThan(0);
  });
});
