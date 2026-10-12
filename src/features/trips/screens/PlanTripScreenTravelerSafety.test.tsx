import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PlanTripScreen from './PlanTripScreen';
import { itineraryStore } from '../data/itineraryStore';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

let mockRouteParams: any = {};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: mockRouteParams,
  }),
}));

// Mock child components that might use complex layouts
jest.mock('../components/TripFlowProgressHeader', () => ({
  TripFlowProgressHeader: () => null,
}));

jest.mock('../components/TripDatePickerModal', () => ({
  TripDatePickerModal: () => null,
}));

describe('PlanTripScreen - Traveler Safety & Medical History UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = {};
    itineraryStore.resetToInitial();
  });

  it('renders Traveler Safety with a visible Required badge and no Optional wording', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<PlanTripScreen />);
    });

    const root = renderer!.root;

    // Verify "Traveler Safety" label is present
    const travelerSafetyLabels = root.findAllByProps({ children: 'Traveler Safety' });
    expect(travelerSafetyLabels.length).toBeGreaterThan(0);

    // Verify Required badge exists
    const requiredBadges = root.findAllByProps({ children: 'Required' });
    expect(requiredBadges.length).toBeGreaterThan(0);

    // Verify NO Optional badge or wording appears in safety section
    const optionalLabels = root.findAllByProps({ children: 'Optional' });
    expect(optionalLabels.length).toBe(0);
  });

  it('displays Medical History with Required badge and guidance when age is 60 or above', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<PlanTripScreen />);
    });

    const root = renderer!.root;

    // Initially age is empty, medical input is not displayed
    const medicalInputBefore = root.findAllByProps({ testID: 'plan-trip-medical-input' });
    expect(medicalInputBefore.length).toBe(0);

    // Set age to 65
    const ageInput = root.findByProps({ testID: 'plan-trip-age-input' });
    ReactTestRenderer.act(() => {
      ageInput.props.onChangeText('65');
    });

    // Medical History subheader and Required badge must now be visible
    const medicalHeader = root.findAllByProps({ children: 'Medical History' });
    expect(medicalHeader.length).toBeGreaterThan(0);

    const medicalRequiredBadge = root.findByProps({ testID: 'plan-trip-medical-required-badge' });
    expect(medicalRequiredBadge).toBeDefined();

    // Guidance text is visible
    const guidanceTexts = root.findAll((node) =>
      typeof node.props.children === 'string' &&
      node.props.children.includes('For travelers aged 60+, please share any relevant medical information')
    );
    expect(guidanceTexts.length).toBeGreaterThan(0);

    // Medical TextInput is visible
    const medicalInput = root.findByProps({ testID: 'plan-trip-medical-input' });
    expect(medicalInput).toBeDefined();
  });

  it('displays inline validation error when age is 60+ and medical input is empty or whitespace', () => {
    // Provide a valid trip in store so destination and dates are prefilled
    itineraryStore.addItinerary({
      id: 'test-trip-60-plus',
      title: 'Golden Years Vacation',
      customName: 'Golden Years Vacation',
      destination: 'Bangkok, Thailand',
      location: 'Bangkok, Thailand',
      dates: 'Nov 1 – Nov 10, 2026',
      startDate: 'Nov 1, 2026',
      endDate: 'Nov 10, 2026',
      travelerType: 'couple',
      adults: 2,
      kids: 0,
      purpose: 'Leisure',
      primaryAge: 70,
      medicalInfo: '',
      status: 'upcoming',
      placesCount: 3,
      activitiesCount: 6,
      travelersCount: 2,
      imageUri: 'https://example.com/bangkok.jpg',
      theme: 'sky',
    });

    mockRouteParams = {
      tripId: 'test-trip-60-plus',
      mode: 'edit',
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<PlanTripScreen />);
    });

    const root = renderer!.root;

    // Medical input with whitespace only
    const medicalInput = root.findByProps({ testID: 'plan-trip-medical-input' });
    ReactTestRenderer.act(() => {
      medicalInput.props.onChangeText('   ');
    });

    // Tap CTA Next
    const ctaButton = root.findByProps({ testID: 'plan-trip-next-button' });
    ReactTestRenderer.act(() => {
      ctaButton.props.onPress();
    });

    // Progression must be blocked (mockNavigate not called)
    expect(mockNavigate).not.toHaveBeenCalled();

    // Inline error text must be displayed
    const errorMsg = root.findByProps({ testID: 'plan-trip-medical-error' });
    expect(errorMsg).toBeDefined();
    expect(errorMsg.props.children).toContain('Medical information is required for travelers aged 60+');

    // Revalidation: typing valid medical info clears error
    ReactTestRenderer.act(() => {
      medicalInput.props.onChangeText('Needs ground floor accommodation; pacemaker.');
    });

    // The inline error disappears
    const errorAfter = root.findAllByProps({ testID: 'plan-trip-medical-error' });
    expect(errorAfter.length).toBe(0);

    // Tapping CTA Next now allows progression
    ReactTestRenderer.act(() => {
      ctaButton.props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('TripPreferences', expect.objectContaining({
      primaryAge: 70,
      medicalInfo: 'Needs ground floor accommodation; pacemaker.',
    }));

    itineraryStore.deleteItinerary('test-trip-60-plus');
  });
});
