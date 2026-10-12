import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  MapPin,
  Calendar,
  Users,
  MessageCircle,
  Check,
  ShieldCheck,
  Flame,
  TrendingUp,
  Sparkles,
  Share2,
  Edit3,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';
import { useGroupState } from '../data/groupStore';
import { GroupMember } from '../types/groupTypes';
import { useAuth } from '../../../core/auth/AuthContext';
import { useSubscription } from '../../profile/data/subscriptionStore';
import { GroupAccessBadges } from '../components/GroupAccessBadges';
import { GroupAccessGateModal } from '../components/GroupAccessGateModal';
import {
  buildGroupShareContent,
  GroupAccessBlockReason,
  getJoinGroupBlockReason,
} from '../utils/groupAccess';

export default function GroupDetailsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, 'GroupDetails'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'GroupDetails'>>();
  const groupId = route.params?.groupId || 'group-paris';

  const { group, isJoined, members, joinGroup, joinedGroupCount } =
    useGroupState(groupId);
  const { user } = useAuth();
  const { plan } = useSubscription();
  const [accessBlockReason, setAccessBlockReason] =
    useState<GroupAccessBlockReason | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!group) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Group Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Group not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleJoinOrChat = () => {
    if (!isJoined) {
      const reason = getJoinGroupBlockReason({
        group,
        isVerified: user?.isVerified === true,
        isAlreadyJoined: false,
        joinedCount: joinedGroupCount,
        plan,
      });
      if (reason) {
        setAccessBlockReason(reason);
        return;
      }
      joinGroup(groupId);
    }
    // Navigate directly into the Group Chat screen
    navigation.navigate('GroupChat', { groupId });
  };

  const handleShareGroup = async () => {
    if (!group || isSharing) return;
    const shareContent = buildGroupShareContent(group);
    if (!shareContent) {
      Alert.alert(
        'Invite link unavailable',
        'This group does not have a shareable invitation link yet.',
      );
      return;
    }
    setIsSharing(true);
    try {
      await Share.share(shareContent);
    } catch {
      Alert.alert('Unable to share', 'Please try sharing this group again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Group Details</Text>
        <View style={styles.headerActionsRow}>
          <TouchableOpacity
            testID="edit-group-header-btn"
            style={styles.headerActionBtn}
            onPress={() => navigation.navigate('EditGroup', { groupId })}
            activeOpacity={0.7}
            accessibilityLabel="Edit Group"
          >
            <Edit3 size={19} color={AppColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={handleShareGroup}
            disabled={isSharing}
            activeOpacity={0.7}
            accessibilityLabel="Share Group"
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={AppColors.primary} />
            ) : (
              <Share2 size={20} color={AppColors.textSecondary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={handleJoinOrChat}
            activeOpacity={0.7}
            accessibilityLabel="Group Chat"
          >
            <MessageCircle size={22} color={AppColors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.categoryBadgesRow}>
              {(group.categories && group.categories.length > 0
                ? group.categories
                : [group.categoryLabel || 'TRAVEL']
              ).map((cat) => (
                <View key={cat} style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {cat.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>

            {group.statusType === 'popular' && (
              <View style={[styles.statusBadge, { backgroundColor: '#FFF1EE' }]}>
                <Flame size={12} color={AppColors.accent} />
                <Text style={[styles.statusBadgeText, { color: AppColors.accent }]}>
                  Popular
                </Text>
              </View>
            )}

            {group.statusType === 'active' && (
              <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
                <View style={styles.greenDot} />
                <Text style={[styles.statusBadgeText, { color: '#16A34A' }]}>
                  Active
                </Text>
              </View>
            )}

            {group.statusType === 'trending' && (
              <View style={[styles.statusBadge, { backgroundColor: '#E0F2FE' }]}>
                <TrendingUp size={12} color="#0284C7" />
                <Text style={[styles.statusBadgeText, { color: '#0284C7' }]}>
                  Trending
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.groupTitle}>{group.name}</Text>
          <GroupAccessBadges group={group} />

          {/* Location & Dates */}
          <View style={styles.metaRow}>
            {group.location ? (
              <View style={styles.metaItem}>
                <MapPin size={15} color={AppColors.primary} />
                <Text style={styles.metaText}>{group.location}</Text>
              </View>
            ) : null}

            {group.travelDates ? (
              <View style={styles.metaItem}>
                <Calendar size={15} color={AppColors.primary} />
                <Text style={styles.metaText}>{group.travelDates}</Text>
              </View>
            ) : null}
          </View>

          {/* Member Count & Capacity Bar */}
          <View style={styles.memberStatsBox}>
            <View style={styles.memberStatsRow}>
              <View style={styles.memberIconCount}>
                <Users size={16} color={AppColors.primary} />
                <Text style={styles.memberCountBold}>
                  {group.memberCount} members
                </Text>
              </View>
              <Text style={styles.maxMemberText}>Max {group.maxMembers}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(
                      100,
                      (group.memberCount / group.maxMembers) * 100,
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>About Group</Text>
          <Text style={styles.descriptionText}>
            {group.description ||
              'Meet fellow travelers, share hidden gems, plan activities and connect with people exploring this destination.'}
          </Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {group.tags.map(tag => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagPillText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Group Guidelines Card */}
        <View style={styles.guidelinesCard}>
          <View style={styles.guidelinesIcon}>
            <ShieldCheck size={20} color={AppColors.primary} />
          </View>
          <View style={styles.guidelinesTextCol}>
            <Text style={styles.guidelinesTitle}>
              {group.requiresKyc ? 'Verified Travel Community' : 'Travel Community'}
            </Text>
            <Text style={styles.guidelinesDesc}>
              {group.requiresKyc
                ? 'All members must complete KYC. Be respectful and share genuine travel recommendations.'
                : 'Be respectful, share genuine travel recommendations, and enjoy planning adventures together.'}
            </Text>
          </View>
        </View>

        {/* Members Preview */}
        <View style={styles.sectionCard}>
          <View style={styles.membersSectionHeader}>
            <Text style={styles.sectionHeading}>Community Members</Text>
            <Text style={styles.viewAllText}>{members.length} active</Text>
          </View>

          <View style={styles.membersList}>
            {members.slice(0, 4).map((member: GroupMember) => (
              <View key={member.id} style={styles.memberRow}>
                <View
                  style={[
                    styles.memberAvatar,
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
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>
                    {member.name} {member.isCurrentUser ? '(You)' : ''}
                  </Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        {isJoined ? (
          <View style={styles.joinedActionRow}>
            <View style={styles.joinedPill}>
              <Check size={16} color={AppColors.success} strokeWidth={2.5} />
              <Text style={styles.joinedPillText}>Joined</Text>
            </View>
            <TouchableOpacity
              style={styles.openChatBtn}
              onPress={() => navigation.navigate('GroupChat', { groupId })}
              activeOpacity={0.8}
            >
              <MessageCircle size={18} color={AppColors.white} />
              <Text style={styles.openChatBtnText}>Open Group Chat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.joinPrimaryBtn}
            onPress={handleJoinOrChat}
            activeOpacity={0.8}
          >
            <Sparkles size={18} color={AppColors.white} />
            <Text style={styles.joinPrimaryBtnText}>Join Group</Text>
          </TouchableOpacity>
        )}
      </View>
      <GroupAccessGateModal
        reason={accessBlockReason}
        plan={plan}
        onClose={() => setAccessBlockReason(null)}
        onPrimaryAction={reason => {
          setAccessBlockReason(null);
          if (reason === 'join_limit_reached' && plan === 'free') {
            navigation.navigate('UpgradePlan');
          }
        }}
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
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerActionBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: AppColors.textMuted,
  },

  /* Hero Card */
  heroCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  categoryBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.primary,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  memberStatsBox: {
    backgroundColor: '#FAF7F2',
    borderRadius: 12,
    padding: 12,
  },
  memberStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberIconCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberCountBold: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  maxMemberText: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E0D8',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 3,
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 22,
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  tagPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primary,
  },

  /* Guidelines Card */
  guidelinesCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 16,
    gap: 12,
  },
  guidelinesIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidelinesTextCol: {
    flex: 1,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  guidelinesDesc: {
    fontSize: 12,
    color: '#15803D',
    lineHeight: 18,
  },

  /* Members Section */
  membersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '600',
  },
  membersList: {
    gap: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  memberRole: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 1,
  },

  /* Bottom Bar */
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: AppColors.surface,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  joinPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    gap: 8,
  },
  joinPrimaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.white,
  },
  joinedActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  joinedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  joinedPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.successDark,
  },
  openChatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  openChatBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.white,
  },
});
