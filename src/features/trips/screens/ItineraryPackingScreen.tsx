import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { SkeletonBlock } from '../../../core/components/SkeletonBlock';
import { EmptyState } from '../../../core/components/EmptyState';
import { ErrorState } from '../../../core/components/ErrorState';
import { Typography } from '../../../core/theme/typography';
import { TimelineItem } from '../types/itineraryPackingTypes';
import { useItineraryDays } from '../hooks/useItineraryDays';
import { PackingItem, usePackingRecommendations } from '../hooks/usePackingRecommendations';
import { AppColors } from '../../../core/theme/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


const PRIMARY = AppColors.primary;
const PRIMARY_LIGHT = AppColors.primaryLight;
const TEXT_DARK = AppColors.textDark;
const TEXT_MUTED = AppColors.textMuted;

const BASE_PACKING_ITEMS: PackingItem[] = [
  { id: '1', name: 'Passport', checked: true, source: 'base' },
  { id: '2', name: 'Travel documents', checked: true, source: 'base' },
  { id: '3', name: 'Swimwear', checked: false, source: 'base' },
  { id: '4', name: 'Comfortable sandals', checked: false, source: 'base' },
  { id: '5', name: 'Camera', checked: false, source: 'base' },
  { id: '6', name: 'Light rain jacket', checked: false, source: 'base' },
];

type TabKey = 'itinerary' | 'packing';

