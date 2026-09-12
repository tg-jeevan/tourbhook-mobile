import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Home, Compass, Users, Backpack, User, LucideIcon } from 'lucide-react-native';
import { AppStackParamList } from '../navigation/types';

export type BottomNavTab = 'home' | 'explore' | 'groups' | 'trips' | 'profile';

const GREEN = '#1FAE5D';
const TEXT_MUTED = '#8E8E93';

interface TabConfig {
  key: BottomNavTab;
  label: string;
  Icon: LucideIcon;
  onPress: (navigation: NativeStackNavigationProp<AppStackParamList>) => void;
}

const TABS: TabConfig[] = [
  {
    key: 'home',
    label: 'Home',
    Icon: Home,
    onPress: navigation => navigation.navigate('MyItineraries'),
  },
  {
    key: 'explore',
    label: 'Explore',
    Icon: Compass,
    onPress: navigation => navigation.navigate('AddPlaces', { tripId: '1' }),
  },
  {
    key: 'groups',
    label: 'Groups',
    Icon: Users,
    onPress: navigation => navigation.navigate('GroupMatching'),
  },
  {
    key: 'trips',
    label: 'Trips',
    Icon: Backpack,
    onPress: navigation => navigation.navigate('MyItineraries'),
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

  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => tab.onPress(navigation)}
          >
            {isActive ? (
              <View style={styles.activeIconCircle}>
                <tab.Icon size={18} color="#FFFFFF" strokeWidth={2.25} />
              </View>
            ) : (
              <tab.Icon size={20} color={TEXT_MUTED} strokeWidth={1.75} />
            )}
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  activeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: { fontSize: 11, color: TEXT_MUTED },
  labelActive: { color: GREEN, fontWeight: '700' },
});