import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Users,
  MapPin,
  Calendar,
  Mountain,
  Landmark,
  Utensils,
  Palmtree,
  Trees,
  Footprints,
  Camera,
  Car,
  Backpack,
  Sparkles,
  Globe2,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';
import { ConfirmationModal } from '../../../core/components/ConfirmationModal';
import { useSubscription } from '../../profile/data/subscriptionStore';
import { groupStore } from '../data/groupStore';
import { GroupVisibility } from '../types/groupTypes';
import { getCreateGroupBlockReason, getGroupLimits } from '../utils/groupAccess';

export const GROUP_CATEGORIES = [
  { name: 'Adventure', icon: Mountain, color: '#0284C7' },
  { name: 'Culture', icon: Landmark, color: '#EA580C' },
  { name: 'Food', icon: Utensils, color: '#D97706' },
  { name: 'Beach', icon: Palmtree, color: '#059669' },
  { name: 'Nature', icon: Trees, color: '#16A34A' },
  { name: 'Hiking', icon: Footprints, color: '#0D9488' },
  { name: 'Photography', icon: Camera, color: '#8B5CF6' },
  { name: 'Road Trips', icon: Car, color: '#E11D48' },
  { name: 'Backpacking', icon: Backpack, color: '#6366F1' },
] as const;

export type GroupCategoryName = (typeof GROUP_CATEGORIES)[number]['name'];

const MEMBER_LIMITS = [4, 6, 8, 12, 16];

export function getInitialSelectedCategories(existingGroup?: {
  categories?: string[];
  tags?: string[];
  categoryLabel?: string;
}): string[] {
  if (!existingGroup) {
    return ['Adventure'];
  }

  const matches = GROUP_CATEGORIES.filter(cat => {
    const lower = cat.name.toLowerCase();
    const matchesCategory = existingGroup.categories?.some(
      c => c.toLowerCase() === lower,
    );
    const matchesTag = existingGroup.tags?.some(
      t => t.toLowerCase() === lower,
    );
    const matchesLabel = existingGroup.categoryLabel
      ? existingGroup.categoryLabel.toLowerCase().includes(lower)
      : false;

    return Boolean(matchesCategory || matchesTag || matchesLabel);
  }).map(c => c.name);

  return matches.length > 0 ? matches : ['Adventure'];
}

