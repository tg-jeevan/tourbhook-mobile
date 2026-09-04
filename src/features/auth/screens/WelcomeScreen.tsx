import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../core/navigation/types';

type WelcomeScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavProp>();

  return (
    <View style={styles.root}>
      {/* Full-screen background image — covers entire screen including status bar */}
      <Image
        source={require('../../../../assets/images/welcomeImage.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* Smooth LinearGradient overlay generated dynamically as a PNG asset to avoid native library builds.
          Stretches over the whole screen matching the exact opacities and stops:
          Stops [0.0, 0.3, 0.6, 1.0] with opacities [0.6, 0.3, 0.7, 0.9] */}
      <Image
        source={require('../../../../assets/images/gradientOverlay.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="stretch"
      />

      {/* SafeAreaView with 'top' and 'bottom' keeps content inside safe bounds
          but the image/gradient bleeds freely behind the status bar */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>

          {/* ── TOP SECTION ────────────────────────────────────── */}
          <View style={styles.topSection}>
            <Image
              source={require('../../../../assets/images/appLogoTransparent.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>ShrineTours</Text>
          </View>

          {/* ── SPACER (Flutter: Spacer()) ─────────────────────── */}
          <View style={styles.flex1} />

          {/* ── BOTTOM SECTION ─────────────────────────────────── */}
          <View style={styles.bottomSection}>

            {/* "Welcome to ShrineTours" */}
            <Text style={styles.welcomeLabel}>Welcome to ShrineTours</Text>

            {/* 12px gap */}
            <View style={styles.gap12} />

            {/* "Your Adventure\nStarts Here" */}
            <Text style={styles.headline}>
              {'Your Adventure\nStarts Here'}
            </Text>

            {/* 16px gap */}
            <View style={styles.gap16} />

            {/* Description */}
            <Text style={styles.description}>
              {'Discover top places, plan your perfect route,\ntravel easily and stress-free'}
            </Text>

            {/* 40px gap */}
            <View style={styles.gap40} />

            {/* Glass / translucent CTA button */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.buttonText}>{"Let's start"}</Text>
            </TouchableOpacity>

            {/* 20px gap */}
            <View style={styles.gap20} />

            {/* Photo credit */}
            <Text style={styles.credit}>
              P.C goes to unsplash.com/Fabio Comparelli
            </Text>

            {/* 40px bottom padding */}
            <View style={styles.gap40} />
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Root fills entire screen, black bg covers any tiny gaps while image loads
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // SafeAreaView fills root but image/gradient are positioned behind it absolutely
  safeArea: {
    flex: 1,
  },

  // Content column with horizontal padding matching Flutter's EdgeInsets.symmetric(horizontal: 24)
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Flex spacer equivalent to Flutter's Spacer()
  flex1: {
    flex: 1,
  },

  // ── TOP SECTION ─────────────────────────────────────────────
  topSection: {
    alignItems: 'center',
    paddingTop: 24, // Flutter: SizedBox(height: 24) after SafeArea
  },

  logo: {
    width: 80,
    height: 80, // Flutter: height: 80
  },

  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    // Use bundled Inter on Android; system San Francisco / Roboto on iOS is fine
    fontFamily: Platform.OS === 'android' ? 'Inter-ExtraBold' : undefined,
  },

  // ── BOTTOM SECTION ──────────────────────────────────────────
  bottomSection: {
    alignItems: 'center',
  },

  welcomeLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },

  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36.8, // 32 * 1.15 — matches Flutter height: 1.15
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'Inter-ExtraBold' : undefined,
  },

  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 21.0, // 14 * 1.5 — matches Flutter height: 1.5
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },

  // Glass button: full-width, pill shape, translucent white
  button: {
    alignSelf: 'stretch', // full width of content area
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },

  credit: {
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },

  // Spacers
  gap12: { height: 12 },
  gap16: { height: 16 },
  gap20: { height: 20 },
  gap40: { height: 40 },
});

export default WelcomeScreen;
