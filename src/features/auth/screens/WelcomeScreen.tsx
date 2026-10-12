import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { AppLogo } from '../../../core/components/AppLogo';

type WelcomeScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavProp>();

  return (
    <View style={styles.root}>
      <StatusBar hidden={true} barStyle="dark-content" />

      {/* ── TOP HERO BACKGROUND (Mediterranean / Santorini Coast) ── */}
      <View style={styles.heroContainer} pointerEvents="none">
        <Image
          source={require('../../../../assets/images/welcomeHeroBackground.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroGradientOverlay} />
      </View>

      {/* ── BOTTOM TRAVEL ILLUSTRATION (Landmark Silhouettes) ── */}
      <View style={styles.bottomIllustrationContainer} pointerEvents="none">
        <Image
          source={require('../../../../assets/images/welcomeTravelIllustration.png')}
          style={styles.bottomIllustrationImage}
          resizeMode="cover"
        />
      </View>

      {/* ── FOREGROUND CONTENT ── */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* ── TOP BRAND & WELCOME HEADER ── */}
        <View style={styles.headerSection}>
          {/* Official Tour Bhook Logo (Transparent) */}
          <AppLogo
            size="header"
            containerStyle={styles.logoContainer}
            accessibilityLabel="Tour Bhook Official Logo"
          />

          <View style={styles.headerTextGroup}>
            <Text style={styles.welcomeSubtitle}>DISCOVER • PLAN • TRAVEL</Text>
            <Text style={styles.welcomeHeading}>Welcome</Text>
          </View>
        </View>

        {/* Balanced Vertical Spacer */}
        <View style={styles.flexSpacer} />

        {/* ── CENTRAL ADVENTURE CARD ── */}
        <View style={styles.cardContainer}>
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
              testID="welcome-get-started-btn"
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
              testID="welcome-sign-in-btn"
            >
              <Text style={styles.secondaryPromptText}>
                Already have an account?{' '}
                <Text style={styles.secondaryActionText}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(250, 248, 245, 0.15)',
  },
  bottomIllustrationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    justifyContent: 'flex-end',
  },
  bottomIllustrationImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerSection: {
    paddingTop: 12,
    paddingHorizontal: 22,
  },
  logoContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    marginBottom: 12,
  },
  headerTextGroup: {
    marginTop: 2,
  },
  welcomeSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.primary,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  welcomeHeading: {
    fontSize: 32,
    fontWeight: '900',
    color: AppColors.textPrimary,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  flexSpacer: {
    flex: 1,
    minHeight: 20,
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
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
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  headline: {
    fontSize: 21,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13.5,
    fontWeight: '400',
    color: AppColors.textSecondary,
    lineHeight: 19.5,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 6,
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
  },
  secondaryActionText: {
    fontWeight: '700',
    color: AppColors.primary,
  },
  gap14: {
    height: 14,
  },
  gap20: {
    height: 20,
  },
});

export default WelcomeScreen;