function SkeletonTimelineItem() {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        <SkeletonBlock style={styles.skeletonDot} />
      </View>
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

  const [activeTab, setActiveTab] = useState<TabKey>(
    route.name === 'PackingList' ? 'packing' : 'itinerary',
  );

  const { days, isLoading: isDaysLoading, isError: isDaysError, retry: retryDays } = useItineraryDays(tripId);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const selectedDay = days[selectedDayIndex];

  const [packingItems, setPackingItems] = useState<PackingItem[]>(BASE_PACKING_ITEMS);
  const recommendations = usePackingRecommendations(packingItems.map(item => item.name));

  useEffect(() => {
    if (recommendations.length === 0) return;

    setPackingItems(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const newOnes = recommendations.filter(item => !existingIds.has(item.id));
      if (newOnes.length === 0) return prev;

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return [...prev, ...newOnes];
    });
  }, [recommendations]);

  const togglePackingItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPackingItems(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item)),
    );
  };

  const switchTab = (tab: TabKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  const renderTimelineItem = (item: TimelineItem, index: number, isLast: boolean) => {
    if (item.type === 'break') {
      return (
        <View key={item.id} style={styles.timelineRow}>
          <View style={styles.timelineRail}>
            <View style={styles.breakDot} />
            {!isLast && <View style={styles.railLineDashed} />}
          </View>
          <View style={styles.breakCard}>
            <Text style={styles.breakTime}>{item.time}</Text>
            <Text style={styles.breakTitle}>{item.title}</Text>
            <Text style={styles.breakSubtitle}>
              {item.subtitle}
              {item.durationMinutes ? ` · ${item.durationMinutes} min` : ''}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View key={item.id} style={styles.timelineRow}>
        <View style={styles.timelineRail}>
          <View style={styles.activityDot} />
          {!isLast && <View style={styles.railLine} />}
        </View>
        <TouchableOpacity
          style={styles.activityCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('PlaceDetails', { placeId: item.id, placeName: item.title })
          }
        >
          <View style={styles.activityTextBlock}>
            <Text style={styles.activityTime}>{item.time}</Text>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.thumbnail}>
            <Text style={styles.thumbnailEmoji}>{item.thumbnailEmoji}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
    const renderItineraryTab = () => {
    if (isDaysError) {
      return <ErrorState message="We couldn't load your itinerary. Try again." onRetry={retryDays} />;
    }

    if (isDaysLoading) {

      return (
        <ScrollView contentContainerStyle={styles.timelineContent}>
          <SkeletonTimelineItem />
          <SkeletonTimelineItem />
          <SkeletonTimelineItem />
        </ScrollView>
      );
    }
       if (days.length === 0) {
      return <EmptyState icon="🗺️" message="Your itinerary is empty. Start planning your trip." />;
    }

      return (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayRow}
          >
            {days.map((day, index) => {
              const isSelected = index === selectedDayIndex;
              return (
                <TouchableOpacity
                  key={day.id}
                  style={[styles.dayChip, isSelected && styles.dayChipActive]}
                  onPress={() => setSelectedDayIndex(index)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayChipLabel, isSelected && styles.dayChipLabelActive]}>
                    {day.dayLabel}
                  </Text>
                  <Text style={[styles.dayChipDate, isSelected && styles.dayChipDateActive]}>
                    {day.dateLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView contentContainerStyle={styles.timelineContent}>
          {selectedDay.items.length === 0 ? (
            <EmptyState icon="🗺️" message="Your itinerary is empty. Start planning your trip." />
          ) : (
            selectedDay.items.map((item, index) =>
              renderTimelineItem(item, index, index === selectedDay.items.length - 1),
         )
          )}
        </ScrollView>

          <TouchableOpacity
            style={styles.addActivityButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AddPlaces', { tripId })}
          >
            <Text style={styles.addActivityButtonText}>+ Add Activity</Text>
          </TouchableOpacity>
        </>
         );
  };
  return (

      <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>My Itinerary</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity style={styles.tabButton} onPress={() => switchTab('itinerary')}>
          <Text style={[styles.tabLabel, activeTab === 'itinerary' && styles.tabLabelActive]}>
            Itinerary
          </Text>
          {activeTab === 'itinerary' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => switchTab('packing')}>
          <Text style={[styles.tabLabel, activeTab === 'packing' && styles.tabLabelActive]}>
            Packing List
          </Text>
          {activeTab === 'packing' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {activeTab === 'itinerary' ? (
        renderItineraryTab()
      ) : (
        <ScrollView contentContainerStyle={styles.packingContent}>
          <Text style={styles.packingHint}>AI is adding suggestions as they come in</Text>
          {packingItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.packingRow}
              onPress={() => togglePackingItem(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, item.checked && styles.checkboxChecked]} />
              <Text style={[styles.packingItemName, item.checked && styles.packingItemChecked]}>
                {item.name}
              </Text>
              {item.source === 'ai' && (
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>AI</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <BottomNavBar active="trips" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: { ...Typography.screenTitle, color: TEXT_DARK },
  headerPlaceholder: { width: 44 },

  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingHorizontal: 24,
  },
  tabButton: { flex: 1, alignItems: 'center', paddingBottom: 12 },
  tabLabel: { fontSize: 14, fontWeight: '600', color: TEXT_MUTED },
  tabLabelActive: { color: PRIMARY },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '60%',
    backgroundColor: PRIMARY,
    borderRadius: 1,
  },

  dayRow: { paddingHorizontal: 24, paddingVertical: 16, gap: 10 },
  dayChip: {
    width: 68,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  dayChipActive: { backgroundColor: PRIMARY_LIGHT, borderColor: PRIMARY },
  dayChipLabel: { fontSize: 13, fontWeight: '700', color: TEXT_DARK },
  dayChipLabelActive: { color: PRIMARY },
  dayChipDate: { ...Typography.smallDetail, color: TEXT_MUTED, marginTop: 2 },
  dayChipDateActive: { color: PRIMARY },

  timelineContent: { paddingHorizontal: 24, paddingBottom: 100 },
  timelineRow: { flexDirection: 'row' },
  timelineRail: { width: 24, alignItems: 'center' },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY,
    marginTop: 6,
  },
  breakDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  railLine: { width: 2, flex: 1, backgroundColor: PRIMARY_LIGHT, marginTop: 2 },
  railLineDashed: {
    width: 2,
    flex: 1,
    backgroundColor: '#E8E8E8',
    marginTop: 2,
  },

  activityCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingRight: 4,
  },
  activityTextBlock: { flex: 1, paddingRight: 12 },
  activityTime: { ...Typography.smallDetail, color: TEXT_MUTED, marginBottom: 2 },
  activityTitle: { ...Typography.contentName, color: TEXT_DARK },
  activitySubtitle: { ...Typography.smallDetail, color: TEXT_MUTED, marginTop: 2 },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailEmoji: { fontSize: 22 },

  breakCard: {
    flex: 1,
    marginVertical: 8,
    marginRight: 4,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D5D5DA',
    backgroundColor: '#F7F7F9',
  },
  breakTime: { ...Typography.smallDetail, color: TEXT_MUTED, marginBottom: 2 },
  breakTitle: { fontSize: 14, fontWeight: '600', color: '#5B5B66' },
  breakSubtitle: { ...Typography.smallDetail, color: TEXT_MUTED, marginTop: 2 },

  addActivityButton: {
    position: 'absolute',
    right: 24,
    bottom: 96,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  addActivityButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

  packingContent: { padding: 24, paddingBottom: 100 },
  packingHint: { ...Typography.smallDetail, color: TEXT_MUTED, marginBottom: 12 },
  packingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: TEXT_MUTED,
    marginRight: 12,
  },
  checkboxChecked: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  packingItemName: { ...Typography.contentName, color: TEXT_DARK, flex: 1 },
  packingItemChecked: { textDecorationLine: 'line-through', color: TEXT_MUTED },
  aiBadge: {
    backgroundColor: PRIMARY_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  aiBadgeText: { fontSize: 10, fontWeight: '700', color: PRIMARY, letterSpacing: 0.5 },
  
  skeletonDot: { width: 12, height: 12, borderRadius: 6, marginTop: 6 },
  skeletonTextBlock: { flex: 1, paddingVertical: 14, paddingRight: 4 },
  skeletonTime: { width: 60, height: 11, marginBottom: 6 },
  skeletonTitle: { width: '70%', height: 14, marginBottom: 6 },
  skeletonSubtitle: { width: '50%', height: 11 },
});