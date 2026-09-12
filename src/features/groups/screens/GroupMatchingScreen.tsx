import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { CATEGORY_FILTERS, CategoryFilter, TravelGroup } from '../types/groupTypes';
import { useGroupMatches } from '../hooks/useGroupMatches';
import { useVerificationStatus } from '../hooks/useVerificationStatus';


const GREEN = '#1FAE5D';
const GREEN_LIGHT = '#E6F7EC';
const TEXT_DARK = '#1A1A2E';
const TEXT_MUTED = '#8E8E93';
const RED = '#E53935';
const RED_LIGHT = '#FDECEA';
const AMBER = '#F2A93B';
const AMBER_LIGHT = '#FEF6E7';

export default function GroupMatchingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'GroupMatching'>>();

  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const { groups, isLoading, joinedGroupIds, joinGroup } = useGroupMatches(activeCategory);
  const verificationStatus = useVerificationStatus();

  const visibleGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  const renderGroupCard = (group: TravelGroup) => {
    const isJoined = joinedGroupIds.includes(group.id);

    return (
      <View key={group.id} style={styles.groupCard}>
        <View style={styles.groupCardTop}>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{group.name}</Text>
            <View style={styles.groupMetaRow}>
              <View style={styles.avatarStack}>
                {group.memberAvatarEmojis.map((emoji, index) => (
                  <View
                    key={`${group.id}-avatar-${index}`}
                    style={[styles.avatarCircle, index > 0 && styles.avatarOverlap]}
                  >
                    <Text style={styles.avatarEmoji}>{emoji}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.memberCountText}>
                {group.memberCount}/{group.maxMembers} members
              </Text>
            </View>
            <View style={styles.tagRow}>
              {group.tags.map(tag => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.joinButton, isJoined && styles.joinedButton]}
            activeOpacity={0.85}
            onPress={() => joinGroup(group.id)}
            disabled={isJoined}
          >
            <Text style={[styles.joinButtonText, isJoined && styles.joinedButtonText]}>
              {isJoined ? 'Joined' : 'Join'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const verificationCardStyle =
    verificationStatus === 'verified'
      ? { backgroundColor: GREEN_LIGHT }
      : verificationStatus === 'rejected'
        ? { backgroundColor: RED_LIGHT }
        : { backgroundColor: AMBER_LIGHT };

  const verificationIconStyle =
    verificationStatus === 'verified'
      ? { backgroundColor: GREEN }
      : verificationStatus === 'rejected'
        ? { backgroundColor: RED }
        : { backgroundColor: AMBER };

  const verificationLabel =
    verificationStatus === 'verified'
      ? 'Verified'
      : verificationStatus === 'rejected'
        ? 'Rejected'
        : 'Pending';

  const verificationLabelColor =
    verificationStatus === 'verified' ? GREEN : verificationStatus === 'rejected' ? RED : AMBER;

  const verificationMessage =
    verificationStatus === 'verified'
      ? 'Your profile is verified. You can now join groups and start connecting!'
      : verificationStatus === 'rejected'
        ? 'We could not verify your profile. Please review your documents and try again.'
        : 'Your profile is being reviewed. This usually takes a few minutes.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Find Your Travel Group</Text>
          <Text style={styles.headerSubtitle}>Meet like-minded travelers</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by destination or interests..."
            placeholderTextColor={TEXT_MUTED}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORY_FILTERS.map(category => {
            const isActive = category === activeCategory;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveCategory(category)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isLoading ? (
          <Text style={styles.loadingText}>Finding groups that match your interests...</Text>
        ) : visibleGroups.length === 0 ? (
          <Text style={styles.loadingText}>No groups match your search yet.</Text>
        ) : (
          visibleGroups.map(renderGroupCard)
        )}

        <View style={[styles.verificationCard, verificationCardStyle]}>
          <Text style={styles.verificationTitle}>Verification Status</Text>
          <View style={styles.verificationStatusRow}>
            <View style={[styles.verificationIcon, verificationIconStyle]}>
              <Text style={styles.verificationIconText}>
                {verificationStatus === 'rejected' ? '✕' : '✓'}
              </Text>
            </View>
            <Text style={[styles.verificationLabel, { color: verificationLabelColor }]}>
              {verificationLabel}
            </Text>
          </View>
          <Text style={styles.verificationMessage}>{verificationMessage}</Text>
        </View>
      </ScrollView>
      <BottomNavBar active="groups" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTextBlock: { flex: 1, alignItems: 'center', paddingTop: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: TEXT_DARK },
  headerSubtitle: { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },
  headerPlaceholder: { width: 44 },

  content: { padding: 24, paddingBottom: 24 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 16,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: TEXT_DARK },

  filterRow: { gap: 8, paddingBottom: 20 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: { backgroundColor: GREEN, borderColor: GREEN },
  filterChipText: { fontSize: 13, fontWeight: '600', color: TEXT_MUTED },
  filterChipTextActive: { color: '#FFFFFF' },

  loadingText: { fontSize: 13, color: TEXT_MUTED, textAlign: 'center', paddingVertical: 24 },

  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFF2',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  groupCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  groupInfo: { flex: 1, paddingRight: 12 },
  groupName: { fontSize: 15, fontWeight: '700', color: TEXT_DARK, marginBottom: 6 },
  groupMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatarStack: { flexDirection: 'row', marginRight: 8 },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GREEN_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarOverlap: { marginLeft: -8 },
  avatarEmoji: { fontSize: 12 },
  memberCountText: { fontSize: 12, color: TEXT_MUTED },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: {
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagChipText: { fontSize: 11, color: TEXT_MUTED, fontWeight: '500' },

  joinButton: {
    backgroundColor: GREEN,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  joinedButton: { backgroundColor: '#F5F5F7', borderWidth: 1, borderColor: '#E8E8E8' },
  joinButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  joinedButtonText: { color: TEXT_MUTED },

  verificationCard: { borderRadius: 16, padding: 16, marginTop: 8 },
  verificationTitle: { fontSize: 14, fontWeight: '700', color: TEXT_DARK, marginBottom: 10 },
  verificationStatusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  verificationIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  verificationIconText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  verificationLabel: { fontSize: 14, fontWeight: '700' },
  verificationMessage: { fontSize: 12, color: TEXT_MUTED, lineHeight: 17 },
});