import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';

type OTPVerificationNavProp = NativeStackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

// ── CUSTOM INLINE CLOSE ICON ─────────────────────────────────
const CloseIcon = () => (
  <View style={styles.closeIconContainer}>
    <View style={styles.closeLine1} />
    <View style={styles.closeLine2} />
  </View>
);

// ── CUSTOM ENVELOPE / OTP BADGE ──────────────────────────────
const OtpEnvelopeBadge = () => (
  <View style={styles.badgeContainer}>
    {/* Radiating sparkle rays */}
    <View style={styles.sparkleTopLeft} />
    <View style={styles.sparkleTopRight} />

    {/* Circular Tinted Background */}
    <View style={styles.badgeCircle}>
      {/* Envelope Body */}
      <View style={styles.envelopeBody}>
        {/* Letter paper inside envelope */}
        <View style={styles.letterPaper}>
          <View style={styles.letterLine1} />
          <View style={styles.letterLine2} />
        </View>
        {/* Front flap */}
        <View style={styles.envelopeFlapLeft} />
        <View style={styles.envelopeFlapRight} />
        <View style={styles.envelopeBottomFold} />
      </View>
    </View>
  </View>
);

export default function OTPVerificationScreen() {
  const navigation = useNavigation<OTPVerificationNavProp>();
  const route = useRoute<OTPVerificationRouteProp>();
  const { height: screenHeight } = useWindowDimensions();

  const emailParam = route.params?.email || 'mani.test@example.com';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<Array<any>>([]);

  const bottomIllustrationHeight = Math.max(130, Math.min(screenHeight * 0.22, 180));

  const handleOtpChange = (value: string, index: number) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleanValue.length > 1) {
      // Handle paste
      const pasted = cleanValue.slice(0, 4).split('');
      for (let i = 0; i < 4; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      const lastIndex = Math.min(pasted.length, 3);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    newOtp[index] = cleanValue;
    setOtp(newOtp);

    if (cleanValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    navigation.navigate('ResetPassword', { email: emailParam, otp: enteredOtp || '1234' });
  };

  const handleResend = () => {
    Alert.alert('Code Resent', `A new verification code has been sent to ${emailParam}`);
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
            {/* Top Center Envelope Badge */}
            <View style={styles.badgeWrapper}>
              <OtpEnvelopeBadge />
            </View>

            <View style={styles.gap16} />

            {/* Header Title & Subtitle */}
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitlePrompt}>
              Enter the code sent to{'\n'}
              <Text style={styles.emailHighlight}>{emailParam}</Text>
            </Text>

            <View style={styles.gap32} />

            {/* 4 OTP Input Boxes */}
            <View style={styles.otpRow}>
              {[0, 1, 2, 3].map((index) => {
                const isFocused = focusedIndex === index;
                const hasValue = !!otp[index];
                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      isFocused && styles.otpBoxFocused,
                      hasValue && styles.otpBoxFilled,
                    ]}
                  >
                    <TextInput
                      ref={(ref) => {
                        inputRefs.current[index] = ref;
                      }}
                      style={styles.otpInput}
                      value={otp[index]}
                      onChangeText={(val) => handleOtpChange(val, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(-1)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      textAlign="center"
                    />
                  </View>
                );
              })}
            </View>

            <View style={styles.gap32} />

            {/* Primary Verify Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleVerify}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Verify</Text>
              <Text style={styles.primaryButtonArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.gap24} />

            {/* Resend Action Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>{"Didn't receive the code? "}</Text>
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={styles.resendText}>Resend</Text>
              </TouchableOpacity>
            </View>
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
    top: 14,
    left: 20,
    width: 8,
    height: 2,
    backgroundColor: '#93C5FD',
    borderRadius: 1,
    transform: [{ rotate: '-35deg' }],
  },
  sparkleTopRight: {
    position: 'absolute',
    top: 14,
    right: 20,
    width: 8,
    height: 2,
    backgroundColor: '#93C5FD',
    borderRadius: 1,
    transform: [{ rotate: '35deg' }],
  },
  badgeCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  envelopeBody: {
    width: 44,
    height: 34,
    backgroundColor: AppColors.primary,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  letterPaper: {
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
    width: 32,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    paddingTop: 4,
    paddingHorizontal: 5,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  letterLine1: {
    width: '85%',
    height: 2,
    backgroundColor: '#CBD5E1',
    borderRadius: 1,
    marginBottom: 3,
  },
  letterLine2: {
    width: '60%',
    height: 2,
    backgroundColor: '#CBD5E1',
    borderRadius: 1,
  },
  envelopeFlapLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 22,
    borderBottomWidth: 18,
    borderTopWidth: 14,
    borderLeftColor: '#0C657E',
    borderBottomColor: '#0C657E',
    borderTopColor: 'transparent',
    zIndex: 2,
  },
  envelopeFlapRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    borderRightWidth: 22,
    borderBottomWidth: 18,
    borderTopWidth: 14,
    borderRightColor: '#0B596F',
    borderBottomColor: '#0B596F',
    borderTopColor: 'transparent',
    zIndex: 2,
  },
  envelopeBottomFold: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#094B5E',
    zIndex: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.4,
    fontFamily: Platform.OS === 'android' ? 'Inter-ExtraBold' : undefined,
  },
  subtitlePrompt: {
    fontSize: 13.5,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },
  emailHighlight: {
    fontWeight: '700',
    color: AppColors.primary,
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  otpBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: AppColors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  otpBoxFocused: {
    borderColor: AppColors.primary,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  otpBoxFilled: {
    borderColor: AppColors.primary,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.textPrimary,
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
    padding: 0,
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
  resendText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: AppColors.primary,
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  gap16: { height: 16 },
  gap24: { height: 24 },
  gap32: { height: 32 },
});