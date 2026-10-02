import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { useAuth } from '../../../core/auth/AuthContext';
import { AppColors } from '../../../core/theme/colors';

export default function ProfileMenuScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'ProfileMenu'>>();
  const { user, logout } = useAuth();

  const menuItems = [
    { title: 'Connected Instagram Profile', route: 'InstagramConnect' as const },
    { title: 'Notifications & Travel Alerts', route: 'Notifications' as const },
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
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: AppColors.textPrimary },
  placeholder: { width: 44 },
  content: { padding: 24 },
  profileHeader: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.surface,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: AppColors.border,
  },
  name: { fontSize: 20, fontWeight: '700', color: AppColors.textPrimary },
  email: { fontSize: 14, color: AppColors.textMuted, marginTop: 4 },
  menu: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  item: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: AppColors.borderLight },
  itemText: { fontSize: 15, color: AppColors.textPrimary, fontWeight: '500' },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: AppColors.error,
    fontWeight: '600',
  },
});