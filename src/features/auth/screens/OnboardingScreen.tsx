import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { AuthStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { setOnboardingCompleted } from '../services/onboardingStorage';

interface OnboardingSlide {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: any;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'slide-1',
    tag: 'EXPLORE DESTINATIONS',
    title: 'Discover Places',
    description: 'Explore destinations and discover places worth visiting.',
    image: require('../../../../assets/images/welcomeHeroBackground.jpg'),
  },
  {
    id: 'slide-2',
    tag: 'SMART ITINERARIES',
    title: 'Plan Your Adventure',
    description: 'Build personalized itineraries, activities, and packing lists.',
    image: require('../../../../assets/images/welcomeImage.jpg'),
  },
  {
    id: 'slide-3',
    tag: 'COMMUNITY & GROUPS',
    title: 'Travel Together',
    description: 'Discover travel Reels, share inspiration, and connect with travel groups.',
    image: require('../../../../assets/images/welcomeTravelIllustration.png'),
  },
];

type OnboardingNavProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingNavProp>();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const handleFinishOnboarding = async () => {
    await setOnboardingCompleted();
    if (navigation.replace) {
      navigation.replace('Welcome');
    } else {
      navigation.navigate('Welcome');
    }
  };

  const handleNext = async () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      await handleFinishOnboarding();
    }
  };

  const handleSkip = async () => {
    await handleFinishOnboarding();
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (screenWidth || 1));
    if (index >= 0 && index < ONBOARDING_SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  const renderSlideItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View
        style={[styles.slideContainer, { width: screenWidth, height: screenHeight }]}
        testID={`onboarding-${item.id}`}
      >
        {/* Full-Screen Destination Image */}
        <Image
          source={item.image}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Subtle Dark Gradient Overlay for Readability */}
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient id={`grad-${item.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#10243F" stopOpacity="0.45" />
              <Stop offset="30%" stopColor="#10243F" stopOpacity="0.1" />
              <Stop offset="55%" stopColor="#10243F" stopOpacity="0.35" />
              <Stop offset="75%" stopColor="#10243F" stopOpacity="0.78" />
              <Stop offset="100%" stopColor="#10243F" stopOpacity="0.96" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#grad-${item.id})`} />
        </Svg>

        {/* Text Content in Lower Portion */}
        <View style={styles.slideContentWrapper}>
          <View style={styles.textContent}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDescription}>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} barStyle="light-content" />

      {/* ── FULL-SCREEN SLIDES CAROUSEL ── */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlideItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={StyleSheet.absoluteFill}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        onScrollToIndexFailed={() => {}}
        testID="onboarding-carousel"
      />

      {/* ── TOP BAR: Skip Button (NO LOGO) ── */}
      <SafeAreaView edges={['top']} pointerEvents="box-none" style={styles.topSafeArea}>
        <View style={styles.headerRow} pointerEvents="box-none">
          <View style={styles.skipPlaceholder} />
          {!isLastSlide ? (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              testID="onboarding-skip-btn"
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>
      </SafeAreaView>

      {/* ── BOTTOM CONTROLS: Dot Indicators + CTA Button ── */}
      <SafeAreaView edges={['bottom']} pointerEvents="box-none" style={styles.bottomSafeArea}>
        <View style={styles.bottomControls} pointerEvents="box-none">
          {/* Dot page indicators */}
          <View style={styles.indicatorContainer} testID="onboarding-indicators">
            {ONBOARDING_SLIDES.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <View
                  key={idx}
                  style={[
                    styles.dotIndicator,
                    isActive ? styles.dotIndicatorActive : styles.dotIndicatorInactive,
                  ]}
                  testID={`onboarding-indicator-${idx}`}
                />
              );
            })}
          </View>

          {/* Next / Get Started Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, isLastSlide && styles.actionButtonFinal]}
            onPress={handleNext}
            activeOpacity={0.85}
            testID={isLastSlide ? 'onboarding-get-started-btn' : 'onboarding-next-btn'}
          >
            <Text style={styles.actionButtonText}>
              {isLastSlide ? 'Get Started' : 'Next'}
            </Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.textPrimary, // #10243F Deep Navy fallback
  },
  topSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 6,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 36, 63, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.white,
  },
  skipPlaceholder: {
    width: 50,
  },
  slideContainer: {
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  slideContentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 155, // Clean clearance above floating indicators and button
    alignItems: 'center',
  },
  textContent: {
    width: '100%',
    alignItems: 'center',
  },
  tagBadge: {
    backgroundColor: 'rgba(14, 116, 144, 0.32)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.9,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: AppColors.white,
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  slideDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomControls: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  dotIndicator: {
    height: 8,
    borderRadius: 4,
  },
  dotIndicatorActive: {
    width: 24,
    backgroundColor: '#38BDF8',
  },
  dotIndicatorInactive: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  actionButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonFinal: {
    backgroundColor: AppColors.accent, // Sunset Coral on final slide
    shadowColor: AppColors.accent,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: 0.2,
  },
  actionButtonArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
    marginLeft: 8,
  },
});
