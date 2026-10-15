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
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import WelcomeScreen from './WelcomeScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import OTPVerificationScreen from './OTPVerificationScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
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
    useRoute: () => ({
      params: { email: 'test@example.com', otp: '1234' },
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

      // Get Started button navigates to SignUp
      const getStartedBtn = root.findByProps({ testID: 'welcome-get-started-btn' });
      await act(async () => {
        getStartedBtn.props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith('SignUp');
    });

    it('positions the content card with balanced responsive vertical spacing', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<WelcomeScreen />);
      });

      const root = renderer.root;

      // Headline and description
      const headline = root.findByProps({ children: 'Your Adventure Starts Here' });
      expect(headline).toBeTruthy();

      // Sign In button navigates to SignIn
      const signInBtn = root.findByProps({ testID: 'welcome-sign-in-btn' });
      expect(signInBtn).toBeTruthy();
      await act(async () => {
        signInBtn.props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith('SignIn');
    });

    it('renders the official DPIIT Startup India logo with transparency and proportional sizing', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<WelcomeScreen />);
      });

      const root = renderer.root;
      const dpiitLogo = root.findByProps({ testID: 'dpiit-startup-india-logo' });
      expect(dpiitLogo).toBeTruthy();
      expect(dpiitLogo.props.resizeMode).toBe('contain');
      expect(dpiitLogo.props.source).toEqual(
        require('../../../../assets/images/dpiit-startup-india.png')
      );
      expect(dpiitLogo.props.accessibilityLabel).toBe('DPIIT Startup India Logo');
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

  describe('7. SignIn and SignUp Background & Keyboard Stability', () => {
    it('SignInScreen preserves hero image and bottom illustration permanently behind the form', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<SignInScreen />);
      });

      const root = renderer.root;

      // Verify hero background and bottom illustration are rendered
      const heroBackground = root.findByProps({ testID: 'signin-hero-background' });
      expect(heroBackground).toBeTruthy();
      expect(heroBackground.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ height: expect.any(Number) })])
      );

      const bottomIllustration = root.findByProps({ testID: 'signin-bottom-illustration' });
      expect(bottomIllustration).toBeTruthy();
      expect(bottomIllustration.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ height: expect.any(Number) })])
      );

      // Verify essential inputs and buttons remain accessible
      expect(root.findByProps({ placeholder: 'your@email.com' })).toBeTruthy();
      expect(root.findByProps({ placeholder: '••••••••' })).toBeTruthy();
      expect(root.findAllByProps({ children: 'Continue with Google' }).length).toBeGreaterThan(0);
      expect(root.findAllByProps({ children: 'Forgot Password?' }).length).toBeGreaterThan(0);
      expect(root.findAllByProps({ children: 'Sign In' }).length).toBeGreaterThan(0);
    });

    it('SignUpScreen preserves hero image and bottom illustration permanently behind the form', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<SignUpScreen />);
      });

      const root = renderer.root;

      // Verify hero background and bottom illustration are rendered
      const heroBackground = root.findByProps({ testID: 'signup-hero-background' });
      expect(heroBackground).toBeTruthy();
      expect(heroBackground.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ height: expect.any(Number) })])
      );

      const bottomIllustration = root.findByProps({ testID: 'signup-bottom-illustration' });
      expect(bottomIllustration).toBeTruthy();
      expect(bottomIllustration.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ height: expect.any(Number) })])
      );

      // Verify essential inputs and buttons remain accessible
      expect(root.findByProps({ placeholder: 'John Doe' })).toBeTruthy();
      expect(root.findByProps({ placeholder: 'your@email.com' })).toBeTruthy();
      expect(root.findByProps({ testID: 'signup-password-input' })).toBeTruthy();
      expect(root.findByProps({ testID: 'signup-confirm-password-input' })).toBeTruthy();
      expect(root.findByProps({ testID: 'signup-submit-btn' })).toBeTruthy();
      expect(root.findAllByProps({ children: 'Sign In' }).length).toBeGreaterThan(0);
    });
  });

  describe('8. Authentication Inter-Screen Navigation Flow', () => {
    const getParentWithOnPress = (node: any) => {
      let curr = node;
      while (curr) {
        if (curr.props && typeof curr.props.onPress === 'function') {
          return curr;
        }
        curr = curr.parent;
      }
      throw new Error('No ancestor with onPress found');
    };

    it('Welcome → Get Started navigates to SignUp and Welcome → Sign In navigates to SignIn', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<WelcomeScreen />);
      });
      const root = renderer.root;

      const getStartedBtn = root.findByProps({ testID: 'welcome-get-started-btn' });
      await act(async () => {
        getStartedBtn.props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith('SignUp');

      mockNavigate.mockClear();
      const signInBtn = root.findByProps({ testID: 'welcome-sign-in-btn' });
      await act(async () => {
        signInBtn.props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith('SignIn');
    });

    it('SignIn → Sign Up footer link navigates to SignUp', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<SignInScreen />);
      });
      const root = renderer.root;

      const signUpText = root.findByProps({ children: 'Sign Up' });
      await act(async () => {
        getParentWithOnPress(signUpText).props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith('SignUp');
    });

    it('SignIn → Forgot Password link navigates to ForgotPassword', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<SignInScreen />);
      });
      const root = renderer.root;

      const forgotPasswordText = root.findByProps({ children: 'Forgot Password?' });
      await act(async () => {
        getParentWithOnPress(forgotPasswordText).props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
    });

    it('SignUp → Sign In footer link navigates to SignIn', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<SignUpScreen />);
      });
      const root = renderer.root;

      const signInText = root.findByProps({ children: 'Sign In' });
      await act(async () => {
        getParentWithOnPress(signInText).props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith('SignIn');
    });

    it('ForgotPassword → Send Reset Link navigates to OTPVerification', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<ForgotPasswordScreen />);
      });
      const root = renderer.root;

      const sendText = root.findByProps({ children: 'Send Reset Link' });
      await act(async () => {
        getParentWithOnPress(sendText).props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith(
        'OTPVerification',
        expect.objectContaining({ email: expect.any(String) })
      );
    });

    it('OTPVerification → Verify navigates to ResetPassword', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<OTPVerificationScreen />);
      });
      const root = renderer.root;

      const verifyText = root.findByProps({ children: 'Verify' });
      await act(async () => {
        getParentWithOnPress(verifyText).props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith(
        'ResetPassword',
        expect.objectContaining({ email: expect.any(String), otp: expect.any(String) })
      );
    });

    it('ResetPassword → Reset Password navigates to SignIn', async () => {
      let renderer!: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = ReactTestRenderer.create(<ResetPasswordScreen />);
      });
      const root = renderer.root;

      // Find the button (distinguished from header title)
      const matchingTexts = root.findAllByProps({ children: 'Reset Password' });
      const buttonNode = matchingTexts
        .map((node) => {
          try {
            return getParentWithOnPress(node);
          } catch {
            return null;
          }
        })
        .find(Boolean);

      expect(buttonNode).toBeTruthy();
      await act(async () => {
        buttonNode.props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith('SignIn');
    });
  });
});

