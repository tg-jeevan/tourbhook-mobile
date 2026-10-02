import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Sparkles,
  ChevronRight,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Copy,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { SkeletonBlock } from '../../../core/components/SkeletonBlock';
import { EmptyState } from '../../../core/components/EmptyState';
import { ErrorState } from '../../../core/components/ErrorState';
import { TimelineItem } from '../types/itineraryPackingTypes';
import { useItineraryDays } from '../hooks/useItineraryDays';
import { PackingItem, usePackingRecommendations } from '../hooks/usePackingRecommendations';
import { AppColors } from '../../../core/theme/colors';
import {
  ItineraryPackingHeader,
  ItineraryPackingTab,
} from '../components/ItineraryPackingHeader';
import {
  PackingCategoryCard,
  CategoryIconType,
} from '../components/PackingCategoryCard';
import { PackingHeroIllustration } from '../components/PackingHeroIllustration';
import { ItineraryDaySelector } from '../components/ItineraryDaySelector';
import { ItineraryTimelineItem } from '../components/ItineraryTimelineItem';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BASE_PACKING_ITEMS: PackingItem[] = [
  { id: '1', name: 'Passport', checked: true, source: 'base' },
  { id: '2', name: 'Travel documents', checked: true, source: 'base' },
  { id: '3', name: 'Swimwear', checked: false, source: 'base' },
  { id: '4', name: 'Comfortable sandals', checked: false, source: 'base' },
  { id: '5', name: 'Light rain jacket', checked: false, source: 'base' },
  { id: '6', name: 'Camera', checked: false, source: 'base' },
];

function SkeletonTimelineItem() {
  return (
    <View style={styles.skeletonRow}>
      <SkeletonBlock style={styles.skeletonDot} />
      <View style={styles.skeletonTextBlock}>
        <SkeletonBlock style={styles.skeletonTime} />
        <SkeletonBlock style={styles.skeletonTitle} />
        <SkeletonBlock style={styles.skeletonSubtitle} />
      </View>
    </View>
  );
}

