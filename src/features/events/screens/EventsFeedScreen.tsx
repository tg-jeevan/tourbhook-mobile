import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Calendar,
  MapPin,
  Clock,
  Filter,
  Search,
  X,
  Tag,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { EventItem, DateFilterOption } from '../types/eventTypes';
import { getEventsForDestination } from '../data/mockEventsData';
import { AppColors } from '../../../core/theme/colors';

export default function EventsFeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, 'EventsFeed'>>();

  // Destination passed from route params or fallback to Paris
  const destination = route.params?.destinationName || 'Paris, France';
  const destinationId = route.params?.destinationId || 'paris';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Temporary filter state for the modal
  const [tempDateFilter, setTempDateFilter] = useState<DateFilterOption>('all');
  const [tempLocation, setTempLocation] = useState<string>('all');
  const [tempCategory, setTempCategory] = useState<string>('all');

  // Fetch destination events
  const allDestinationEvents = useMemo(() => {
    return getEventsForDestination(destinationId || destination);
  }, [destinationId, destination]);

  // Extract unique locations within the destination context
  const availableLocations = useMemo(() => {
    const locs = Array.from(new Set(allDestinationEvents.map((e) => e.location)));
    return locs;
  }, [allDestinationEvents]);

  // Extract unique categories
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(allDestinationEvents.map((e) => e.category)));
    return cats;
  }, [allDestinationEvents]);

  // Filter logic
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Compute end of this week (next 7 days)
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    // Compute end of this month (next 30 days)
    const monthEnd = new Date(now);
    monthEnd.setDate(monthEnd.getDate() + 30);
    const monthEndStr = monthEnd.toISOString().split('T')[0];

    return allDestinationEvents.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Date Filter
      if (dateFilter === 'today') {
        if (item.date !== todayStr) return false;
      } else if (dateFilter === 'this_week') {
        if (item.date < todayStr || item.date > weekEndStr) return false;
      } else if (dateFilter === 'this_month') {
        if (item.date < todayStr || item.date > monthEndStr) return false;
      }

      // 3. Location Filter
      if (selectedLocation !== 'all' && item.location !== selectedLocation) {
        return false;
      }

      // 4. Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [allDestinationEvents, searchQuery, dateFilter, selectedLocation, selectedCategory]);

  const activeFilterCount =
    (dateFilter !== 'all' ? 1 : 0) +
    (selectedLocation !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0);

  const openFilterModal = () => {
    setTempDateFilter(dateFilter);
    setTempLocation(selectedLocation);
    setTempCategory(selectedCategory);
    setIsFilterModalVisible(true);
  };

  const applyFilters = () => {
    setDateFilter(tempDateFilter);
    setSelectedLocation(tempLocation);
    setSelectedCategory(tempCategory);
    setIsFilterModalVisible(false);
  };

  const clearAllFilters = () => {
    setDateFilter('all');
    setSelectedLocation('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setTempDateFilter('all');
    setTempLocation('all');
    setTempCategory('all');
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const renderEventCard = ({ item }: { item: EventItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
        {item.price ? (
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{item.price}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Calendar size={14} color={AppColors.primary} />
            <Text style={styles.metaText}>{formatDateDisplay(item.date)}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Clock size={14} color={AppColors.primary} />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MapPin size={14} color={AppColors.textMuted} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <Text style={styles.shortDesc} numberOfLines={2}>
          {item.shortDescription}
        </Text>

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
          >
            <Text style={styles.detailsBtnText}>View Details</Text>
            <ChevronRight size={16} color={AppColors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerSubtitle}>Destination Events</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {destination}
          </Text>
        </View>
        <TouchableOpacity style={styles.filterIconButton} onPress={openFilterModal}>
          <Filter size={20} color={activeFilterCount > 0 ? AppColors.white : AppColors.textPrimary} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search & Quick Filter Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color={AppColors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, festivals, concerts..."
            placeholderTextColor={AppColors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={AppColors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Date Quick Filter Pills */}
      <View style={styles.pillsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
          <TouchableOpacity
            style={[styles.pill, dateFilter === 'all' && styles.pillActive]}
            onPress={() => setDateFilter('all')}
          >
            <Text style={[styles.pillText, dateFilter === 'all' && styles.pillTextActive]}>
              All Dates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, dateFilter === 'today' && styles.pillActive]}
            onPress={() => setDateFilter('today')}
          >
            <Text style={[styles.pillText, dateFilter === 'today' && styles.pillTextActive]}>
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, dateFilter === 'this_week' && styles.pillActive]}
            onPress={() => setDateFilter('this_week')}
          >
            <Text style={[styles.pillText, dateFilter === 'this_week' && styles.pillTextActive]}>
              This Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, dateFilter === 'this_month' && styles.pillActive]}
            onPress={() => setDateFilter('this_month')}
          >
            <Text style={[styles.pillText, dateFilter === 'this_month' && styles.pillTextActive]}>
              This Month
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Active Filter Chips */}
      {(selectedLocation !== 'all' || selectedCategory !== 'all') && (
        <View style={styles.activeChipsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeChipsScroll}>
            {selectedLocation !== 'all' && (
              <View style={styles.activeChip}>
                <MapPin size={12} color={AppColors.primary} />
                <Text style={styles.activeChipText}>{selectedLocation}</Text>
                <TouchableOpacity onPress={() => setSelectedLocation('all')}>
                  <X size={14} color={AppColors.textPrimary} />
                </TouchableOpacity>
              </View>
            )}
            {selectedCategory !== 'all' && (
              <View style={styles.activeChip}>
                <Tag size={12} color={AppColors.primary} />
                <Text style={styles.activeChipText}>{selectedCategory}</Text>
                <TouchableOpacity onPress={() => setSelectedCategory('all')}>
                  <X size={14} color={AppColors.textPrimary} />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.clearAllBtn} onPress={clearAllFilters}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Events List / Empty State */}
      {filteredEvents.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIconCircle}>
            <Calendar size={36} color={AppColors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No events found</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilterCount > 0 || searchQuery
              ? 'No events match your current filter criteria. Try adjusting the date or location.'
              : `There are currently no scheduled events listed for ${destination}.`}
          </Text>
          {(activeFilterCount > 0 || searchQuery) && (
            <TouchableOpacity style={styles.resetFiltersBtn} onPress={clearAllFilters}>
              <Text style={styles.resetFiltersBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderEventCard}
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Events</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <X size={22} color={AppColors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Date Filter Section */}
              <Text style={styles.filterSectionTitle}>Date</Text>
              <View style={styles.optionsWrap}>
                {(
                  [
                    { key: 'all', label: 'All Dates' },
                    { key: 'today', label: 'Today' },
                    { key: 'this_week', label: 'This Week' },
                    { key: 'this_month', label: 'This Month' },
                  ] as const
                ).map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.optionChip,
                      tempDateFilter === opt.key && styles.optionChipActive,
                    ]}
                    onPress={() => setTempDateFilter(opt.key)}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        tempDateFilter === opt.key && styles.optionChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Location Filter Section */}
              {availableLocations.length > 0 && (
                <>
                  <Text style={styles.filterSectionTitle}>Location / Venue</Text>
                  <View style={styles.optionsWrap}>
                    <TouchableOpacity
                      style={[
                        styles.optionChip,
                        tempLocation === 'all' && styles.optionChipActive,
                      ]}
                      onPress={() => setTempLocation('all')}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          tempLocation === 'all' && styles.optionChipTextActive,
                        ]}
                      >
                        All Locations
                      </Text>
                    </TouchableOpacity>
                    {availableLocations.map((loc) => (
                      <TouchableOpacity
                        key={loc}
                        style={[
                          styles.optionChip,
                          tempLocation === loc && styles.optionChipActive,
                        ]}
                        onPress={() => setTempLocation(loc)}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            tempLocation === loc && styles.optionChipTextActive,
                          ]}
                        >
                          {loc}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Category Filter Section */}
              {availableCategories.length > 0 && (
                <>
                  <Text style={styles.filterSectionTitle}>Category</Text>
                  <View style={styles.optionsWrap}>
                    <TouchableOpacity
                      style={[
                        styles.optionChip,
                        tempCategory === 'all' && styles.optionChipActive,
                      ]}
                      onPress={() => setTempCategory('all')}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          tempCategory === 'all' && styles.optionChipTextActive,
                        ]}
                      >
                        All Categories
                      </Text>
                    </TouchableOpacity>
                    {availableCategories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.optionChip,
                          tempCategory === cat && styles.optionChipActive,
                        ]}
                        onPress={() => setTempCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            tempCategory === cat && styles.optionChipTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalResetBtn}
                onPress={() => {
                  setTempDateFilter('all');
                  setTempLocation('all');
                  setTempCategory('all');
                }}
              >
                <Text style={styles.modalResetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalApplyBtn} onPress={applyFilters}>
                <Text style={styles.modalApplyBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
    backgroundColor: AppColors.surface,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: AppColors.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: AppColors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: AppColors.textPrimary,
    marginLeft: 8,
  },
  pillsContainer: {
    paddingVertical: 6,
  },
  pillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  pillActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  pillText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  pillTextActive: {
    color: AppColors.white,
    fontWeight: '600',
  },
  activeChipsRow: {
    paddingVertical: 6,
  },
  activeChipsScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.primaryLight,
  },
  activeChipText: {
    fontSize: 12,
    color: AppColors.primaryDark,
    fontWeight: '500',
  },
  clearAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearAllText: {
    fontSize: 12,
    color: AppColors.accent,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  imageContainer: {
    height: 170,
    width: '100%',
    backgroundColor: AppColors.surfaceMuted,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(16, 36, 63, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: AppColors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: AppColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceBadgeText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.border,
    marginHorizontal: 8,
  },
  metaText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 13,
    color: AppColors.textMuted,
    flex: 1,
  },
  shortDesc: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  resetFiltersBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  resetFiltersBtnText: {
    color: AppColors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: AppColors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginTop: 12,
    marginBottom: 10,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: AppColors.surfaceMuted,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  optionChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  optionChipText: {
    fontSize: 13,
    color: AppColors.textPrimary,
    fontWeight: '500',
  },
  optionChipTextActive: {
    color: AppColors.white,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
    gap: 12,
  },
  modalResetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalResetBtnText: {
    color: AppColors.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  modalApplyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalApplyBtnText: {
    color: AppColors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
