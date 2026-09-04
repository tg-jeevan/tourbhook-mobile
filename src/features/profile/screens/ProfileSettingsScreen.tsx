import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function ProfileSettingsScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <CustomTextField label="Full Name" hint="John Doe" value={name} onChangeText={setName} />
        <View style={styles.gap20} />
        <CustomTextField label="Email" hint="your@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <View style={styles.gap32} />
        <PrimaryButton text="Save Changes" onPressed={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  gap20: { height: 20 },
  gap32: { height: 32 }
});