export default function ItineraryPackingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'ItineraryView'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'ItineraryView' | 'PackingList'>>();
  const tripId = route.params?.tripId || '1';

  const [activeTab, setActiveTab] = useState<ItineraryPackingTab>(
    route.name === 'PackingList' ? 'packing' : 'itinerary',
  );

  const {
    days,
    isLoading: isDaysLoading,
    isError: isDaysError,
    retry: retryDays,
  } = useItineraryDays(tripId);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const selectedDay = days[selectedDayIndex];

  const [packingItems, setPackingItems] = useState<PackingItem[]>(BASE_PACKING_ITEMS);
  const [menuActivity, setMenuActivity] = useState<TimelineItem | null>(null);

  const recommendations = usePackingRecommendations(packingItems.map((item) => item.name));

  useEffect(() => {
    if (recommendations.length === 0) return;

    setPackingItems((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const newOnes = recommendations.filter((item) => !existingIds.has(item.id));
      if (newOnes.length === 0) return prev;

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return [...prev, ...newOnes];
    });
  }, [recommendations]);

  const togglePackingItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPackingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    );
  };

  const switchTab = (tab: ItineraryPackingTab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  // Group packing items into categories dynamically
  const categorizedPackingItems = useMemo(() => {
    const essentials: PackingItem[] = [];
    const clothing: PackingItem[] = [];
    const gadgets: PackingItem[] = [];

    packingItems.forEach((item) => {
      const lower = item.name.toLowerCase();
      if (
        lower.includes('passport') ||
        lower.includes('document') ||
        lower.includes('ticket') ||
        lower.includes('cash') ||
        lower.includes('card')
      ) {
        essentials.push(item);
      } else if (
        lower.includes('swimwear') ||
        lower.includes('sandal') ||
        lower.includes('jacket') ||
        lower.includes('sarong') ||
        lower.includes('shirt') ||
        lower.includes('dress')
      ) {
        clothing.push(item);
      } else {
        gadgets.push(item);
      }
    });

    return [
      {
        id: 'essentials',
        title: 'Essentials',
        subtitle: 'Must-have items for your trip',
        iconType: 'essentials' as CategoryIconType,
        items: essentials,
      },
      {
        id: 'clothing',
        title: 'Clothing',
        subtitle: 'Based on weather and activities',
        iconType: 'clothing' as CategoryIconType,
        items: clothing,
      },
      {
        id: 'gadgets',
        title: 'Gadgets & Accessories',
        subtitle: 'Capture and stay connected',
        iconType: 'gadgets' as CategoryIconType,
        items: gadgets,
      },
    ];
  }, [packingItems]);

  const handleActivityPress = (item: TimelineItem) => {
    if (item.type === 'activity') {
      navigation.navigate('PlaceDetails', {
        placeId: item.id,
        placeName: item.title,
      });
    }
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete' | 'duplicate') => {
    if (!menuActivity) return;
    const current = menuActivity;
    setMenuActivity(null);

    if (action === 'view') {
      navigation.navigate('PlaceDetails', {
        placeId: current.id,
        placeName: current.title,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ── HEADER WITH TABS ──────────────────────────────────────── */}
      <ItineraryPackingHeader
        activeTab={activeTab}
        onSelectTab={switchTab}
        onClose={() => navigation.goBack()}
      />

      {/* ── TAB 1: ITINERARY (DAY-WISE VIEW) ──────────────────────── */}
      {activeTab === 'itinerary' && (
        <View style={styles.flexOne}>
          {isDaysError ? (
            <ErrorState
              message="We couldn't load your itinerary. Try again."
              onRetry={retryDays}
            />
          ) : isDaysLoading ? (
            <ScrollView contentContainerStyle={styles.timelineContent}>
              <SkeletonTimelineItem />
              <SkeletonTimelineItem />
              <SkeletonTimelineItem />
            </ScrollView>
          ) : days.length === 0 ? (
            <EmptyState
              icon="🗺️"
              message="Your itinerary is empty. Start planning your trip."
            />
          ) : (
            <>
              {/* Day Selector */}
              <ItineraryDaySelector
                days={days}
                selectedIndex={selectedDayIndex}
                onSelectIndex={(index) => setSelectedDayIndex(index)}
              />

              {/* Day Timeline */}
              <ScrollView
                contentContainerStyle={styles.timelineContent}
                showsVerticalScrollIndicator={false}
              >
                {!selectedDay || selectedDay.items.length === 0 ? (
                  <EmptyState
                    icon="🗺️"
                    message="No activities scheduled for this day."
                  />
                ) : (
                  selectedDay.items.map((item, index) => (
                    <ItineraryTimelineItem
                      key={item.id}
                      item={item}
                      isLast={index === selectedDay.items.length - 1}
                      onPress={() => handleActivityPress(item)}
                      onMenuPress={() => setMenuActivity(item)}
                    />
                  ))
                )}
              </ScrollView>

              {/* Bottom Floating Add Activity Button */}
              <TouchableOpacity
                style={styles.floatingAddBtn}
                onPress={() => navigation.navigate('AddPlaces', { tripId })}
                activeOpacity={0.88}
              >
                <Plus size={18} color={AppColors.white} strokeWidth={2.5} />
                <Text style={styles.floatingAddBtnText}>Add Activity</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* ── TAB 2: PACKING LIST ────────────────────────────────────── */}
      {activeTab === 'packing' && (
        <ScrollView
          contentContainerStyle={styles.packingScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Packing Hero Banner */}
          <View style={styles.packingHero}>
            <View style={styles.packingHeroTextCol}>
              <Text style={styles.packingHeroTitle}>Packing List</Text>
              <Text style={styles.packingHeroSubtitle}>
                Get ready for a hassle-free trip with{'\n'}this AI-powered packing list.
              </Text>
            </View>
            <PackingHeroIllustration />
          </View>

          {/* AI Suggestion Info Card */}
          <View style={styles.aiSuggestionCard}>
            <View style={styles.aiIconCircle}>
              <Sparkles size={20} color={AppColors.primary} />
            </View>
            <Text style={styles.aiSuggestionText}>
              <Text style={styles.aiBoldText}>AI</Text> is adding suggestions based on{'\n'}your destination, weather and activities.
            </Text>
            <ChevronRight size={18} color={AppColors.textSecondary} />
          </View>

          {/* Expandable Category Cards */}
          {categorizedPackingItems.map((category) => (
            <PackingCategoryCard
              key={category.id}
              title={category.title}
              subtitle={category.subtitle}
              iconType={category.iconType}
              items={category.items}
              onToggleItem={togglePackingItem}
            />
          ))}
        </ScrollView>
      )}

      {/* ── ACTIVITY MENU MODAL ────────────────────────────────────── */}
      <Modal
        visible={!!menuActivity}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuActivity(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuActivity(null)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalHeader} numberOfLines={1}>
              {menuActivity?.title}
            </Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMenuAction('view')}
            >
              <Eye size={18} color={AppColors.primary} />
              <Text style={styles.modalOptionText}>View Place Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMenuAction('edit')}
            >
              <Edit3 size={18} color={AppColors.textPrimary} />
              <Text style={styles.modalOptionText}>Edit Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMenuAction('duplicate')}
            >
              <Copy size={18} color={AppColors.textPrimary} />
              <Text style={styles.modalOptionText}>Duplicate Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMenuAction('delete')}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.modalOptionText, { color: '#EF4444' }]}>
                Delete Activity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setMenuActivity(null)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Nav Bar */}
      <BottomNavBar active="trips" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  flexOne: {
    flex: 1,
  },

  /* ── Itinerary Timeline ── */
  timelineContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  floatingAddBtn: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 28,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingAddBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.white,
  },

  /* ── Packing List ── */
  packingScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  packingHero: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 84,
    marginBottom: 16,
  },
  packingHeroTextCol: {
    flex: 1,
    paddingRight: 100,
  },
  packingHeroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  packingHeroSubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 18,
  },

  /* AI Suggestion Card */
  aiSuggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    gap: 12,
  },
  aiIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiSuggestionText: {
    flex: 1,
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 17,
  },
  aiBoldText: {
    fontWeight: '800',
    color: AppColors.primary,
  },

  /* ── Skeletons ── */
  skeletonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  skeletonDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
    marginTop: 6,
  },
  skeletonTextBlock: {
    flex: 1,
  },
  skeletonTime: {
    width: 60,
    height: 12,
    marginBottom: 6,
    borderRadius: 4,
  },
  skeletonTitle: {
    width: '75%',
    height: 16,
    marginBottom: 6,
    borderRadius: 4,
  },
  skeletonSubtitle: {
    width: '50%',
    height: 12,
    borderRadius: 4,
  },

  /* ── Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textMuted,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  modalCancelBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
});