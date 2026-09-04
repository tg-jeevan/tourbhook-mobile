import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>>();
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email to reset your password</Text>
        <View style={styles.gap32} />

        <CustomTextField label="Email" hint="your@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <View style={styles.gap32} />
        <PrimaryButton text="Send Reset Link" onPressed={() => navigation.navigate('OTPVerification', { email })} />
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