export default function CreateGroupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, any>>();
  const groupId = route.params?.groupId as string | undefined;
  const isEditMode = Boolean(groupId);

  const existingGroup = groupId ? groupStore.getGroupById(groupId) : undefined;
  const { plan } = useSubscription();

  const [name, setName] = useState(existingGroup?.name || '');
  const [destination, setDestination] = useState(
    existingGroup?.location && existingGroup.location !== 'Global'
      ? existingGroup.location
      : '',
  );
  const [description, setDescription] = useState(existingGroup?.description || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    getInitialSelectedCategories(existingGroup),
  );
  const [travelDates, setTravelDates] = useState(
    existingGroup?.travelDates && existingGroup.travelDates !== 'Flexible Dates'
      ? existingGroup.travelDates
      : '',
  );
  const [maxMembers, setMaxMembers] = useState(existingGroup?.maxMembers || 8);
  const [visibility, setVisibility] = useState<GroupVisibility>(
    existingGroup?.visibility || 'public',
  );
  const [requiresKyc, setRequiresKyc] = useState(
    existingGroup?.requiresKyc || false,
  );

  const [errorName, setErrorName] = useState<string | null>(null);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateLimit, setShowCreateLimit] = useState(false);

  const handleToggleCategory = (catName: string) => {
    setSelectedCategories(prev => {
      const isSelected = prev.includes(catName);
      const next = isSelected
        ? prev.filter(c => c !== catName)
        : [...prev, catName];
      if (errorCategory && next.length > 0) {
        setErrorCategory(null);
      }
      return next;
    });
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    let hasError = false;

    if (!trimmedName) {
      setErrorName('Please enter a group name');
      hasError = true;
    }

    if (selectedCategories.length === 0) {
      setErrorCategory('Please select at least one category');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (
      !isEditMode &&
      getCreateGroupBlockReason(plan, groupStore.getCreatedGroupCount())
    ) {
      setShowCreateLimit(true);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && groupId) {
        groupStore.updateGroup(groupId, {
          name: trimmedName,
          destination: destination.trim() || undefined,
          description: description.trim() || undefined,
          categories: selectedCategories,
          category: selectedCategories[0],
          travelDates: travelDates.trim() || undefined,
          maxMembers,
          visibility,
          requiresKyc,
        });
      } else {
        groupStore.createGroup({
          name: trimmedName,
          destination: destination.trim() || undefined,
          description: description.trim() || undefined,
          categories: selectedCategories,
          category: selectedCategories[0],
          travelDates: travelDates.trim() || undefined,
          maxMembers,
          visibility,
          requiresKyc,
        });
      }

      navigation.goBack();
    } catch (err: any) {
      setErrorName(err?.message || 'Failed to save group');
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Group' : 'Create Travel Group'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Callout */}
          <View style={styles.heroCallout}>
            <View style={styles.heroIconCircle}>
              <Sparkles size={22} color={AppColors.primary} />
            </View>
            <View style={styles.heroTextCol}>
              <Text style={styles.heroCalloutTitle}>
                {isEditMode ? 'Update Travel Community' : 'Start a Travel Community'}
              </Text>
              <Text style={styles.heroCalloutSubtitle}>
                {isEditMode
                  ? 'Update destination, itinerary dates, categories, or group capacity.'
                  : 'Bring travelers together for your destination, itinerary, or shared interest.'}
              </Text>
            </View>
          </View>

          {/* Group Name (Required) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Group Name <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              testID="group-name-input"
              style={[styles.textInput, !!errorName && styles.textInputError]}
              placeholder="e.g. Kyoto Food Crawlers, Swiss Alps Hikers"
              placeholderTextColor={AppColors.textMuted}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errorName) setErrorName(null);
              }}
              autoFocus={!isEditMode}
            />
            {!!errorName && <Text style={styles.errorText}>{errorName}</Text>}
          </View>

          {/* Destination */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Destination</Text>
            <View style={styles.inputWithIconRow}>
              <MapPin size={18} color={AppColors.textMuted} style={styles.inputIcon} />
              <TextInput
                testID="group-destination-input"
                style={styles.textInputWithIcon}
                placeholder="e.g. Kyoto, Japan or Central Europe"
                placeholderTextColor={AppColors.textMuted}
                value={destination}
                onChangeText={setDestination}
              />
            </View>
          </View>

          {/* Travel Category / Interest */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Category / Interest <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={styles.categoryRow}>
              {GROUP_CATEGORIES.map(({ name: catName, icon: Icon, color }) => {
                const isSelected = selectedCategories.includes(catName);
                return (
                  <TouchableOpacity
                    key={catName}
                    testID={`category-chip-${catName.toLowerCase().replace(/\s+/g, '-')}`}
                    style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                    onPress={() => handleToggleCategory(catName)}
                    activeOpacity={0.75}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={`Category ${catName}`}
                  >
                    <Icon size={16} color={isSelected ? AppColors.white : color} />
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextActive,
                      ]}
                    >
                      {catName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {!!errorCategory && (
              <Text testID="category-error-text" style={styles.errorText}>
                {errorCategory}
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              testID="group-description-input"
              style={[styles.textInput, styles.textArea]}
              placeholder="Tell travelers what you plan to do, sights you want to visit, or travel styles..."
              placeholderTextColor={AppColors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Travel Dates */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Travel Dates (optional)</Text>
            <View style={styles.inputWithIconRow}>
              <Calendar size={18} color={AppColors.textMuted} style={styles.inputIcon} />
              <TextInput
                testID="group-dates-input"
                style={styles.textInputWithIcon}
                placeholder="e.g. 15 Nov – 22 Nov 2026 or Flexible"
                placeholderTextColor={AppColors.textMuted}
                value={travelDates}
                onChangeText={setTravelDates}
              />
            </View>
          </View>

          {/* Max Members */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Member Capacity</Text>
            <View style={styles.membersRow}>
              {MEMBER_LIMITS.map((limit) => {
                const isSelected = maxMembers === limit;
                return (
                  <TouchableOpacity
                    key={limit}
                    testID={`capacity-chip-${limit}`}
                    style={[styles.memberChip, isSelected && styles.memberChipActive]}
                    onPress={() => setMaxMembers(limit)}
                    activeOpacity={0.75}
                  >
                    <Users
                      size={14}
                      color={isSelected ? AppColors.white : AppColors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.memberChipText,
                        isSelected && styles.memberChipTextActive,
                      ]}
                    >
                      {limit} max
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Group Access */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Group Access</Text>
            <View style={styles.visibilityRow}>
              {(['public', 'private'] as GroupVisibility[]).map(option => {
                const isSelected = visibility === option;
                const Icon = option === 'public' ? Globe2 : LockKeyhole;
                return (
                  <TouchableOpacity
                    key={option}
                    testID={`visibility-${option}`}
                    style={[
                      styles.visibilityOption,
                      isSelected && styles.visibilityOptionActive,
                    ]}
                    onPress={() => setVisibility(option)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    activeOpacity={0.8}
                  >
                    <Icon
                      size={18}
                      color={isSelected ? AppColors.primary : AppColors.textMuted}
                    />
                    <View style={styles.visibilityTextCol}>
                      <Text style={styles.visibilityTitle}>
                        {option === 'public' ? 'Public' : 'Private'}
                      </Text>
                      <Text style={styles.visibilitySubtitle}>
                        {option === 'public'
                          ? 'Visible in Explore and group search'
                          : 'Only accessible through an invite link'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.kycRow}>
              <View style={styles.kycIconCircle}>
                <ShieldCheck size={19} color={AppColors.primary} />
              </View>
              <View style={styles.kycTextCol}>
                <Text style={styles.kycTitle}>Require KYC verification</Text>
                <Text style={styles.kycSubtitle}>
                  Only verified travelers can join this group.
                </Text>
              </View>
              <Switch
                testID="requires-kyc-switch"
                value={requiresKyc}
                onValueChange={setRequiresKyc}
                trackColor={{ false: AppColors.borderDark, true: AppColors.primaryLight }}
                thumbColor={requiresKyc ? AppColors.primary : AppColors.textLight}
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              testID="group-cancel-btn"
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.75}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="group-save-btn"
              style={[styles.createBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleSave}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <Text style={styles.createBtnText}>
                {isEditMode ? 'Save Changes' : 'Create Group'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ConfirmationModal
        visible={showCreateLimit}
        onClose={() => setShowCreateLimit(false)}
        onConfirm={() => {
          setShowCreateLimit(false);
          if (plan === 'free') {
            navigation.navigate('UpgradePlan');
          }
        }}
        title="Group creation limit reached"
        message={
          plan === 'free'
            ? `Your free plan allows ${getGroupLimits(plan).created} created groups. Upgrade to increase your allowance.`
            : `Your Voyager plan allows ${getGroupLimits(plan).created} created groups. You have reached this limit.`
        }
        confirmText={plan === 'free' ? 'View plans' : 'Okay'}
        cancelText="Not now"
        isDestructive={false}
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
    borderBottomWidth: 1,
    borderBottomColor: '#EFEAE1',
    backgroundColor: '#FAF7F2',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E3DA',
    marginBottom: 20,
  },
  heroIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTextCol: {
    flex: 1,
  },
  heroCalloutTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  heroCalloutSubtitle: {
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textSecondary,
    marginBottom: 6,
  },
  requiredStar: {
    color: AppColors.accent,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E3DA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  textInputError: {
    borderColor: AppColors.accent,
  },
  textArea: {
    height: 80,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.accent,
    marginTop: 4,
  },
  inputWithIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E3DA',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 6,
  },
  textInputWithIcon: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E3DA',
  },
  categoryChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  categoryChipTextActive: {
    color: AppColors.white,
  },
  membersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  visibilityRow: {
    gap: 8,
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E3DA',
    backgroundColor: AppColors.surface,
  },
  visibilityOptionActive: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.surfaceHighlight,
  },
  visibilityTextCol: {
    flex: 1,
  },
  visibilityTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textTransform: 'capitalize',
  },
  visibilitySubtitle: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: AppColors.textMuted,
  },
  kycRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E3DA',
    backgroundColor: AppColors.surface,
  },
  kycIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AppColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kycTextCol: {
    flex: 1,
  },
  kycTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  kycSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: AppColors.textMuted,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E3DA',
  },
  memberChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  memberChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  memberChipTextActive: {
    color: AppColors.white,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#EBE5DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  createBtn: {
    flex: 1.6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.white,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
