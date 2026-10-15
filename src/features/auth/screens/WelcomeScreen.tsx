import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type WelcomeScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavProp>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ── TOP HERO BACKGROUND (Santorini Coastal Image with Curved Wave Transition) ── */}
      <View style={styles.heroContainer} pointerEvents="none">
        <Image
          source={require('../../../../assets/images/welcomeHeroBackground.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Curved Organic Wave Transition into Lower Section */}
        <View style={styles.waveContainer}>
          <Svg
            viewBox="0 0 375 70"
            style={styles.waveSvg}
            preserveAspectRatio="none"
          >
            {/* Subtle blue accent under-wave matching reference */}
            <Path
              d="M0,28 C110,66 230,70 375,20 L375,70 L0,70 Z"
              fill="#D4E6F2"
              opacity={0.8}
            />
            {/* Main curved white/sand wave */}
            <Path
              d="M0,18 C110,54 230,58 375,10 L375,70 L0,70 Z"
              fill="#FAF8F5"
            />
          </Svg>
        </View>
      </View>

      {/* ── BOTTOM TRAVEL ILLUSTRATION (Subtle Light-Blue Skyline & Airplanes) ── */}
      <View style={styles.bottomIllustrationContainer} pointerEvents="none">
        <Image
          source={require('../../../../assets/images/welcomeTravelIllustration.png')}
          style={styles.bottomIllustrationImage}
          resizeMode="cover"
        />
      </View>

      {/* ── FOREGROUND CONTENT ── */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* ── TOP BRAND HEADER (TB Symbol + Tagline + Welcome + Accent Bar) ── */}
        <View style={styles.headerSection}>
          <Image
            source={require('../../../../assets/images/tourBhookOfficialLogoSymbol.png')}
            style={styles.logoSymbol}
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel="Tour Bhook Official Logo"
            testID="tourbhook-symbol-logo"
          />

          <Text style={styles.tagline}>DISCOVER • PLAN • TRAVEL</Text>

          <Text style={styles.welcomeHeading}>Welcome</Text>

          {/* Teal accent underline under "We" */}
          <View style={styles.welcomeAccentBar} />
        </View>

        {/* Flexible spacer between top header and lower card */}
        <View style={styles.topFlexSpacer} />

        {/* ── LOWER CONTENT CARD (Your Adventure Starts Here) ── */}
        <View style={styles.cardContainer}>
          {/* DPIIT / Startup India Official Logo */}
          <View style={styles.startupIndiaContainer}>
            <Image
              source={require('../../../../assets/images/dpiit-startup-india.png')}
              style={styles.startupIndiaLogo}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel="DPIIT Startup India Logo"
              testID="dpiit-startup-india-logo"
            />
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.headline}>Your Adventure Starts Here</Text>
            <Text style={styles.description}>
              Discover top places, plan your perfect route, and travel easily & stress-free.
            </Text>

            {/* Primary CTA - Teal Pill Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('SignUp')}
              testID="welcome-get-started-btn"
            >
              <Text style={styles.primaryButtonText}>Get Started →</Text>
            </TouchableOpacity>

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

        {/* Responsive bottom spacer balancing the card centrally in lower section */}
        <View style={styles.bottomFlexSpacer} />
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
    height: Math.round(SCREEN_HEIGHT * 0.58),
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  waveContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 68,
  },
  waveSvg: {
    width: '100%',
    height: '100%',
  },
  bottomIllustrationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Math.round(SCREEN_HEIGHT * 0.28),
    justifyContent: 'flex-end',
  },
  bottomIllustrationImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  safeArea: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  logoSymbol: {
    width: 48,
    height: 48,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F2644',
    letterSpacing: 2,
    marginTop: 10,
    marginBottom: 4,
  },
  welcomeHeading: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0D233E',
    lineHeight: 42,
    letterSpacing: -0.6,
  },
  welcomeAccentBar: {
    width: 44,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#007B99',
    marginTop: 6,
  },
  topFlexSpacer: {
    flex: 3.4,
    minHeight: 20,
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
  startupIndiaContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 2,
  },
  startupIndiaLogo: {
    width: 100,
    height: 34,
  },
  bottomFlexSpacer: {
    flex: 1,
    minHeight: 36,
  },
  actionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingVertical: 24,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#0A2540',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 6,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D233E',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#627D98',
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#007B99',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#007B99',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryLink: {
    marginTop: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  secondaryPromptText: {
    fontSize: 13.5,
    color: '#627D98',
  },
  secondaryActionText: {
    fontWeight: '700',
    color: '#007B99',
  },
});

export default WelcomeScreen;
