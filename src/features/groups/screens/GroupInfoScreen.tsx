import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  MapPin,
  Calendar,
  Users,
  Bell,
  LogOut,
  ShieldCheck,
  Crown,
  Edit3,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { ConfirmationModal } from '../../../core/components/ConfirmationModal';
import { FeedbackToast } from '../../../core/components/FeedbackToast';
import { AppColors } from '../../../core/theme/colors';
import { useGroupState } from '../data/groupStore';
import { GroupMember } from '../types/groupTypes';

export default function GroupInfoScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, 'GroupInfo'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'GroupInfo'>>();
  const groupId = route.params?.groupId || 'group-paris';

  const {
    group,
    members,
    notificationsEnabled,
    toggleNotifications,
    leaveGroup,
  } = useGroupState(groupId);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const handleToggleNotifications = () => {
    const newState = toggleNotifications(groupId);
    setToastMessage(
      newState ? 'Group notifications enabled' : 'Group notifications muted',
    );
    setToastVisible(true);
  };

  const handleConfirmLeave = () => {
    leaveGroup(groupId);
    setShowLeaveModal(false);
    // Return to the main group matching / discovery screen
    navigation.navigate('GroupMatching');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Group Info</Text>
        <TouchableOpacity
          testID="group-info-edit-btn"
          style={styles.headerEditBtn}
          onPress={() => navigation.navigate('EditGroup', { groupId })}
          activeOpacity={0.7}
          accessibilityLabel="Edit Group"
        >
          <Edit3 size={20} color={AppColors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Info Header */}
        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>
              {group?.memberAvatarEmojis?.[3] || '🇫🇷'}
            </Text>
          </View>
          <Text style={styles.groupName}>{group?.name || 'Paris Explorers 🇫🇷'}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.categoryPillsRow}>
              {(group?.categories && group.categories.length > 0
                ? group.categories
                : [group?.categoryLabel || 'ADVENTURE']
              ).map((cat) => (
                <View key={cat} style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>
                    {cat.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.memberPill}>
              <Users size={12} color={AppColors.primary} />
              <Text style={styles.memberPillText}>
                {group?.memberCount || 128} members
              </Text>
            </View>
          </View>
        </View>

        {/* Description & Travel Meta */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>About</Text>
          <Text style={styles.aboutText}>
            {group?.description ||
              'Planning a Paris trip? Meet fellow travelers, share hidden gems, plan activities and connect with people exploring the city.'}
          </Text>

          <View style={styles.metaDivider} />

          {group?.location ? (
            <View style={styles.metaRow}>
              <View style={styles.metaIconCircle}>
                <MapPin size={16} color={AppColors.primary} />
              </View>
              <View style={styles.metaTextCol}>
                <Text style={styles.metaLabel}>Destination</Text>
                <Text style={styles.metaValue}>{group.location}</Text>
              </View>
            </View>
          ) : null}

          {group?.travelDates ? (
            <View style={styles.metaRow}>
              <View style={styles.metaIconCircle}>
                <Calendar size={16} color={AppColors.primary} />
              </View>
              <View style={styles.metaTextCol}>
                <Text style={styles.metaLabel}>Travel Dates</Text>
                <Text style={styles.metaValue}>{group.travelDates}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Notification Settings */}
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconCircle}>
                <Bell size={18} color={AppColors.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Group Notifications</Text>
                <Text style={styles.settingSubtitle}>
                  {notificationsEnabled ? 'Alerts on' : 'Muted'}
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#E5E0D8', true: AppColors.primaryLight }}
              thumbColor={notificationsEnabled ? AppColors.primary : '#94A3B8'}
            />
          </View>
        </View>

        {/* Members List */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeading}>Group Members</Text>
            <Text style={styles.memberCountTag}>{members.length} people</Text>
          </View>

          <View style={styles.membersContainer}>
            {members.map((member: GroupMember) => (
              <View key={member.id} style={styles.memberItem}>
                <View
                  style={[
                    styles.memberAvatarCircle,
                    { backgroundColor: member.colorScheme.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.memberAvatarText,
                      { color: member.colorScheme.text },
                    ]}
                  >
                    {member.initials}
                  </Text>
                </View>

                <View style={styles.memberTextCol}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberNameText}>
                      {member.name}
                    </Text>
                    {member.isCurrentUser ? (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>You</Text>
                      </View>
                    ) : null}
                    {member.role.toLowerCase().includes('admin') ? (
                      <Crown size={14} color="#D97706" style={styles.adminIcon} />
                    ) : null}
                  </View>
                  <Text style={styles.memberRoleText}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Community Verification Notice */}
        <View style={styles.noticeCard}>
          <ShieldCheck size={18} color={AppColors.primary} />
          <Text style={styles.noticeText}>
            All members in this group are verified Tourbhook travelers.
          </Text>
        </View>

        {/* Leave Group Button */}
        <TouchableOpacity
          style={styles.leaveGroupBtn}
          onPress={() => setShowLeaveModal(true)}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={AppColors.error} />
          <Text style={styles.leaveGroupBtnText}>Leave Group</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Leave Group Confirmation Modal */}
      <ConfirmationModal
        visible={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleConfirmLeave}
        title="Leave this group?"
        message={`You won't receive messages from ${
          group?.name || 'this group'
        } after leaving.`}
        confirmText="Leave Group"
        cancelText="Cancel"
        isDestructive={true}
      />

      {/* Feedback Toast */}
      <FeedbackToast
        visible={toastVisible}
        message={toastMessage}
        type="info"
        onDismiss={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  placeholder: {
    width: 44,
  },
  headerEditBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Hero Card */
  heroCard: {
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  groupName: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  categoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  categoryPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.primary,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  memberPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },

  /* Card */
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  memberCountTag: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 22,
  },
  metaDivider: {
    height: 1,
    backgroundColor: AppColors.borderLight,
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  metaIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaTextCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginTop: 1,
  },

  /* Settings */
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 2,
  },

  /* Members List */
  membersContainer: {
    gap: 14,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  memberTextCol: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  youBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  youBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EA580C',
  },
  adminIcon: {
    marginLeft: 2,
  },
  memberRoleText: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 2,
  },

  /* Notice */
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: AppColors.primaryDark,
    lineHeight: 18,
    fontWeight: '500',
  },

  /* Leave Group */
  leaveGroupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  leaveGroupBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.error,
  },
});
