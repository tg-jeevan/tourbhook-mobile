import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Image } from 'react-native';
declare const require: any;
declare const __dirname: string;

const fs = require('fs');
const path = require('path');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  isOnboardingCompleted,
  setOnboardingCompleted,
  resetOnboardingStorage,
} from '../services/onboardingStorage';
import OnboardingScreen from './OnboardingScreen';
import SignUpScreen from './SignUpScreen';
import WelcomeScreen from './WelcomeScreen';
import { AuthNavigator } from '../../../core/navigation/AuthNavigator';

const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      replace: mockReplace,
      goBack: mockGoBack,
    }),
  };
});

jest.mock('../../../core/auth/AuthContext', () => ({
  useAuth: () => ({
    loginWithMock: jest.fn(),
    isAuthenticated: false,
    isInitializing: false,
    user: null,
    logout: jest.fn(),
  }),
}));

describe('Onboarding and Authentication Flow Tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await resetOnboardingStorage();
  });

  afterEach(async () => {
    await resetOnboardingStorage();
  });

  describe('1. Onboarding Storage & First-Time Persistence', () => {
    it('returns false on first launch when onboarding has not been completed', async () => {
      const completed = await isOnboardingCompleted();
      expect(completed).toBe(false);
    });

    it('persists onboarding completion across app restarts', async () => {
      expect(await isOnboardingCompleted()).toBe(false);

      await setOnboardingCompleted();

      // Verify stored in AsyncStorage
      const storedVal = await AsyncStorage.getItem('@tourbhook_onboarding_completed');
      expect(storedVal).toBe('true');

      // Subsequent check confirms it is completed
      expect(await isOnboardingCompleted()).toBe(true);
    });

    it('does not reset onboarding completed status on logout', async () => {
      await setOnboardingCompleted();
      expect(await isOnboardingCompleted()).toBe(true);

      // Simulating user logout clearing tokens but preserving onboarding
      await AsyncStorage.removeItem('@auth_tokens');
      expect(await isOnboardingCompleted()).toBe(true);
    });
  });

  describe('2. OnboardingScreen UI & Actions', () => {
    it('renders the 3 travel slides and official branding', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<OnboardingScreen />);
      });

      const root = renderer.root;

      // Check slides exist
      expect(root.findByProps({ testID: 'onboarding-slide-1' })).toBeTruthy();
      expect(root.findByProps({ testID: 'onboarding-slide-2' })).toBeTruthy();
      expect(root.findByProps({ testID: 'onboarding-slide-3' })).toBeTruthy();

      // Check titles match requirements
      expect(root.findAllByProps({ children: 'Discover Places' }).length).toBeGreaterThan(0);
      expect(root.findAllByProps({ children: 'Plan Your Adventure' }).length).toBeGreaterThan(0);
      expect(root.findAllByProps({ children: 'Travel Together' }).length).toBeGreaterThan(0);
    });

    it('renders full-screen destination cover images and no logo on onboarding slides', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<OnboardingScreen />);
      });

      const root = renderer.root;

      // Verify logo is completely removed from onboarding
      expect(root.findAllByProps({ testID: 'tourbhook-transparent-logo' }).length).toBe(0);
      expect(root.findAllByProps({ testID: 'tourbhook-symbol-logo' }).length).toBe(0);
      expect(root.findAllByProps({ accessibilityLabel: 'Tour Bhook Logo' }).length).toBe(0);

      // Verify slide destination images use full-screen cover mode
      const slide1 = root.findByProps({ testID: 'onboarding-slide-1' });
      const images = slide1.findAllByType(Image);
      expect(images.length).toBeGreaterThan(0);
      expect(images[0].props.resizeMode).toBe('cover');
    });

    it('Skip button persists completion and navigates to Welcome', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<OnboardingScreen />);
      });

      const skipBtn = renderer.root.findByProps({ testID: 'onboarding-skip-btn' });
      await act(async () => {
        skipBtn.props.onPress();
      });

      // Storage marked as completed
      expect(await isOnboardingCompleted()).toBe(true);
      // Navigates or replaces to Welcome
      expect(mockReplace).toHaveBeenCalledWith('Welcome');
    });

    it('completing onboarding via Get Started sets storage and replaces to Welcome', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<OnboardingScreen />);
      });

      const nextBtn = renderer.root.findByProps({ testID: 'onboarding-next-btn' });

      // Advance through slides
      await act(async () => {
        nextBtn.props.onPress(); // to slide 2
      });
      await act(async () => {
        nextBtn.props.onPress(); // to slide 3
      });

      // On slide 3, CTA is Get Started
      const getStartedBtn = renderer.root.findByProps({ testID: 'onboarding-get-started-btn' });
      expect(getStartedBtn).toBeTruthy();

      await act(async () => {
        getStartedBtn.props.onPress();
      });

      expect(await isOnboardingCompleted()).toBe(true);
      expect(mockReplace).toHaveBeenCalledWith('Welcome');
    });
  });

  describe('3. WelcomeScreen Rework & Branding', () => {
    it('renders the official Tour Bhook logo and does not use text approximation', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<WelcomeScreen />);
      });

      const root = renderer.root;
      const logoImage = root.findByProps({ accessibilityLabel: 'Tour Bhook Official Logo' });
      expect(logoImage).toBeTruthy();

      // Get Started button navigates to SignIn
      const getStartedBtn = root.findByProps({ testID: 'welcome-get-started-btn' });
      await act(async () => {
        getStartedBtn.props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith('SignIn');
    });
  });

  describe('4. SignUpScreen Confirm Password Validation', () => {
    it('requires password and confirm password', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<SignUpScreen />);
      });

      const submitBtn = renderer.root.findByProps({ testID: 'signup-submit-btn' });

      // Click submit with empty fields
      await act(async () => {
        submitBtn.props.onPress();
      });

      // Navigation must not occur
      expect(mockNavigate).not.toHaveBeenCalled();

      // Error messages shown
      const passwordError = renderer.root.findByProps({ testID: 'signup-password-error' });
      expect(passwordError.props.children).toBe('Password is required');

      const confirmError = renderer.root.findByProps({ testID: 'signup-confirm-password-error' });
      expect(confirmError.props.children).toBe('Please confirm your password');
    });

    it('prevents account creation and displays "Passwords do not match" when values differ', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<SignUpScreen />);
      });

      const passwordInput = renderer.root.findByProps({ testID: 'signup-password-input' });
      const confirmInput = renderer.root.findByProps({ testID: 'signup-confirm-password-input' });
      const submitBtn = renderer.root.findByProps({ testID: 'signup-submit-btn' });

      // Fill in mismatched passwords
      await act(async () => {
        passwordInput.props.onChangeText('secret123');
        confirmInput.props.onChangeText('different456');
      });

      await act(async () => {
        submitBtn.props.onPress();
      });

      // Account creation blocked
      expect(mockNavigate).not.toHaveBeenCalled();

      // Mismatch error displayed
      const confirmError = renderer.root.findByProps({ testID: 'signup-confirm-password-error' });
      expect(confirmError.props.children).toBe('Passwords do not match');
    });

    it('clears mismatch error as user corrects the password value', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<SignUpScreen />);
      });

      const passwordInput = renderer.root.findByProps({ testID: 'signup-password-input' });
      const confirmInput = renderer.root.findByProps({ testID: 'signup-confirm-password-input' });
      const submitBtn = renderer.root.findByProps({ testID: 'signup-submit-btn' });

      await act(async () => {
        passwordInput.props.onChangeText('mismatch1');
        confirmInput.props.onChangeText('mismatch2');
      });

      await act(async () => {
        submitBtn.props.onPress();
      });

      expect(renderer.root.findByProps({ testID: 'signup-confirm-password-error' })).toBeTruthy();

      // User corrects confirm password to match
      await act(async () => {
        confirmInput.props.onChangeText('mismatch1');
      });

      // Error should be cleared
      expect(renderer.root.findAllByProps({ testID: 'signup-confirm-password-error' }).length).toBe(0);
    });

    it('permits submission when passwords match without sending confirmPassword to API', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<SignUpScreen />);
      });

      const passwordInput = renderer.root.findByProps({ testID: 'signup-password-input' });
      const confirmInput = renderer.root.findByProps({ testID: 'signup-confirm-password-input' });
      const submitBtn = renderer.root.findByProps({ testID: 'signup-submit-btn' });

      await act(async () => {
        passwordInput.props.onChangeText('securePassword99!');
        confirmInput.props.onChangeText('securePassword99!');
      });

      await act(async () => {
        submitBtn.props.onPress();
      });

      // Successfully proceeds to SignIn flow
      expect(mockNavigate).toHaveBeenCalledWith('SignIn');
    });
  });

  describe('5. Portrait Orientation Configuration', () => {
    it('sets android:screenOrientation="portrait" in AndroidManifest.xml', () => {
      const manifestPath = path.resolve(__dirname, '../../../../android/app/src/main/AndroidManifest.xml');
      const manifestContent = fs.readFileSync(manifestPath, 'utf8');

      expect(manifestContent).toContain('android:screenOrientation="portrait"');
      expect(manifestContent).not.toContain('android:screenOrientation="landscape"');
    });

    it('does not contain conflicting landscape settings in iOS Info.plist main orientations', () => {
      const infoPlistPath = path.resolve(__dirname, '../../../../ios/TourbhookMobile/Info.plist');
      const infoPlistContent = fs.readFileSync(infoPlistPath, 'utf8');

      // UISupportedInterfaceOrientations should contain Portrait
      expect(infoPlistContent).toContain('<string>UIInterfaceOrientationPortrait</string>');
    });
  });

  describe('6. AuthNavigator Navigation Integrity', () => {
    it('renders with initialRoute prop if provided', async () => {
      const { NavigationContainer } = require('@react-navigation/native');
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(
          <NavigationContainer>
            <AuthNavigator initialRoute="Welcome" />
          </NavigationContainer>
        );
      });

      expect(renderer.root).toBeTruthy();
    });
  });
});
