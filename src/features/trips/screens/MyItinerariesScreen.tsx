import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, G } from 'react-native-svg';
import {
  Bell,
  Briefcase,
  Calendar,
  Clock,
  Bookmark,
  MapPin,
  FileText,
  Users,
  ChevronRight,
  MoreVertical,
  Plus,
} from 'lucide-react-native';
import { Share } from 'react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { ConfirmationModal } from '../../../core/components/ConfirmationModal';
import { FeedbackToast } from '../../../core/components/FeedbackToast';
import { useNotificationState } from '../../notifications/data/notificationStore';
import { useSubscription, FREE_ITINERARY_LIMIT } from '../../profile/data/subscriptionStore';
import { UpgradeRequiredModal } from '../components/UpgradeRequiredModal';
import { ItineraryActionModal } from '../components/ItineraryActionModal';
import { TripQuickActionMenuModal } from '../components/TripQuickActionMenuModal';
import {
  useItineraryState,
  ItineraryTrip,
} from '../data/itineraryStore';
import {
  formatDateRange,
  formatDestinationLocation,
  generateDefaultItineraryTitle,
} from '../utils/itineraryFormatting';

export type { ItineraryTrip };

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ItineraryFilterTab = 'All' | 'Upcoming' | 'Past' | 'Saved';

