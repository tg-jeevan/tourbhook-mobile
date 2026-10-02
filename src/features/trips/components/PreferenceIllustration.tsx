import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G, Ellipse } from 'react-native-svg';

interface PreferenceIllustrationProps {
  id: string;
}

export const PreferenceIllustration: React.FC<PreferenceIllustrationProps> = ({ id }) => {
  switch (id) {
    case 'Adventure':
      return (
        <View style={styles.container}>
          <Svg width="56" height="46" viewBox="0 0 56 46" fill="none">
            {/* Background Hill */}
            <Path
              d="M10 40 L28 14 L46 40 Z"
              fill="#93C5FD"
              opacity={0.6}
            />
            {/* Left Big Mountain */}
            <Path
              d="M4 42 L22 10 L40 42 Z"
              fill="#38BDF8"
            />
            {/* Snow Cap on Left Peak */}
            <Path
              d="M22 10 L16 21 L20 19 L22 22 L26 18 L28 21 Z"
              fill="#FFFFFF"
            />
            {/* Right Mountain */}
            <Path
              d="M24 42 L38 18 L52 42 Z"
              fill="#0284C7"
            />
            {/* Snow Cap on Right Peak */}
            <Path
              d="M38 18 L33 26 L36 24 L38 27 L41 24 L43 26 Z"
              fill="#FFFFFF"
            />
          </Svg>
        </View>
      );

    case 'Nature':
      return (
        <View style={styles.container}>
          <Svg width="56" height="46" viewBox="0 0 56 46" fill="none">
            {/* Soft background hill */}
            <Path
              d="M2 42 Q28 18, 54 42 Z"
              fill="#A7F3D0"
              opacity={0.5}
            />
            {/* Pine Trees */}
            <Path d="M12 40 L16 30 L20 40 Z" fill="#059669" />
            <Path d="M40 40 L44 32 L48 40 Z" fill="#047857" />
            {/* Big Emerald Leaf */}
            <Path
              d="M28 8 C38 12, 44 24, 38 36 C32 38, 22 34, 18 24 C16 16, 22 10, 28 8 Z"
              fill="#10B981"
            />
            <Path
              d="M22 32 C26 24, 30 18, 34 12"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );

    case 'Culture':
      return (
        <View style={styles.container}>
          <Svg width="56" height="46" viewBox="0 0 56 46" fill="none">
            {/* Greek Temple Pediment (Roof) */}
            <Path
              d="M10 18 L28 8 L46 18 Z"
              fill="#EA580C"
            />
            {/* Architrave */}
            <Rect x="12" y="18" width="32" height="3" fill="#C2410C" rx="1" />
            {/* Columns */}
            <Rect x="15" y="21" width="4" height="15" fill="#FB923C" rx="1" />
            <Rect x="23" y="21" width="4" height="15" fill="#FB923C" rx="1" />
            <Rect x="29" y="21" width="4" height="15" fill="#FB923C" rx="1" />
            <Rect x="37" y="21" width="4" height="15" fill="#FB923C" rx="1" />
            {/* Base */}
            <Rect x="10" y="36" width="36" height="4" fill="#C2410C" rx="1.5" />
          </Svg>
        </View>
      );

    case 'Food':
      return (
        <View style={styles.container}>
          <Svg width="56" height="46" viewBox="0 0 56 46" fill="none">
            {/* Fork & Knife on sides */}
            <Path
              d="M14 12 L14 26 M12 12 L12 18 M16 12 L16 18"
              stroke="#D97706"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <Path
              d="M42 12 C42 18, 40 22, 40 26"
              stroke="#D97706"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Bowl */}
            <Ellipse cx="28" cy="32" rx="14" ry="7" fill="#F59E0B" />
            <Path
              d="M15 32 C15 39, 21 42, 28 42 C35 42, 41 39, 41 32 Z"
              fill="#D97706"
            />
            {/* Steaming Food Delights */}
            <Circle cx="24" cy="28" r="3.5" fill="#EF4444" />
            <Circle cx="32" cy="27" r="3.5" fill="#10B981" />
            <Circle cx="28" cy="24" r="3" fill="#FBBF24" />
          </Svg>
        </View>
      );

    case 'Shopping':
      return (
        <View style={styles.container}>
          <Svg width="56" height="46" viewBox="0 0 56 46" fill="none">
            {/* Back Shopping Bag */}
            <Rect x="26" y="16" width="18" height="24" rx="3" fill="#C084FC" />
            {/* Back Bag Handle */}
            <Path
              d="M31 16 C31 11, 39 11, 39 16"
              stroke="#7E22CE"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Front Shopping Bag */}
            <Rect x="12" y="19" width="20" height="22" rx="3" fill="#A855F7" />
            {/* Front Bag Handle */}
            <Path
              d="M17 19 C17 13, 27 13, 27 19"
              stroke="#6B21A8"
              strokeWidth="1.5"
              fill="none"
            />
          </Svg>
        </View>
      );

    case 'Budget':
      return (
        <View style={styles.container}>
          <Svg width="56" height="46" viewBox="0 0 56 46" fill="none">
            {/* Back Coin Stack */}
            <Ellipse cx="36" cy="34" rx="9" ry="3.5" fill="#CA8A04" />
            <Ellipse cx="36" cy="29" rx="9" ry="3.5" fill="#EAB308" />
            <Ellipse cx="36" cy="24" rx="9" ry="3.5" fill="#FACC15" />
            {/* Front Big Coin Stack */}
            <Ellipse cx="22" cy="36" rx="11" ry="4" fill="#A16207" />
            <Ellipse cx="22" cy="30" rx="11" ry="4" fill="#CA8A04" />
            <Ellipse cx="22" cy="24" rx="11" ry="4" fill="#EAB308" />
            <Ellipse cx="22" cy="18" rx="11" ry="4" fill="#FDE047" />
            <Circle cx="22" cy="18" r="4" stroke="#CA8A04" strokeWidth="1" fill="none" />
          </Svg>
        </View>
      );

    case 'Relaxation':
    default:
      return (
        <View style={styles.container}>
          <Svg width="56" height="46" viewBox="0 0 56 46" fill="none">
            {/* Sand Mound */}
            <Path
              d="M4 42 Q28 32, 52 42 Z"
              fill="#FDE68A"
            />
            {/* Beach Umbrella Pole */}
            <Path d="M26 14 L20 40" stroke="#0E7490" strokeWidth="2" strokeLinecap="round" />
            {/* Beach Umbrella Canopy */}
            <Path
              d="M12 18 C14 10, 36 10, 38 18 Z"
              fill="#0284C7"
            />
            <Path
              d="M18 17 C20 11, 30 11, 32 17"
              fill="#38BDF8"
            />
            {/* Lounge Chair */}
            <Path
              d="M24 38 L32 30 L44 32 L46 38"
              stroke="#EA580C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
