import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ItineraryTimelineItem } from './ItineraryTimelineItem';
import { TimelineItem } from '../types/itineraryPackingTypes';

describe('ItineraryTimelineItem (Redesigned Compact Activity Card)', () => {
  const mockOnPress = jest.fn();
  const mockOnMenuPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fullActivity: TimelineItem = {
    id: 'act-101',
    type: 'activity',
    time: '09:00 AM',
    title: 'Ubud Monkey Forest',
    subtitle: 'Explore the sacred sanctuary and ancient temple structures',
    imageUri: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    location: 'Padangtegal, Ubud',
    duration: '2.5 hrs',
    category: 'sightseeing',
    latitude: -8.5188,
    longitude: 115.2584,
  };

  test('renders full activity details including image, title, time, duration, and location', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ItineraryTimelineItem
          item={fullActivity}
          sequenceNumber={1}
          isSelected={false}
          isLast={false}
          onPress={mockOnPress}
          onMenuPress={mockOnMenuPress}
        />
      );
    });

    const root = renderer!.root;

    // Check time, title, subtitle, duration, location
    expect(root.findAllByProps({ children: '09:00 AM' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Ubud Monkey Forest' }).length).toBeGreaterThan(0);
    expect(
      root.findAllByProps({
        children: 'Explore the sacred sanctuary and ancient temple structures',
      }).length
    ).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '2.5 hrs' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Padangtegal, Ubud' }).length).toBeGreaterThan(0);

    // Sequence marker
    expect(root.findAllByProps({ children: 1 }).length).toBeGreaterThan(0);

    // Image rendered with correct source
    const image = root.findByProps({ testID: 'activity-image-act-101' });
    expect(image.props.source).toEqual({
      uri: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    });
  });

  test('renders category fallback illustration when image is missing or invalid', () => {
    const activityNoImage: TimelineItem = {
      id: 'act-102',
      type: 'activity',
      time: '12:30 PM',
      title: 'Local Balinese Lunch',
      subtitle: 'Try authentic Nasi Campur',
      category: 'food',
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ItineraryTimelineItem
          item={activityNoImage}
          sequenceNumber={2}
          isSelected={false}
          isLast={false}
          onPress={mockOnPress}
          onMenuPress={mockOnMenuPress}
        />
      );
    });

    const root = renderer!.root;

    // Verify title and time render
    expect(root.findAllByProps({ children: 'Local Balinese Lunch' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '12:30 PM' }).length).toBeGreaterThan(0);

    // Verify fallback placeholder is rendered instead of an Image
    const fallback = root.findByProps({ testID: 'activity-image-fallback-act-102' });
    expect(fallback).toBeDefined();

    // Verify category label
    expect(root.findAllByProps({ children: 'Dining' }).length).toBeGreaterThan(0);
  });

  test('renders break item in compact distinct style without oversized card space', () => {
    const breakItem: TimelineItem = {
      id: 'brk-1',
      type: 'break',
      time: '03:00 PM',
      title: 'Coffee Break & Rest',
      subtitle: 'Relax at local cafe before sunset',
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ItineraryTimelineItem
          item={breakItem}
          isSelected={false}
          isLast={false}
          onPress={mockOnPress}
          onMenuPress={mockOnMenuPress}
        />
      );
    });

    const root = renderer!.root;
    expect(root.findAllByProps({ children: 'Coffee Break & Rest' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '03:00 PM' }).length).toBeGreaterThan(0);
  });

  test('invokes onMenuPress when overflow menu icon is tapped', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ItineraryTimelineItem
          item={fullActivity}
          sequenceNumber={1}
          isSelected={false}
          isLast={false}
          onPress={mockOnPress}
          onMenuPress={mockOnMenuPress}
        />
      );
    });

    const root = renderer!.root;
    const menuBtn = root.findByProps({ testID: 'activity-menu-btn-act-101' });
    ReactTestRenderer.act(() => {
      menuBtn.props.onPress();
    });

    expect(mockOnMenuPress).toHaveBeenCalledTimes(1);
  });
});