export default function MyItinerariesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'MyItineraries'>>();
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotificationState();
  const { isPremium } = useSubscription();
  const {
    itineraries,
    counts,
    deleteItinerary,
    toggleSaveItinerary,
  } = useItineraryState();

  const [activeTab, setActiveTab] = useState<ItineraryFilterTab>('All');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Custom Action Modal & Delete Confirmation State
  const [actionModalItinerary, setActionModalItinerary] = useState<ItineraryTrip | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [deleteModalItinerary, setDeleteModalItinerary] = useState<ItineraryTrip | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const [showQuickActionMenu, setShowQuickActionMenu] = useState(false);

  const handleFabPress = () => {
    setShowQuickActionMenu(true);
  };

  const handleCreateTrip = () => {
    if (isPremium || itineraries.length < FREE_ITINERARY_LIMIT) {
      navigation.navigate('PlanTrip');
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleQuickCreateItinerary = () => {
    setShowQuickActionMenu(false);
    handleCreateTrip();
  };

  const handleQuickAddInstagramReel = () => {
    setShowQuickActionMenu(false);
    navigation.navigate('UGCPosting', { platform: 'instagram' } as any);
  };

  const handleQuickAddYouTubeShorts = () => {
    setShowQuickActionMenu(false);
    navigation.navigate('UGCPosting', { platform: 'youtube' } as any);
  };

  const handleQuickUpgradePlan = () => {
    setShowQuickActionMenu(false);
    navigation.navigate('UpgradePlan');
  };

  // Counts for tabs derived directly from source of truth
  const allCount = counts.all;
  const upcomingCount = counts.upcoming;
  const pastCount = counts.past;
  const savedCount = counts.saved;

  const filteredTrips = useMemo(() => {
    if (activeTab === 'Upcoming') {
      return itineraries.filter((i) => i.status === 'upcoming');
    }
    if (activeTab === 'Past') {
      return itineraries.filter((i) => i.status === 'past');
    }
    if (activeTab === 'Saved') {
      return itineraries.filter((i) => i.status === 'saved');
    }
    return itineraries;
  }, [activeTab, itineraries]);

  const handleOverflowMenu = (item: ItineraryTrip) => {
    setActionModalItinerary(item);
    setShowActionModal(true);
  };

  const handleViewDetails = (item: ItineraryTrip) => {
    setShowActionModal(false);
    navigation.navigate('TripDetails', { tripId: item.id });
  };

  const handleEditItinerary = (item: ItineraryTrip) => {
    setShowActionModal(false);
    navigation.navigate('PlanTrip', { tripId: item.id, mode: 'edit' });
  };

  const handleShare = async (item: ItineraryTrip) => {
    setShowActionModal(false);
    const titleToShare = item.customName || item.title;
    try {
      await Share.share({
        title: titleToShare,
        message: `Check out my itinerary "${titleToShare}" in ${item.location} on Tourbhook!`,
      });
    } catch {
      // Ignored
    }
  };

  const handleToggleSave = (item: ItineraryTrip) => {
    setShowActionModal(false);
    toggleSaveItinerary(item.id);
    const newSaved = item.status !== 'saved';
    setToast({
      visible: true,
      message: newSaved ? 'Saved to your collection' : 'Removed from saved trips',
      type: 'success',
    });
  };

  const handleDeleteRequest = (item: ItineraryTrip) => {
    setShowActionModal(false);
    setDeleteModalItinerary(item);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalItinerary) return;
    setIsDeleting(true);
    try {
      const success = await deleteItinerary(deleteModalItinerary.id);
      if (success) {
        setShowDeleteConfirm(false);
        setDeleteModalItinerary(null);
        setActionModalItinerary(null);
        setToast({
          visible: true,
          message: 'Itinerary deleted',
          type: 'success',
        });
      } else {
        setToast({
          visible: true,
          message: 'Failed to delete itinerary',
          type: 'error',
        });
      }
    } catch {
      setToast({
        visible: true,
        message: 'Failed to delete itinerary',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderDecorativeSvg = (theme: 'sky' | 'peach' | 'mint') => {
    if (theme === 'sky') {
      return (
        <View style={styles.svgContainer} pointerEvents="none">
          <Svg width="140" height="90" viewBox="0 0 140 90" fill="none">
            {/* Dashed flight arc */}
            <Path
              d="M10 20 C45 15, 80 35, 115 25"
              stroke="#0284C7"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
            />
            {/* Small Plane */}
            <G transform="translate(112, 20) rotate(-15)">
              <Path
                d="M0 0 L6 2 L9 0 L7.5 3.5 L10 5 L7.5 5.5 L6.5 8.5 L5 5.5 L1.5 6 L2.5 4 Z"
                fill="#0284C7"
                opacity={0.8}
              />
            </G>
          </Svg>
        </View>
      );
    }

    if (theme === 'peach') {
      return (
        <View style={styles.svgContainer} pointerEvents="none">
          <Svg width="140" height="90" viewBox="0 0 140 90" fill="none">
            {/* Sparkle / sunburst rays */}
            <Path
              d="M30 35 L20 28 M30 42 L18 42 M32 50 L22 56"
              stroke="#EA580C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity={0.5}
            />
          </Svg>
        </View>
      );
    }

    // mint (Kerala birds)
    return (
      <View style={styles.svgContainer} pointerEvents="none">
        <Svg width="140" height="90" viewBox="0 0 140 90" fill="none">
          {/* Flying birds */}
          <Path
            d="M30 25 Q35 20, 40 25 Q45 20, 50 25"
            stroke="#059669"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity={0.6}
            fill="none"
          />
          <Path
            d="M15 32 Q19 28, 23 32 Q27 28, 31 32"
            stroke="#059669"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity={0.6}
            fill="none"
          />
        </Svg>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ── FIXED HEADER AREA (Title + Actions + Filter Tabs) ─────── */}
      <View style={styles.fixedHeaderContainer}>
        {/* Title + Subtitle + Notification Bell & Profile Avatar */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>My Itineraries</Text>
            <Text style={styles.headerSubtitle}>Your travel plans, all in one place</Text>
          </View>

          <View style={styles.headerActionsRow}>
            {/* Notification Bell */}
            <TouchableOpacity
              style={styles.bellButton}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
              accessibilityLabel="Notifications"
            >
              <Bell size={20} color={AppColors.textPrimary} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile Circle with Avatar Initial */}
            <TouchableOpacity
              style={styles.profileAvatarBtn}
              onPress={() => navigation.navigate('ProfileMenu')}
              activeOpacity={0.7}
            >
              <Text style={styles.profileAvatarInitial}>S</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── FILTER TABS ROW (Horizontally Scrollable) ────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {/* All */}
          <TouchableOpacity
            style={[styles.filterChip, activeTab === 'All' && styles.filterChipActive]}
            onPress={() => setActiveTab('All')}
            activeOpacity={0.8}
          >
            <Briefcase
              size={14}
              color={activeTab === 'All' ? AppColors.white : AppColors.textPrimary}
            />
            <Text
              style={[styles.filterChipText, activeTab === 'All' && styles.filterChipTextActive]}
            >
              All ({allCount})
            </Text>
          </TouchableOpacity>

          {/* Upcoming */}
          <TouchableOpacity
            style={[styles.filterChip, activeTab === 'Upcoming' && styles.filterChipActive]}
            onPress={() => setActiveTab('Upcoming')}
            activeOpacity={0.8}
          >
            <Calendar
              size={14}
              color={activeTab === 'Upcoming' ? AppColors.white : AppColors.textPrimary}
            />
            <Text
              style={[
                styles.filterChipText,
                activeTab === 'Upcoming' && styles.filterChipTextActive,
              ]}
            >
              Upcoming ({upcomingCount})
            </Text>
          </TouchableOpacity>

          {/* Past */}
          <TouchableOpacity
            style={[styles.filterChip, activeTab === 'Past' && styles.filterChipActive]}
            onPress={() => setActiveTab('Past')}
            activeOpacity={0.8}
          >
            <Clock
              size={14}
              color={activeTab === 'Past' ? AppColors.white : AppColors.textPrimary}
            />
            <Text
              style={[styles.filterChipText, activeTab === 'Past' && styles.filterChipTextActive]}
            >
              Past ({pastCount})
            </Text>
          </TouchableOpacity>

          {/* Saved */}
          <TouchableOpacity
            style={[styles.filterChip, activeTab === 'Saved' && styles.filterChipActive]}
            onPress={() => setActiveTab('Saved')}
            activeOpacity={0.8}
          >
            <Bookmark
              size={14}
              color={activeTab === 'Saved' ? AppColors.white : AppColors.textPrimary}
            />
            <Text
              style={[styles.filterChipText, activeTab === 'Saved' && styles.filterChipTextActive]}
            >
              Saved ({savedCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ── SCROLLABLE ITINERARY CARDS LIST ───────────────────────── */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredTrips.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyIconCircle}>
              <Bookmark size={28} color={AppColors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} itineraries</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'Saved'
                ? 'Save your favorite trip plans to easily revisit them anytime.'
                : 'Create or explore itineraries to start planning your next travel adventure.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyPlanBtn}
              onPress={() => navigation.navigate('PlanTrip')}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyPlanBtnText}>+ Plan a New Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredTrips.map((item) => {
            const isUpcoming = item.status === 'upcoming';
            const isPast = item.status === 'past';
            const displayTitle =
              item.customName ||
              item.title ||
              generateDefaultItineraryTitle(item.destination, item.customName);
            const displayLocation = formatDestinationLocation(
              item.location || item.destination
            );
            const displayDates =
              item.startDate && item.endDate
                ? formatDateRange(item.startDate, item.endDate)
                : formatDateRange(item.dates);

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.itineraryCard}
                onPress={() => handleViewDetails(item)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`${displayTitle}, ${displayLocation}, ${displayDates}`}
              >
                {/* TOP HALF: LEFT INFO + RIGHT IMAGE */}
                <View style={styles.cardTopArea}>
                  {/* Left Column */}
                  <View style={styles.cardLeftCol}>
                    {/* Status Badge */}
                    {isUpcoming && (
                      <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
                        <Calendar size={12} color="#059669" />
                        <Text style={[styles.statusBadgeText, { color: '#059669' }]}>
                          Upcoming
                        </Text>
                      </View>
                    )}

                    {isPast && (
                      <View style={[styles.statusBadge, { backgroundColor: '#F1F5F9' }]}>
                        <Clock size={12} color="#64748B" />
                        <Text style={[styles.statusBadgeText, { color: '#64748B' }]}>Past</Text>
                      </View>
                    )}

                    {item.status === 'saved' && (
                      <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
                        <Bookmark size={12} color="#D97706" />
                        <Text style={[styles.statusBadgeText, { color: '#D97706' }]}>Saved</Text>
                      </View>
                    )}

                    {/* Itinerary Title */}
                    <Text style={styles.cardTripTitle} numberOfLines={1}>
                      {displayTitle}
                    </Text>

                    {/* Location Row */}
                    <View style={styles.infoLineRow}>
                      <MapPin size={13} color={AppColors.textPrimary} />
                      <Text style={styles.locationText}>{displayLocation}</Text>
                    </View>

                    {/* Dates Row */}
                    <View style={styles.infoLineRow}>
                      <Calendar size={13} color={AppColors.textMuted} />
                      <Text style={styles.datesText}>{displayDates}</Text>
                    </View>
                  </View>

                  {/* Right Column: Destination Arch Photo + Decorative SVGs */}
                  <View style={styles.cardRightCol}>
                    {/* Soft pastel background */}
                    <View
                      style={[
                        styles.rightPastelBg,
                        {
                          backgroundColor:
                            item.theme === 'sky'
                              ? '#E0F2FE'
                              : item.theme === 'peach'
                              ? '#FFEDD5'
                              : '#DCFCE7',
                        },
                      ]}
                    />

                    {/* SVG Flight/Sparkle/Bird Decoration */}
                    {renderDecorativeSvg(item.theme)}

                    {/* Destination Arch Photo */}
                    <View style={styles.destinationArchWrap}>
                      <Image source={{ uri: item.imageUri }} style={styles.destinationArchImg} />
                    </View>

                    {/* Top Right Overflow Menu Button */}
                    <TouchableOpacity
                      style={styles.overflowBtn}
                      onPress={() => handleOverflowMenu(item)}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={`Options for ${displayTitle}`}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MoreVertical size={18} color={AppColors.textPrimary} />
                    </TouchableOpacity>

                    {/* Circular Arrow Navigation Affordance Indicator */}
                    <View
                      style={styles.circularArrowBtn}
                      pointerEvents="none"
                      accessibilityElementsHidden={true}
                      importantForAccessibility="no-hide-descendants"
                    >
                      <ChevronRight size={18} color={AppColors.textPrimary} />
                    </View>
                  </View>
                </View>

                {/* BOTTOM HALF: THREE STATISTICS CHIPS */}
                <View style={styles.statsRow}>
                  {/* Places */}
                  <View style={styles.statChip}>
                    <View style={[styles.statIconCircle, { backgroundColor: '#FFE4E6' }]}>
                      <MapPin size={14} color="#E11D48" />
                    </View>
                    <View style={styles.statTextCol}>
                      <Text style={styles.statNumber}>{item.placesCount}</Text>
                      <Text style={styles.statLabel}>Places</Text>
                    </View>
                  </View>

                  {/* Activities */}
                  <View style={styles.statChip}>
                    <View style={[styles.statIconCircle, { backgroundColor: '#E0F2FE' }]}>
                      <FileText size={14} color="#0284C7" />
                    </View>
                    <View style={styles.statTextCol}>
                      <Text style={styles.statNumber}>{item.activitiesCount}</Text>
                      <Text style={styles.statLabel}>Activities</Text>
                    </View>
                  </View>

                  {/* Travelers */}
                  <View style={styles.statChip}>
                    <View style={[styles.statIconCircle, { backgroundColor: '#F3E8FF' }]}>
                      <Users size={14} color="#7C3AED" />
                    </View>
                    <View style={styles.statTextCol}>
                      <Text style={styles.statNumber}>{item.travelersCount}</Text>
                      <Text style={styles.statLabel}>Travelers</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* ── FLOATING ADD (+) BUTTON ──────────────────────────────── */}
      <TouchableOpacity
        style={[styles.floatingAddBtn, { bottom: insets.bottom + 70 }]}
        onPress={handleFabPress}
        activeOpacity={0.85}
        accessibilityLabel="Create Itinerary"
        testID="trips-fab-button"
      >
        <Plus size={26} color={AppColors.white} />
      </TouchableOpacity>

      {/* ── QUICK-ACTION MENU (What would you like to do?) ──────── */}
      <TripQuickActionMenuModal
        visible={showQuickActionMenu}
        onClose={() => setShowQuickActionMenu(false)}
        onCreateItinerary={handleQuickCreateItinerary}
        onAddInstagramReel={handleQuickAddInstagramReel}
        onAddYouTubeShorts={handleQuickAddYouTubeShorts}
        onUpgradePlan={handleQuickUpgradePlan}
      />

      {/* ── UPGRADE REQUIRED MODAL (3-TRIP LIMIT) ────────────────── */}
      <UpgradeRequiredModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          navigation.navigate('UpgradePlan');
        }}
        itineraryCount={itineraries.length}
        maxLimit={FREE_ITINERARY_LIMIT}
      />

      {/* ── ITINERARY ACTION MODAL (Custom Tourbhook Modal) ─────── */}
      <ItineraryActionModal
        visible={showActionModal}
        itinerary={actionModalItinerary}
        onClose={() => setShowActionModal(false)}
        onViewDetails={handleViewDetails}
        onShare={handleShare}
        onToggleSave={handleToggleSave}
        onEdit={handleEditItinerary}
      />

      {/* ── DELETE CONFIRMATION MODAL ────────────────────────────── */}
      <ConfirmationModal
        visible={showDeleteConfirm}
        onClose={() => {
          if (!isDeleting) setShowDeleteConfirm(false);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete itinerary?"
        message={`Are you sure you want to delete ${
          deleteModalItinerary?.customName || deleteModalItinerary?.title || 'this itinerary'
        }? This action cannot be undone.`}
        confirmText="Delete Itinerary"
        cancelText="Cancel"
        isDestructive={true}
        loading={isDeleting}
      />

      {/* ── TOAST FEEDBACK ────────────────────────────────────────── */}
      <FeedbackToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      {/* ── BOTTOM NAVIGATION (My Trips active) ─────────────────── */}
      <BottomNavBar active="trips" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  fixedHeaderContainer: {
    backgroundColor: '#FAF7F2',
    zIndex: 10,
  },
  listContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 90,
  },

  /* ── HEADER ─────────────────────────────────────────────────────── */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  headerTitleCol: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.textMuted,
    lineHeight: 18,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  notifBadge: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: AppColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: AppColors.white,
  },
  notifBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: AppColors.white,
  },
  profileAvatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  profileAvatarInitial: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.primary,
  },

  /* ── FILTER TABS ────────────────────────────────────────────────── */
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  filterChipTextActive: {
    color: AppColors.white,
  },

  /* ── ITINERARY CARDS ────────────────────────────────────────────── */
  itineraryCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 16,
    marginBottom: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardTopArea: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    minHeight: 130,
  },
  cardLeftCol: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardTripTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  infoLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  datesText: {
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.textMuted,
  },

  /* Right Column: Arch Image + Decor */
  cardRightCol: {
    width: 145,
    height: 135,
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightPastelBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 140,
    borderRadius: 20,
    opacity: 0.45,
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  destinationArchWrap: {
    width: 115,
    height: 125,
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 60,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: AppColors.white,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  destinationArchImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overflowBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  circularArrowBtn: {
    position: 'absolute',
    bottom: 6,
    left: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 5,
  },

  /* ── STATS ROW ──────────────────────────────────────────────────── */
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3EFE8',
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 6,
  },
  statIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextCol: {
    flex: 1,
  },
  statNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: AppColors.textMuted,
    fontWeight: '600',
  },

  /* ── EMPTY STATE ────────────────────────────────────────────────── */
  emptyStateCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 28,
    alignItems: 'center',
    marginTop: 12,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  emptySubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyPlanBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
  },
  emptyPlanBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.white,
  },

  /* ── FLOATING ADD BUTTON ────────────────────────────────────────── */
  floatingAddBtn: {
    position: 'absolute',
    bottom: 76,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
});