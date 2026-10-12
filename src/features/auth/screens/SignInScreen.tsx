import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../core/navigation/types';
import { useAuth } from '../../../core/auth/AuthContext';
import { AppColors } from '../../../core/theme/colors';

type SignInScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

// ── CUSTOM INLINE CHEVRON BACK ICON ──────────────────────────
const BackIcon = () => (
  <View style={styles.backIconCircle}>
    <View style={styles.chevronContainer}>
      <View style={styles.chevronLineTop} />
      <View style={styles.chevronLineBottom} />
    </View>
  </View>
);

// ── CUSTOM INLINE MAIL ICON ──────────────────────────────────
const MailIcon = ({ focused }: { focused: boolean }) => (
  <View style={styles.mailIconContainer}>
    <View
      style={[
        styles.mailOutline,
        focused && { borderColor: AppColors.primary },
      ]}
    />
    <View
      style={[
        styles.mailV,
        focused && { borderColor: AppColors.primary },
      ]}
    />
  </View>
);

// ── CUSTOM INLINE LOCK ICON ──────────────────────────────────
const LockIcon = ({ focused }: { focused: boolean }) => (
  <View style={styles.lockIconContainer}>
    <View
      style={[
        styles.lockShackle,
        focused && { borderColor: AppColors.primary },
      ]}
    />
    <View
      style={[
        styles.lockBody,
        focused && { backgroundColor: AppColors.primary },
      ]}
    />
  </View>
);

// ── CUSTOM INLINE VISIBILITY ICONS ───────────────────────────
const EyeVisibleIcon = () => (
  <View style={styles.eyeContainer}>
    <View style={styles.eyeOutline} />
    <View style={styles.eyePupil} />
  </View>
);

const EyeHiddenIcon = () => (
  <View style={styles.eyeContainer}>
    <View style={styles.eyeOutline} />
    <View style={styles.eyePupil} />
    <View style={styles.eyeSlash} />
  </View>
);

// ── GOOGLE "G" LOGO BADGE ───────────────────────────────────
const GoogleBadge = () => (
  <View style={styles.googleBadge}>
    <Text style={styles.googleBadgeText}>G</Text>
  </View>
);

