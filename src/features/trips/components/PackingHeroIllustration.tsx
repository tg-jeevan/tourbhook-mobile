import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';

export const PackingHeroIllustration: React.FC = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width="110" height="90" viewBox="0 0 110 90" fill="none">
        {/* Soft Background Cloud/Circle */}
        <Circle cx="75" cy="55" r="28" fill="#E0F2FE" opacity={0.6} />

        {/* Dashed Flight Path Arc */}
        <Path
          d="M10 70 C30 25, 70 15, 95 18"
          stroke="#0284C7"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          strokeOpacity={0.7}
        />

        {/* Small Plane */}
        <G transform="translate(90, 12) rotate(15)">
          <Path
            d="M0 0 L10 3 L14 0 L11.5 5 L15 7 L11.5 8 L10 12 L8 8 L3 9 L4.5 6 Z"
            fill="#0E7490"
          />
        </G>

        {/* Suitcase Body (Teal / Mint) */}
        <G transform="translate(42, 34) rotate(-8)">
          {/* Main Luggage Case */}
          <Rect
            x="0"
            y="6"
            width="38"
            height="32"
            rx="6"
            fill="#38BDF8"
          />
          {/* Accent Luggage Front Panel */}
          <Rect
            x="4"
            y="10"
            width="30"
            height="24"
            rx="4"
            fill="#0284C7"
          />
          {/* Luggage Straps / Ribs */}
          <Rect x="12" y="10" width="3" height="24" fill="#38BDF8" />
          <Rect x="23" y="10" width="3" height="24" fill="#38BDF8" />

          {/* Handle */}
          <Path
            d="M13 6 L13 0 L25 0 L25 6"
            stroke="#0369A1"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Wheels */}
          <Circle cx="7" cy="38" r="2.5" fill="#0F172A" />
          <Circle cx="31" cy="38" r="2.5" fill="#0F172A" />
        </G>

        {/* Small Golden Stars */}
        <Path
          d="M18 18 L19 21 L22 22 L19 23 L18 26 L17 23 L14 22 L17 21 Z"
          fill="#F59E0B"
        />
        <Path
          d="M32 46 L32.6 48 L35 48.6 L32.6 49.2 L32 51 L31.4 49.2 L29 48.6 L31.4 48 Z"
          fill="#F59E0B"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 110,
    height: 90,
  },
});
