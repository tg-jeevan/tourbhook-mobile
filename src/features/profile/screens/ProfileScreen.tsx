import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from '../../../core/theme/colors';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ProfileScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: AppColors.background },
  text: { fontSize: 20, fontWeight: 'bold', color: AppColors.textPrimary },
});

export default ProfileScreen;
