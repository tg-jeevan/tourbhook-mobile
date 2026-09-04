import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Create a new password for your account</Text>
        <View style={styles.gap32} />

        <CustomTextField label="New Password" hint="••••••••" value={password} onChangeText={setPassword} obscureText />
        <View style={styles.gap20} />
        <CustomTextField label="Confirm Password" hint="••••••••" value={confirmPassword} onChangeText={setConfirmPassword} obscureText />

        <View style={styles.gap32} />
        <PrimaryButton text="Reset Password" onPressed={() => navigation.navigate('SignIn')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  gap20: { height: 20 },
  gap24: { height: 24 },
  gap32: { height: 32 }
});