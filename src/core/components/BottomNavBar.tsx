import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Compass, Users, Briefcase, User, LucideIcon } from 'lucide-react-native';
import { AppStackParamList } from '../navigation/types';
import { AppColors } from '../theme/colors';

export type BottomNavTab = 'explore' | 'trips' | 'groups' | 'profile';

interface TabConfig {
  key: BottomNavTab;
  label: string;
  Icon: LucideIcon;
  onPress: (navigation: NativeStackNavigationProp<AppStackParamList>) => void;
}

const TABS: TabConfig[] = [
  {
    key: 'explore',
    label: 'Explore',
    Icon: Compass,
    onPress: navigation => navigation.navigate('ExploreFeed'),
  },
  {
    key: 'trips',
    label: 'My Trips',
    Icon: Briefcase,
    onPress: navigation => navigation.navigate('MyItineraries'),
  },
  {
    key: 'groups',
    label: 'Groups',
    Icon: Users,
    onPress: navigation => navigation.navigate('GroupMatching'),
  },
  {
    key: 'profile',
    label: 'Profile',
    Icon: User,
    onPress: navigation => navigation.navigate('ProfileMenu'),
  },
];

interface BottomNavBarProps {
  active?: BottomNavTab;
}

export function BottomNavBar({ active }: BottomNavBarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View
      testID="bottom-nav-bar"
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      {TABS.map(tab => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            testID={`tab-${tab.key}`}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => tab.onPress(navigation)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <View testID={`icon-container-${tab.key}`} style={styles.iconContainer}>
              {isActive ? (
                <View style={styles.activeIconCircle}>
                  <tab.Icon size={18} color={AppColors.textOnPrimary} strokeWidth={2.25} />
                </View>
              ) : (
                <View style={styles.inactiveIconSlot}>
                  <tab.Icon size={20} color={AppColors.textMuted} strokeWidth={1.75} />
                </View>
              )}
            </View>
            <Text
              style={[styles.label, isActive && styles.labelActive]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
    paddingTop: 8,
    backgroundColor: AppColors.surface,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  activeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveIconSlot: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: AppColors.textMuted,
    textAlign: 'center',
    includeFontPadding: false,
  },
  labelActive: {
    color: AppColors.primary,
    fontWeight: '700',
  },
});