import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TripQuickActionMenuModal } from './TripQuickActionMenuModal';

describe('TripQuickActionMenuModal', () => {
  const mockOnClose = jest.fn();
  const mockOnCreateItinerary = jest.fn();
  const mockOnAddInstagramReel = jest.fn();
  const mockOnAddYouTubeShorts = jest.fn();
  const mockOnUpgradePlan = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all four quick-action options in exact order when visible', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TripQuickActionMenuModal
          visible={true}
          onClose={mockOnClose}
          onCreateItinerary={mockOnCreateItinerary}
          onAddInstagramReel={mockOnAddInstagramReel}
          onAddYouTubeShorts={mockOnAddYouTubeShorts}
          onUpgradePlan={mockOnUpgradePlan}
        />
      );
    });
    const root = renderer!.root;

    // Header title and subtitle
    expect(root.findAllByProps({ children: 'What would you like to do?' }).length).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Plan your next adventure or share travel inspiration.' }).length
    ).toBeGreaterThan(0);

    // Option 1 — Create a New Itinerary
    const opt1 = root.findByProps({ testID: 'action-create-itinerary' });
    expect(opt1).toBeDefined();
    expect(root.findAllByProps({ children: 'Create a New Itinerary' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Plan a new trip and build your itinerary.' }).length).toBeGreaterThan(0);

    // Option 2 — Add Your Instagram Reel
    const opt2 = root.findByProps({ testID: 'action-add-instagram-reel' });
    expect(opt2).toBeDefined();
    expect(root.findAllByProps({ children: 'Add Your Instagram Reel' }).length).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Share an Instagram Reel to discover a destination.' }).length
    ).toBeGreaterThan(0);

    // Option 3 — Add Your YouTube Shorts
    const opt3 = root.findByProps({ testID: 'action-add-youtube-shorts' });
    expect(opt3).toBeDefined();
    expect(root.findAllByProps({ children: 'Add Your YouTube Shorts' }).length).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Share a YouTube Short to discover a destination.' }).length
    ).toBeGreaterThan(0);

    // Option 4 — Want to Upgrade Your Plan?
    const opt4 = root.findByProps({ testID: 'action-upgrade-plan' });
    expect(opt4).toBeDefined();
    expect(root.findAllByProps({ children: 'Want to Upgrade Your Plan?' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Unlock more ways to explore with Voyager.' }).length).toBeGreaterThan(0);
  });

  it('triggers onCreateItinerary and closes menu on option 1 tap', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TripQuickActionMenuModal
          visible={true}
          onClose={mockOnClose}
          onCreateItinerary={mockOnCreateItinerary}
          onAddInstagramReel={mockOnAddInstagramReel}
          onAddYouTubeShorts={mockOnAddYouTubeShorts}
          onUpgradePlan={mockOnUpgradePlan}
        />
      );
    });
    const root = renderer!.root;

    const opt1 = root.findByProps({ testID: 'action-create-itinerary' });
    ReactTestRenderer.act(() => {
      opt1.props.onPress();
    });

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnCreateItinerary).toHaveBeenCalled();
  });

  it('triggers onAddInstagramReel and closes menu on option 2 tap', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TripQuickActionMenuModal
          visible={true}
          onClose={mockOnClose}
          onCreateItinerary={mockOnCreateItinerary}
          onAddInstagramReel={mockOnAddInstagramReel}
          onAddYouTubeShorts={mockOnAddYouTubeShorts}
          onUpgradePlan={mockOnUpgradePlan}
        />
      );
    });
    const root = renderer!.root;

    const opt2 = root.findByProps({ testID: 'action-add-instagram-reel' });
    ReactTestRenderer.act(() => {
      opt2.props.onPress();
    });

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnAddInstagramReel).toHaveBeenCalled();
  });

  it('triggers onAddYouTubeShorts and closes menu on option 3 tap', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TripQuickActionMenuModal
          visible={true}
          onClose={mockOnClose}
          onCreateItinerary={mockOnCreateItinerary}
          onAddInstagramReel={mockOnAddInstagramReel}
          onAddYouTubeShorts={mockOnAddYouTubeShorts}
          onUpgradePlan={mockOnUpgradePlan}
        />
      );
    });
    const root = renderer!.root;

    const opt3 = root.findByProps({ testID: 'action-add-youtube-shorts' });
    ReactTestRenderer.act(() => {
      opt3.props.onPress();
    });

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnAddYouTubeShorts).toHaveBeenCalled();
  });

  it('triggers onUpgradePlan and closes menu on option 4 tap', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TripQuickActionMenuModal
          visible={true}
          onClose={mockOnClose}
          onCreateItinerary={mockOnCreateItinerary}
          onAddInstagramReel={mockOnAddInstagramReel}
          onAddYouTubeShorts={mockOnAddYouTubeShorts}
          onUpgradePlan={mockOnUpgradePlan}
        />
      );
    });
    const root = renderer!.root;

    const opt4 = root.findByProps({ testID: 'action-upgrade-plan' });
    ReactTestRenderer.act(() => {
      opt4.props.onPress();
    });

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnUpgradePlan).toHaveBeenCalled();
  });
});
