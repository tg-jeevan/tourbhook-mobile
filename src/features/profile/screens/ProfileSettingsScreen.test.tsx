import React from 'react';
import { Alert } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import ProfileSettingsScreen from './ProfileSettingsScreen';
import { profileService, validatePhoneNumber, validateDateOfBirth } from '../services/profileService';

const mockGoBack = jest.fn();
let mockRouteParams: any = {};
let mockUser: any = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '9876543210',
  isVerified: true,
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: mockRouteParams,
  }),
}));

jest.mock('../../../core/auth/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

describe('ProfileSettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = {};
    mockUser = {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '9876543210',
      isVerified: true,
    };
    jest.spyOn(Alert, 'alert');
    jest.spyOn(profileService, 'saveProfile').mockResolvedValue({ success: true });
    jest.spyOn(profileService, 'loadProfile').mockResolvedValue({
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '9876543210',
      dob: '15 Aug 1995',
      city: 'Bengaluru, Karnataka, India',
      avatarUrl: undefined,
      isKycVerified: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders read-only full name with KYC verified badge and read-only email', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<ProfileSettingsScreen />);
    });
    const root = renderer!.root;

    // Header Title
    expect(root.findAllByProps({ children: 'Edit Profile' }).length).toBeGreaterThan(0);

    // KYC Verified Badge
    const kycBadge = root.findByProps({ testID: 'kyc-verified-badge' });
    expect(kycBadge).toBeDefined();

    // Full name field is read-only
    const nameField = root.findByProps({ testID: 'full-name-field' });
    expect(nameField).toBeDefined();
    expect(root.findAllByProps({ children: 'John Doe' }).length).toBeGreaterThan(0);

    // Email field is read-only
    const emailField = root.findByProps({ testID: 'email-field' });
    expect(emailField).toBeDefined();
    expect(root.findAllByProps({ children: 'john.doe@email.com' }).length).toBeGreaterThan(0);
  });

  it('locks date of birth when KYC is verified', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<ProfileSettingsScreen />);
    });
    const root = renderer!.root;

    // Sourced from KYC, locked
    const dobLocked = root.findByProps({ testID: 'dob-readonly-field' });
    expect(dobLocked).toBeDefined();

    // Editable DOB button must NOT exist
    const dobPickerButtons = root.findAllByProps({ testID: 'dob-picker-button' });
    expect(dobPickerButtons.length).toBe(0);
  });

  it('allows date of birth selection via modal when KYC is unverified', async () => {
    mockRouteParams = { kycVerified: false };
    mockUser.isVerified = false;

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<ProfileSettingsScreen />);
    });
    const root = renderer!.root;

    // Editable DOB picker button exists
    const dobPickerButton = root.findByProps({ testID: 'dob-picker-button' });
    expect(dobPickerButton).toBeDefined();

    // Open modal
    await ReactTestRenderer.act(async () => {
      dobPickerButton.props.onPress();
    });

    // Confirm DOB
    const confirmBtn = root.findByProps({ testID: 'confirm-dob-button' });
    await ReactTestRenderer.act(async () => {
      confirmBtn.props.onPress();
    });

    expect(root.findByProps({ testID: 'dob-picker-button' })).toBeDefined();
  });

  it('validates phone number before saving', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<ProfileSettingsScreen />);
    });
    const root = renderer!.root;

    const phoneInput = root.findByProps({ testID: 'phone-input' });
    const saveButton = root.findByProps({ testID: 'save-changes-button' });

    // Enter invalid phone
    await ReactTestRenderer.act(async () => {
      phoneInput.props.onChangeText('1234');
    });

    await ReactTestRenderer.act(async () => {
      saveButton.props.onPress();
    });

    // Should alert and NOT call saveProfile
    expect(Alert.alert).toHaveBeenCalledWith(
      'Invalid Phone Number',
      expect.any(String)
    );
    expect(profileService.saveProfile).not.toHaveBeenCalled();

    // Enter valid 10-digit phone
    await ReactTestRenderer.act(async () => {
      phoneInput.props.onChangeText('9876543210');
    });

    await ReactTestRenderer.act(async () => {
      saveButton.props.onPress();
    });

    // Should now save permitted updates
    expect(profileService.saveProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: '+91 9876543210',
      }),
      mockUser
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'Profile Updated 🎉',
      expect.any(String),
      expect.any(Array)
    );
  });

  it('allows picking a profile picture and updates UI immediately', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<ProfileSettingsScreen />);
    });
    const root = renderer!.root;

    // Click avatar button
    const avatarBtn = root.findByProps({ testID: 'profile-picture-button' });
    await ReactTestRenderer.act(async () => {
      avatarBtn.props.onPress();
    });

    // Pick photo from gallery
    const galleryOption = root.findByProps({ testID: 'photo-option-gallery' });
    await ReactTestRenderer.act(async () => {
      galleryOption.props.onPress();
    });

    // Save changes
    const saveButton = root.findByProps({ testID: 'save-changes-button' });
    await ReactTestRenderer.act(async () => {
      saveButton.props.onPress();
    });

    expect(profileService.saveProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        avatarUrl: expect.stringContaining('http'),
      }),
      mockUser
    );
  });

  it('detects GPS location and handles location unavailability without blocking save', async () => {
    jest.spyOn(profileService, 'detectGpsCity').mockResolvedValueOnce({
      status: 'unavailable',
      formatted: 'Location unavailable',
      errorMessage: 'GPS signal lost',
    });

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<ProfileSettingsScreen />);
    });
    const root = renderer!.root;

    // Trigger detect GPS button
    const detectBtn = root.findByProps({ testID: 'detect-location-button' });
    await ReactTestRenderer.act(async () => {
      detectBtn.props.onPress();
    });

    // City shows unavailable
    expect(root.findAllByProps({ children: 'Location unavailable' }).length).toBeGreaterThan(0);

    // Saving changes should NOT be blocked by GPS unavailability
    const saveButton = root.findByProps({ testID: 'save-changes-button' });
    await ReactTestRenderer.act(async () => {
      saveButton.props.onPress();
    });

    expect(profileService.saveProfile).toHaveBeenCalled();
  });

  it('validates phone and date of birth utilities accurately', () => {
    // Phone validation
    expect(validatePhoneNumber('9876543210', '+91').isValid).toBe(true);
    expect(validatePhoneNumber('1234567890', '+91').isValid).toBe(false); // Does not start with 6-9
    expect(validatePhoneNumber('98765', '+91').isValid).toBe(false); // Less than 10 digits
    expect(validatePhoneNumber('', '+91').isValid).toBe(false);

    // DOB validation (minimum 18 years)
    const validDob = new Date();
    validDob.setFullYear(validDob.getFullYear() - 25);
    expect(validateDateOfBirth(validDob.toISOString()).isValid).toBe(true);

    const underageDob = new Date();
    underageDob.setFullYear(underageDob.getFullYear() - 10);
    expect(validateDateOfBirth(underageDob.toISOString()).isValid).toBe(false);

    const futureDob = new Date();
    futureDob.setFullYear(futureDob.getFullYear() + 2);
    expect(validateDateOfBirth(futureDob.toISOString()).isValid).toBe(false);
  });
});
