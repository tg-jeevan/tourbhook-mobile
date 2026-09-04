import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.chevron}>
        <View style={styles.chevronLineTop} />
        <View style={styles.chevronLineBottom} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  chevron: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronLineTop: {
    width: 14,
    height: 3,
    backgroundColor: '#1A1A2E',
    borderRadius: 1.5,
    transform: [{ rotate: '-45deg' }, { translateY: 2 }],
  },
  chevronLineBottom: {
    width: 14,
    height: 3,
    backgroundColor: '#1A1A2E',
    borderRadius: 1.5,
    transform: [{ rotate: '45deg' }, { translateY: -2 }],
  },
});
