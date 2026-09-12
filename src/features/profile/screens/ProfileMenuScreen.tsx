import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { useAuth } from '../../../core/auth/AuthContext';

export default function ProfileMenuScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'ProfileMenu'>>();
  const { user, logout } = useAuth();

  const menuItems = [
    { title: 'Profile Settings', route: 'ProfileSettings' as const },
    { title: 'Import Data (Beta)', route: 'ImportData' as const },
    { title: 'User Levels', route: 'UserLevels' as const },
    { title: 'Upgrade Plan', route: 'UpgradePlan' as const },
    { title: 'Payment Methods', route: 'PaymentMethods' as const, params: { planId: 'pro' } },
    { title: 'Help & Support', route: 'HelpSupport' as const },
    { title: 'Privacy Policy', route: 'PrivacyPolicy' as const },
    { title: 'Terms & Conditions', route: 'Terms' as const },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Profile Menu</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar} />
          <Text style={styles.name}>{user?.name || 'John Doe'}</Text>
          <Text style={styles.email}>{user?.email || 'john.doe@email.com'}</Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.item}
              onPress={() => navigation.navigate(item.route as any, item.params as any)}
            >
              <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.item, styles.logoutItem]}
            onPress={logout}
          >
            <Text style={[styles.itemText, styles.logoutText]}>Log Out</Text>
          </TouchableOpacity>
        </View>
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
  profileHeader: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F5F5F7', marginBottom: 12, borderWidth: 1.5, borderColor: '#E8E8E8' },
  name: { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  email: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  menu: { borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  item: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  itemText: { fontSize: 16, color: '#1A1A2E' },
  logoutItem: {
    borderBottomColor: '#FCE4EC',
  },
  logoutText: {
    color: '#E91E63',
    fontWeight: '600',
  },
});