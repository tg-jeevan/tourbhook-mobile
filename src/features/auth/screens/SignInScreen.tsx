import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../core/navigation/types';
import { useAuth } from '../../../core/auth/AuthContext';

type SignInScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

// ── CUSTOM INLINE CHEVRON LEFT ICON ──────────────────────────
const ChevronLeftIcon = () => (
  <View style={styles.chevronContainer}>
    <View style={styles.chevronLineTop} />
    <View style={styles.chevronLineBottom} />
  </View>
);

// ── CUSTOM INLINE MAIL ICON ──────────────────────────────────
const MailIcon = () => (
  <View style={styles.mailIconContainer}>
    <View style={styles.mailOutline} />
    <View style={styles.mailV} />
  </View>
);

// ── CUSTOM INLINE LOCK ICON ──────────────────────────────────
const LockIcon = () => (
  <View style={styles.lockIconContainer}>
    <View style={styles.lockShackle} />
    <View style={styles.lockBody} />
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

const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavProp>();
  const { loginWithMock } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSignIn = () => {
    // Placeholder sign in action to keep future integration ready
    console.log('Sign In initiated with email:', email);
  };

  const handleGoogleSignIn = () => {
    // Placeholder google sign in action to keep future integration ready
    console.log('Google Sign In initiated');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon />
        </TouchableOpacity>

        <View style={styles.gap24} />

        {/* Header Text */}
        <Text style={styles.title}>Welcome Back</Text>
        <View style={styles.gap8} />
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>

        <View style={styles.gap32} />

        {/* Google Sign In Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.8}
        >
          <View style={styles.googleIconContainer}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.gap24} />

        {/* Or Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.gap24} />

        {/* Email Input Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.gap8} />
          <View
            style={[
              styles.inputWrapper,
              emailFocused && styles.inputWrapperFocused,
            ]}
          >
            <View style={styles.inputPrefixIcon}>
              <MailIcon />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="your@email.com"
              placeholderTextColor="#B0B0B8"
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

        <View style={styles.gap20} />

        {/* Password Input Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.gap8} />
          <View
            style={[
              styles.inputWrapper,
              passwordFocused && styles.inputWrapperFocused,
            ]}
          >
            <View style={styles.inputPrefixIcon}>
              <LockIcon />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              placeholderTextColor="#B0B0B8"
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
            >
              {obscurePassword ? <EyeHiddenIcon /> : <EyeVisibleIcon />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.gap12} />

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotPasswordWrapper}
          onPress={() => {
            try {
              // Try to navigate using existing navigation setup
              navigation.navigate('ForgotPassword' as any);
            } catch (e) {
              Alert.alert('Forgot Password', 'This route has not been migrated yet.');
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.gap24} />

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.gap24} />

        {/* Sign Up Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>{"Don't have an account? "}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.7}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {__DEV__ && (
          <>
            <View style={styles.gap24} />
            <TouchableOpacity
              style={styles.mockAuthButton}
              onPress={loginWithMock}
              activeOpacity={0.8}
            >
              <Text style={styles.mockAuthButtonText}>Continue with Test Account</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.gap40} />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  // Fills background white as in Flutter AppColors.background (#FFFFFF)
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  flex1: {
    flex: 1,
  },

  // Back Button Chevron Left Container
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  chevronContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronLineTop: {
    width: 14,
    height: 3,
    backgroundColor: '#1A1A2E',
    borderRadius: 1.5,
    transform: [{ rotate: '-45deg' }, { translateY: 2 }],
  },
  chevronLineBottom: {
    width: 14,
    height: 3,
    backgroundColor: '#1A1A2E',
    borderRadius: 1.5,
    transform: [{ rotate: '45deg' }, { translateY: -2 }],
  },

  // Header Titles
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A2E',
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(26, 26, 46, 0.7)',
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },

  // Google button
  googleButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconContainer: {
    marginRight: 12,
  },
  googleIconText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },

  // Divider Row
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    fontSize: 14,
    color: '#8E8E93',
    paddingHorizontal: 16,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },

  // Inputs
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A2E',
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    borderColor: '#E91E63',
  },
  inputPrefixIcon: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#1A1A2E',
    fontSize: 14,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
    padding: 0, // removes default android padding
  },
  suffixButton: {
    paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Mail Icon Styling
  mailIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailOutline: {
    width: 18,
    height: 12,
    borderWidth: 1.5,
    borderColor: '#8E8E93',
    borderRadius: 2,
  },
  mailV: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#8E8E93',
    transform: [{ rotate: '-45deg' }, { translateY: -4.5 }],
  },

  // Lock Icon Styling
  lockIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockShackle: {
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderColor: '#8E8E93',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 0,
    transform: [{ translateY: 2 }],
  },
  lockBody: {
    width: 14,
    height: 10,
    backgroundColor: '#8E8E93',
    borderRadius: 2,
  },

  // Eye Icon Styling
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
    borderColor: '#8E8E93',
    borderRadius: 50,
  },
  eyePupil: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8E8E93',
  },
  eyeSlash: {
    position: 'absolute',
    width: 18,
    height: 1.5,
    backgroundColor: '#8E8E93',
    transform: [{ rotate: '45deg' }],
  },

  // Forgot password
  forgotPasswordWrapper: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E91E63',
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },

  // Action Button
  signInButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },

  // Footer signup link
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E91E63',
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },

  // Mock Bypass Button Styles
  mockAuthButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockAuthButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },

  // Spacing gaps
  gap8: { height: 8 },
  gap12: { height: 12 },
  gap16: { height: 16 },
  gap20: { height: 20 },
  gap24: { height: 24 },
  gap32: { height: 32 },
  gap40: { height: 40 },
});

export default SignInScreen;

