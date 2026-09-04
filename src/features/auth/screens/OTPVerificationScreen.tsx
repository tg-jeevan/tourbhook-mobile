import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function OTPVerificationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'OTPVerification'>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'OTPVerification'>>();
  const [otp, setOtp] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Enter code sent to {route.params?.email || 'email'}</Text>
        <View style={styles.gap32} />

        <CustomTextField label="Verification Code" hint="1234" value={otp} onChangeText={setOtp} keyboardType="number-pad" />
        <View style={styles.gap32} />
        <PrimaryButton text="Verify" onPressed={() => navigation.navigate('ResetPassword', { email: route.params?.email, otp })} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  gap24: { height: 24 },
  gap32: { height: 32 }
});