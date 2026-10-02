import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';

type WelcomeScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavProp>();
  const { height: screenHeight } = useWindowDimensions();

  // Responsive layout calculations
  const heroHeight = Math.max(300, Math.min(screenHeight * 0.48, 420));
  const bottomIllustrationHeight = Math.max(130, Math.min(screenHeight * 0.22, 190));

  return (
    <View style={styles.root}>
      {/* ── TOP HERO BACKGROUND (Mediterranean / Santorini Coast) ── */}
      <View style={[styles.heroContainer, { height: heroHeight }]} pointerEvents="none">
        <Image
          source={require('../../../../assets/images/welcomeHeroBackground.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      {/* ── BOTTOM TRAVEL ILLUSTRATION (Landmark Silhouettes) ── */}
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
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* ── TOP BRAND & WELCOME HEADER ── */}
        <View style={styles.headerSection}>
          <View style={styles.brandBadge}>
            <Image
              source={require('../../../../assets/images/appLogoTransparent.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>Tourbhook</Text>
          </View>

          <View style={styles.headerTextGroup}>
            <Text style={styles.welcomeSubtitle}>DISCOVER • PLAN • TRAVEL</Text>
            <Text style={styles.welcomeHeading}>Welcome</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* ── MIDDLE CONTENT AREA (Vertically Centered between Hero & Bottom Illustration) ── */}
      <View
        style={[
          styles.middleArea,
          {
            top: heroHeight,
            bottom: bottomIllustrationHeight,
          },
        ]}
      >
        <View style={styles.actionCard}>
          <Text style={styles.headline}>Your Adventure Starts Here</Text>
          <Text style={styles.description}>
            Discover top places, plan your perfect route, and travel easily & stress-free.
          </Text>

          <View style={styles.gap20} />

          {/* Primary CTA - Ocean Teal Pill */}
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Text style={styles.primaryButtonArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.gap14} />

          {/* Secondary Action - Sign In */}
          <TouchableOpacity
            style={styles.secondaryLink}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.secondaryPromptText}>
              Already have an account?{' '}
              <Text style={styles.secondaryActionText}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.surface,
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
  headerSection: {
    paddingTop: Platform.OS === 'android' ? 10 : 6,
    paddingHorizontal: 24,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: AppColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  brandName: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
    fontFamily: Platform.OS === 'android' ? 'Inter-ExtraBold' : undefined,
  },
  headerTextGroup: {
    marginTop: 2,
  },
  welcomeSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 2,
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  welcomeHeading: {
    fontSize: 28,
    fontWeight: '800',
    color: AppColors.textPrimary,
    lineHeight: 34,
    letterSpacing: -0.5,
    fontFamily: Platform.OS === 'android' ? 'Inter-ExtraBold' : undefined,
  },
  middleArea: {
    position: 'absolute',
    left: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCard: {
    width: '100%',
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: AppColors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  headline: {
    fontSize: 21,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
    fontFamily: Platform.OS === 'android' ? 'Inter-ExtraBold' : undefined,
  },
  description: {
    fontSize: 13.5,
    fontWeight: '400',
    color: AppColors.textSecondary,
    lineHeight: 19.5,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 6,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
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
  secondaryLink: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  secondaryPromptText: {
    fontSize: 13.5,
    color: AppColors.textSecondary,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },
  secondaryActionText: {
    fontWeight: '700',
    color: AppColors.primary,
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  gap14: {
    height: 14,
  },
  gap20: {
    height: 20,
  },
});

export default WelcomeScreen;