const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavProp>();
  const { loginWithMock } = useAuth();
  const { height: screenHeight } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener?.(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener?.(hideEvent, () => {
      setKeyboardVisible(false);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
    return () => {
      showSub?.remove?.();
      hideSub?.remove?.();
    };
  }, []);

  const isSmallScreen = screenHeight < 740;

  // Responsive hero and illustration heights (always rendered behind the form at all times)
  const heroHeight = Math.max(120, Math.min(screenHeight * 0.22, 180));
  const bottomIllustrationHeight = Math.max(90, Math.min(screenHeight * 0.16, 140));

  const handleSignIn = () => {
    loginWithMock();
  };

  const handleGoogleSignIn = () => {
    loginWithMock();
  };

  return (
    <View style={styles.root}>
      {/* ── TOP HERO BACKGROUND (Always rendered behind the form) ── */}
      <View
        style={[styles.heroContainer, { height: heroHeight }]}
        pointerEvents="none"
        testID="signin-hero-background"
      >
        <Image
          source={require('../../../../assets/images/welcomeHeroBackground.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroGradientOverlay} />
      </View>

      {/* ── BOTTOM TRAVEL ILLUSTRATION (Always rendered behind the form) ── */}
      <View
        style={[styles.bottomIllustrationContainer, { height: bottomIllustrationHeight }]}
        pointerEvents="none"
        testID="signin-bottom-illustration"
      >
        <Image
          source={require('../../../../assets/images/welcomeTravelIllustration.png')}
          style={styles.bottomIllustrationImage}
          resizeMode="cover"
        />
      </View>

      {/* ── FOREGROUND CONTENT ── */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Navigation Bar with Back Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButtonTouchable}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <BackIcon />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContent,
              !keyboardVisible && styles.scrollContentCentered,
            ]}
            scrollEnabled={keyboardVisible}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
          >
            <View style={styles.cardContainer}>
              <View
                style={[
                  styles.cardSheet,
                  (isSmallScreen || keyboardVisible) && styles.cardSheetCompact,
                ]}
              >
              {/* Header Title & Subtitle */}
              <Text
                style={[
                  styles.title,
                  (isSmallScreen || keyboardVisible) && styles.titleCompact,
                ]}
              >
                Welcome Back
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  (isSmallScreen || keyboardVisible) && styles.subtitleCompact,
                ]}
              >
                Sign in to continue your journey
              </Text>

              <View
                style={
                  keyboardVisible
                    ? styles.gap8
                    : isSmallScreen
                    ? styles.gap10
                    : styles.gap16
                }
              />

              {/* Google Sign In Button */}
              <TouchableOpacity
                style={[
                  styles.googleButton,
                  (isSmallScreen || keyboardVisible) && styles.googleButtonCompact,
                ]}
                onPress={handleGoogleSignIn}
                activeOpacity={0.85}
              >
                <GoogleBadge />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <View
                style={
                  keyboardVisible
                    ? styles.gap8
                    : isSmallScreen
                    ? styles.gap10
                    : styles.gap14
                }
              />

              {/* Divider with "or" */}
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>

              <View
                style={
                  keyboardVisible
                    ? styles.gap8
                    : isSmallScreen
                    ? styles.gap10
                    : styles.gap14
                }
              />

              {/* Email Input Field */}
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.inputLabel,
                    (isSmallScreen || keyboardVisible) && styles.inputLabelCompact,
                  ]}
                >
                  Email
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    (isSmallScreen || keyboardVisible) && styles.inputWrapperCompact,
                    emailFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <View style={styles.inputPrefixIcon}>
                    <MailIcon focused={emailFocused} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="your@email.com"
                    placeholderTextColor={AppColors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
              </View>

              <View
                style={
                  keyboardVisible
                    ? styles.gap6
                    : isSmallScreen
                    ? styles.gap8
                    : styles.gap12
                }
              />

              {/* Password Input Field */}
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.inputLabel,
                    (isSmallScreen || keyboardVisible) && styles.inputLabelCompact,
                  ]}
                >
                  Password
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    (isSmallScreen || keyboardVisible) && styles.inputWrapperCompact,
                    passwordFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <View style={styles.inputPrefixIcon}>
                    <LockIcon focused={passwordFocused} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor={AppColors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={obscurePassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    style={styles.suffixButton}
                    onPress={() => setObscurePassword(!obscurePassword)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    {obscurePassword ? <EyeHiddenIcon /> : <EyeVisibleIcon />}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.gap6} />

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordWrapper}
                onPress={() => {
                  try {
                    navigation.navigate('ForgotPassword' as any);
                  } catch (e) {
                    Alert.alert('Forgot Password', 'This route has not been migrated yet.');
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <View
                style={
                  keyboardVisible
                    ? styles.gap8
                    : isSmallScreen
                    ? styles.gap10
                    : styles.gap14
                }
              />

              {/* Primary CTA - Sign In Button */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (isSmallScreen || keyboardVisible) && styles.primaryButtonCompact,
                ]}
                onPress={handleSignIn}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Sign In</Text>
                <Text style={styles.primaryButtonArrow}>→</Text>
              </TouchableOpacity>

              <View
                style={
                  keyboardVisible
                    ? styles.gap6
                    : isSmallScreen
                    ? styles.gap8
                    : styles.gap12
                }
              />

              {/* Sign Up Navigation Footer */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignUp')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              {__DEV__ && !keyboardVisible && (
                <>
                  <View style={styles.gap10} />
                  <TouchableOpacity
                    style={styles.mockAuthButton}
                    onPress={loginWithMock}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.mockAuthButtonText}>Continue with Test Account</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(246, 241, 232, 0.25)',
  },
  bottomIllustrationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  bottomIllustrationImage: {
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 8 : 4,
    zIndex: 10,
  },
  backButtonTouchable: {
    alignSelf: 'flex-start',
  },
  backIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  chevronContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -2,
  },
  chevronLineTop: {
    width: 10,
    height: 2.2,
    backgroundColor: AppColors.textPrimary,
    borderRadius: 1.1,
    transform: [{ rotate: '-45deg' }, { translateY: 1.6 }],
  },
  chevronLineBottom: {
    width: 10,
    height: 2.2,
    backgroundColor: AppColors.textPrimary,
    borderRadius: 1.1,
    transform: [{ rotate: '45deg' }, { translateY: -1.6 }],
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  scrollContentCentered: {
    justifyContent: 'center',
    paddingBottom: 0,
  },
  cardContainer: {
    paddingHorizontal: 20,
    zIndex: 5,
  },
  cardSheet: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: AppColors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  cardSheetCompact: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
    fontFamily: Platform.OS === 'android' ? 'Inter-ExtraBold' : undefined,
  },
  titleCompact: {
    fontSize: 20,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13.5,
    color: AppColors.textSecondary,
    marginTop: 4,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },
  subtitleCompact: {
    fontSize: 12,
    marginTop: 2,
  },
  googleButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    backgroundColor: AppColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  googleButtonCompact: {
    height: 40,
    borderRadius: 20,
  },
  googleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  googleBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EA4335',
    fontFamily: Platform.OS === 'android' ? 'Inter-ExtraBold' : undefined,
  },
  googleButtonText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: AppColors.textPrimary,
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.borderLight,
  },
  dividerText: {
    fontSize: 13,
    color: AppColors.textMuted,
    paddingHorizontal: 12,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 6,
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: AppColors.borderLight,
  },
  inputWrapperFocused: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.surface,
  },
  inputPrefixIcon: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: AppColors.textPrimary,
    fontSize: 14,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
    padding: 0,
  },
  suffixButton: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailIconContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailOutline: {
    width: 16,
    height: 12,
    borderWidth: 1.5,
    borderColor: AppColors.textMuted,
    borderRadius: 2,
  },
  mailV: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: AppColors.textMuted,
    transform: [{ rotate: '-45deg' }, { translateY: -3.5 }],
  },
  lockIconContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockShackle: {
    width: 9,
    height: 8,
    borderWidth: 1.5,
    borderColor: AppColors.textMuted,
    borderTopLeftRadius: 4.5,
    borderTopRightRadius: 4.5,
    borderBottomWidth: 0,
    transform: [{ translateY: 1.5 }],
  },
  lockBody: {
    width: 13,
    height: 9,
    backgroundColor: AppColors.textMuted,
    borderRadius: 2,
  },
  eyeContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeOutline: {
    width: 16,
    height: 10,
    borderWidth: 1.5,
    borderColor: AppColors.textMuted,
    borderRadius: 50,
  },
  eyePupil: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: AppColors.textMuted,
  },
  eyeSlash: {
    position: 'absolute',
    width: 16,
    height: 1.5,
    backgroundColor: AppColors.textMuted,
    transform: [{ rotate: '45deg' }],
  },
  forgotPasswordWrapper: {
    alignSelf: 'flex-end',
    paddingVertical: 2,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primary,
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textOnPrimary,
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  primaryButtonArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textOnPrimary,
    marginLeft: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: 13.5,
    color: AppColors.textSecondary,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },
  signUpText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: AppColors.primary,
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  mockAuthButton: {
    width: '100%',
    height: 46,
    borderRadius: 23,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockAuthButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: AppColors.textSecondary,
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },
  inputLabelCompact: {
    fontSize: 12,
    marginBottom: 4,
  },
  inputWrapperCompact: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  primaryButtonCompact: {
    height: 46,
    borderRadius: 23,
  },
  gap6: { height: 6 },
  gap8: { height: 8 },
  gap10: { height: 10 },
  gap12: { height: 12 },
  gap14: { height: 14 },
  gap16: { height: 16 },
  gap18: { height: 18 },
  gap20: { height: 20 },
});

export default SignInScreen;
