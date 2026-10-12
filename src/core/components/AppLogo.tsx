import React from 'react';
import {
  Image,
  ImageResizeMode,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export type AppLogoSize = 'compact' | 'header' | 'large' | 'symbol' | 'custom';
export type AppLogoVariant = 'full' | 'symbol';

export interface AppLogoProps {
  size?: AppLogoSize;
  variant?: AppLogoVariant;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
  resizeMode?: ImageResizeMode;
}

const OFFICIAL_LOGO_TRANSPARENT = require('../../../assets/images/tourBhookOfficialLogoTransparent.png');
const OFFICIAL_SYMBOL_TRANSPARENT = require('../../../assets/images/appLogoTransparent.png');

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'compact',
  variant = 'full',
  style,
  containerStyle,
  accessibilityLabel = variant === 'symbol' ? 'Tour Bhook Symbol' : 'Tour Bhook Official Logo',
  testID = variant === 'symbol' ? 'tourbhook-symbol-logo' : 'tourbhook-transparent-logo',
  resizeMode = 'contain',
}) => {
  const imageSource = variant === 'symbol' ? OFFICIAL_SYMBOL_TRANSPARENT : OFFICIAL_LOGO_TRANSPARENT;
  const sizeStyle = sizeStyles[size] || sizeStyles.compact;
  const mergedImageStyle = StyleSheet.flatten([sizeStyle, style]);

  return (
    <View style={[styles.transparentContainer, containerStyle]}>
      <Image
        source={imageSource}
        style={mergedImageStyle}
        resizeMode={resizeMode}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      />
    </View>
  );
};

const sizeStyles = StyleSheet.create({
  compact: {
    width: 110,
    height: 28,
  },
  header: {
    width: 120,
    height: 28,
  },
  large: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 2, // Intrinsic 1024 x 512 aspect ratio
  },
  symbol: {
    width: 120,
    height: 120,
    aspectRatio: 1, // Intrinsic 1024 x 1024 aspect ratio for TB symbol mark
  },
  custom: {},
});

const styles = StyleSheet.create({
  transparentContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
