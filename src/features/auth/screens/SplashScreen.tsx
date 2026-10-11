import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../../core/theme/colors';

export default function SplashScreen() {
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android' && (StatusBar as any).setBackgroundColor) {
      (StatusBar as any).setBackgroundColor(AppColors.textPrimary);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../../assets/images/tourBhookOfficialLogoTransparent.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Tour Bhook Logo"
          />
        </View>
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
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 2, // Intrinsic 1024 / 512 aspect ratio
  },
});