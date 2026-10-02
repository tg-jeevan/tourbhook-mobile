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

type ForgotPasswordNavProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

// ── CUSTOM INLINE CLOSE / BACK ICON ──────────────────────────
const CloseIcon = () => (
  <View style={styles.closeIconContainer}>
    <View style={styles.closeLine1} />
    <View style={styles.closeLine2} />
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

// ── CUSTOM INLINE PAPER AIRPLANE ART ─────────────────────────
const PaperAirplaneArt = () => (
  <View style={styles.planeArtContainer}>
    {/* Dashed flight trail curve */}
    <View style={styles.trailDot1} />
    <View style={styles.trailDot2} />
    <View style={styles.trailDot3} />
    <View style={styles.trailDot4} />
    {/* Origami Paper Plane */}
    <View style={styles.planeBody}>
      <View style={styles.planeWingLeft} />
      <View style={styles.planeWingRight} />
    </View>
  </View>
);

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordNavProp>();
  const { height: screenHeight } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);

  const bottomIllustrationHeight = Math.max(130, Math.min(screenHeight * 0.22, 180));

  const handleSendResetLink = () => {
    navigation.navigate('OTPVerification', { email: email || 'your@email.com' });
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
            {/* Top Right Airplane Art */}
            <View style={styles.planeRow}>
              <PaperAirplaneArt />
            </View>

            {/* Header Title & Subtitle */}
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>Enter your email to reset your password.</Text>

            <View style={styles.gap32} />

            {/* Email Input Field */}
            <View
              style={[
                styles.inputWrapper,
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

            <View style={styles.gap24} />

            {/* Primary CTA Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSendResetLink}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Send Reset Link</Text>
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
  },
  planeRow: {
    alignItems: 'flex-end',
    height: 38,
    marginRight: 12,
    marginBottom: -10,
  },
  planeArtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trailDot1: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    marginRight: 5,
    transform: [{ translateY: 4 }],
  },
  trailDot2: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    marginRight: 5,
    transform: [{ translateY: -1 }],
  },
  trailDot3: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    marginRight: 5,
    transform: [{ translateY: -3 }],
  },
  trailDot4: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    marginRight: 8,
    transform: [{ translateY: -6 }],
  },
  planeBody: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-25deg' }],
  },
  planeWingLeft: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: AppColors.primary,
  },
  planeWingRight: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#38BDF8',
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
    fontFamily: Platform.OS === 'android' ? 'Inter-ExtraBold' : undefined,
  },
  subtitle: {
    fontSize: 13.5,
    color: AppColors.textSecondary,
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
  },
  inputWrapperFocused: {
    borderColor: AppColors.primary,
    backgroundColor: '#FFFFFF',
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
  mailIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailOutline: {
    width: 18,
    height: 13,
    borderWidth: 1.5,
    borderColor: AppColors.textMuted,
    borderRadius: 2.5,
  },
  mailV: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: AppColors.textMuted,
    transform: [{ rotate: '-45deg' }, { translateY: -4 }],
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
  gap24: { height: 24 },
  gap32: { height: 32 },
});