import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ProfileMenuScreen from './ProfileMenuScreen';
import { AppColors } from '../../../core/theme/colors';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockLogout = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
}));

jest.mock('../../../core/auth/AuthContext', () => ({
  useAuth: () => ({
    user: {
      name: 'Mani Test',
      email: 'mani@test.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      verificationStatus: 'verified',
    },
    logout: mockLogout,
  }),
}));

jest.mock('../data/languageStore', () => ({
  useLanguagePreference: () => ({
    currentLanguage: { code: 'en', name: 'English', nativeName: 'English' },
  }),
}));

jest.mock('../data/subscriptionStore', () => ({
  useSubscription: () => ({
    isPremium: false,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe('ProfileMenuScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile header cleanly without any logo image or logo wrapper', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<ProfileMenuScreen />);
    });

    const root = renderer!.root;

    // Verify user profile elements are preserved
    expect(root.findAllByProps({ children: 'Mani Test' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Explorer' }).length).toBeGreaterThan(0);

    // Verify NO logo image is rendered on the profile menu screen
    const logoImages = root.findAllByProps({ accessibilityLabel: 'Tour Bhook Official Logo' });
    expect(logoImages.length).toBe(0);

    const appLogos = root.findAll((node) => typeof node.type === 'function' && (node.type as any).name === 'AppLogo');
    expect(appLogos.length).toBe(0);
    expect(root.findAllByProps({ testID: 'tourbhook-transparent-logo' }).length).toBe(0);
    expect(root.findAllByProps({ testID: 'tourbhook-symbol-logo' }).length).toBe(0);

    // Verify menu items are present
    expect(root.findAllByProps({ children: 'Connected Instagram Profile' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Language' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Profile Settings' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Help & Support' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Log Out' }).length).toBeGreaterThan(0);
  });

  it('navigates to HelpSupport screen when Help & Support menu item is tapped', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<ProfileMenuScreen />);
    });

    const root = renderer!.root;
    const touchables = root.findAllByType(TouchableOpacity);
    const helpSupportBtn = touchables.find((t) =>
      t.findAllByProps({ children: 'Help & Support' }).length > 0
    );
    expect(helpSupportBtn).toBeDefined();

    ReactTestRenderer.act(() => {
      helpSupportBtn!.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('HelpSupport', undefined);
  });
});
