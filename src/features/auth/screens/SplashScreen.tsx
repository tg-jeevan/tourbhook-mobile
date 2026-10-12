import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../../core/theme/colors';
import { AppLogo } from '../../../core/components/AppLogo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Responsive symbol sizing: ~30-32% of screen width, moderate size bounded between 100px and 140px
const LOGO_SIZE = Math.max(100, Math.min(Math.round(SCREEN_WIDTH * 0.32), 140));

export default function SplashScreen() {
  useEffect(() => {
    StatusBar.setHidden(true);
    StatusBar.setBarStyle('light-content');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar hidden={true} barStyle="light-content" />
      <View style={styles.content}>
        <AppLogo
          variant="symbol"
          size="symbol"
          accessibilityLabel="Tour Bhook Logo"
          style={styles.logo}
          containerStyle={styles.logoContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.textPrimary, // #10243F Deep Navy
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    maxWidth: 140,
    aspectRatio: 1, // Intrinsic 1:1 aspect ratio for TB symbol mark
  },
});