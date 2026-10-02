import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';

type ResetPasswordNavProp = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;

// ── CUSTOM INLINE CLOSE ICON ─────────────────────────────────
const CloseIcon = () => (
  <View style={styles.closeIconContainer}>
    <View style={styles.closeLine1} />
    <View style={styles.closeLine2} />
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

// ── CUSTOM SECURITY / LOCK BADGE ─────────────────────────────
const SecurityLockBadge = () => (
  <View style={styles.badgeContainer}>
    {/* Radiating sparkle rays */}
    <View style={styles.sparkleTopLeft} />
    <View style={styles.sparkleMidLeft} />
    <View style={styles.sparkleTopRight} />
    <View style={styles.sparkleMidRight} />

    {/* Circular Tinted Background */}
    <View style={styles.badgeCircle}>
      {/* Padlock Illustration */}
      <View style={styles.badgeLockContainer}>
        <View style={styles.badgeLockShackle} />
        <View style={styles.badgeLockBody}>
          <View style={styles.badgeKeyhole} />
        </View>
      </View>
    </View>
  </View>
);

export default function ResetPasswordScreen() {
  const navigation = useNavigation<ResetPasswordNavProp>();
  const { height: screenHeight } = useWindowDimensions();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  const [obscureConfirmPassword, setObscureConfirmPassword] = useState(true);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const bottomIllustrationHeight = Math.max(130, Math.min(screenHeight * 0.22, 180));

  const handleResetPassword = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.root}>
      {/* ── BOTTOM TRAVEL ILLUSTRATION ── */}
      <View
        style={[styles.bottomIllustrationContainer, { height: bottomIllustrationHeight }]}
        pointerEvents="none"
      >
        <Image
          source={require('../../../../assets/images/welcomeTravelIllustration.png')}
          style={styles.bottomIllustrationImage}
          resizeMode="cover"
        />
      </View>

      {/* ── FOREGROUND CONTENT ── */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButtonTouchable}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: bottomIllustrationHeight + 20 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Top Center Security Badge */}
            <View style={styles.badgeWrapper}>
              <SecurityLockBadge />
            </View>

            <View style={styles.gap16} />

            {/* Header Title & Subtitle */}
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Create a new password for your account.</Text>

            <View style={styles.gap32} />

            {/* New Password Input Field */}
            <View
              style={[
                styles.inputWrapper,
                passwordFocused && styles.inputWrapperFocused,
              ]}
            >
              <View style={styles.inputPrefixIcon}>
                <LockIcon focused={passwordFocused} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="New Password"
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

            <View style={styles.gap16} />

            {/* Confirm Password Input Field */}
            <View
              style={[
                styles.inputWrapper,
                confirmPasswordFocused && styles.inputWrapperFocused,
              ]}
            >
              <View style={styles.inputPrefixIcon}>
                <LockIcon focused={confirmPasswordFocused} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Confirm Password"
                placeholderTextColor={AppColors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={obscureConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />
              <TouchableOpacity
                style={styles.suffixButton}
                onPress={() => setObscureConfirmPassword(!obscureConfirmPassword)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {obscureConfirmPassword ? <EyeHiddenIcon /> : <EyeVisibleIcon />}
              </TouchableOpacity>
            </View>

            <View style={styles.gap32} />

            {/* Primary CTA Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleResetPassword}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Reset Password</Text>
              <Text style={styles.primaryButtonArrow}>→</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    zIndex: 10,
  },
  backButtonTouchable: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  closeIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeLine1: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: AppColors.textPrimary,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  closeLine2: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: AppColors.textPrimary,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  badgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  badgeContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkleTopLeft: {
    position: 'absolute',
    top: 18,
    left: 14,
    width: 8,
    height: 2,
    backgroundColor: '#93C5FD',
    borderRadius: 1,
    transform: [{ rotate: '-35deg' }],
  },
  sparkleMidLeft: {
    position: 'absolute',
    top: 36,
    left: 10,
    width: 8,
    height: 2,
    backgroundColor: '#93C5FD',
    borderRadius: 1,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: 18,
    right: 14,
    width: 8,
    height: 2,
    backgroundColor: '#93C5FD',
    borderRadius: 1,
    transform: [{ rotate: '35deg' }],
  },
  sparkleMidRight: {
    position: 'absolute',
    top: 36,
    right: 10,
    width: 8,
    height: 2,
    backgroundColor: '#93C5FD',
    borderRadius: 1,
  },
  badgeCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLockShackle: {
    width: 18,
    height: 15,
    borderWidth: 3.5,
    borderColor: AppColors.primary,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomWidth: 0,
    marginBottom: -2,
  },
  badgeLockBody: {
    width: 28,
    height: 22,
    backgroundColor: AppColors.primary,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeKeyhole: {
    width: 4,
    height: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.4,
    fontFamily: Platform.OS === 'android' ? 'Inter-ExtraBold' : undefined,
  },
  subtitle: {
    fontSize: 13.5,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: AppColors.borderLight,
    shadowColor: AppColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    width: '100%',
  },
  inputWrapperFocused: {
    borderColor: AppColors.primary,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  inputPrefixIcon: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: AppColors.textPrimary,
    fontSize: 14.5,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
    padding: 0,
  },
  suffixButton: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockShackle: {
    width: 10,
    height: 9,
    borderWidth: 1.5,
    borderColor: AppColors.textMuted,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 0,
    transform: [{ translateY: 1.5 }],
  },
  lockBody: {
    width: 14,
    height: 10,
    backgroundColor: AppColors.textMuted,
    borderRadius: 2.5,
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
  primaryButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
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
  gap16: { height: 16 },
  gap32: { height: 32 },
});