import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { AppLogo } from '../../../core/components/AppLogo';
import { useAuth } from '../../../core/auth/AuthContext';
import { useLanguagePreference } from '../data/languageStore';
import { useSubscription } from '../data/subscriptionStore';
import { getExplorerLevel, getUserVerificationStatus } from '../data/userLevelStore';
import { AppColors } from '../../../core/theme/colors';

export default function ProfileMenuScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'ProfileMenu'>>();
  const { user, logout } = useAuth();
  const { currentLanguage } = useLanguagePreference();
  const { isPremium } = useSubscription();

  const userLevel = getExplorerLevel(user, isPremium);
  const isVerified = getUserVerificationStatus(user);

  const menuItems = [
    { title: 'Connected Instagram Profile', route: 'InstagramConnect' as const },
    {
      title: 'Language',
      route: 'Language' as const,
      value: currentLanguage.nativeName,
    },
    { title: 'Profile Settings', route: 'ProfileSettings' as const },
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
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {user?.name || 'John Doe'}
            </Text>
            {isVerified && (
              <CheckCircle2
                size={18}
                color="#FFFFFF"
                fill={AppColors.success}
                style={styles.verifiedBadge}
              />
            )}
          </View>
          <Text style={styles.level} numberOfLines={1}>
            {userLevel}
          </Text>

          {/* Official Tour Bhook Logo (Transparent) */}
          <AppLogo size="compact" containerStyle={styles.logoWrapper} />
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.item}
              onPress={() => navigation.navigate(item.route as any, item.params as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.itemText}>{item.title}</Text>
              <View style={styles.itemRight}>
                {item.value ? <Text style={styles.itemValue}>{item.value}</Text> : null}
                <ChevronRight size={18} color={AppColors.textMuted} />
              </View>
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
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.surface,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: AppColors.border,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    maxWidth: '100%',
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
    flexShrink: 1,
    textAlign: 'center',
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  level: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  logoWrapper: {
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  menu: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  itemText: { fontSize: 15, color: AppColors.textPrimary, fontWeight: '500' },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemValue: {
    fontSize: 14,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: AppColors.error,
    fontWeight: '600',
  },
});