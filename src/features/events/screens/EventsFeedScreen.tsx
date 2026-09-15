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
import { EventItem, DateFilterOption, EventFilterState } from '../types/eventTypes';
import { getEventsForDestination } from '../data/mockEventsData';

const PRIMARY_GREEN = '#1FAE5D';
const DARK_NAVY = '#1A1A2E';
const MUTED_TEXT = '#8E8E93';
const ACCENT_PINK = '#E91E63';

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
            <Calendar size={14} color={PRIMARY_GREEN} />
            <Text style={styles.metaText}>{formatDateDisplay(item.date)}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Clock size={14} color={PRIMARY_GREEN} />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MapPin size={14} color={MUTED_TEXT} />
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
            <ChevronRight size={16} color={PRIMARY_GREEN} />
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
          <Filter size={20} color={activeFilterCount > 0 ? '#FFFFFF' : DARK_NAVY} />
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
          <Search size={18} color={MUTED_TEXT} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, festivals, concerts..."
            placeholderTextColor={MUTED_TEXT}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={MUTED_TEXT} />
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
                <MapPin size={12} color={PRIMARY_GREEN} />
                <Text style={styles.activeChipText}>{selectedLocation}</Text>
                <TouchableOpacity onPress={() => setSelectedLocation('all')}>
                  <X size={14} color={DARK_NAVY} />
                </TouchableOpacity>
              </View>
            )}
            {selectedCategory !== 'all' && (
              <View style={styles.activeChip}>
                <Tag size={12} color={PRIMARY_GREEN} />
                <Text style={styles.activeChipText}>{selectedCategory}</Text>
                <TouchableOpacity onPress={() => setSelectedCategory('all')}>
                  <X size={14} color={DARK_NAVY} />
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
            <Calendar size={36} color={MUTED_TEXT} />
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
                <X size={22} color={DARK_NAVY} />
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: PRIMARY_GREEN,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_NAVY,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: PRIMARY_GREEN,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
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
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: DARK_NAVY,
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
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  pillActive: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  pillText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#FFFFFF',
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
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C2EAD0',
  },
  activeChipText: {
    fontSize: 12,
    color: DARK_NAVY,
    fontWeight: '500',
  },
  clearAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearAllText: {
    fontSize: 12,
    color: ACCENT_PINK,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  imageContainer: {
    height: 170,
    width: '100%',
    backgroundColor: '#EAEAEA',
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
    backgroundColor: 'rgba(26, 26, 46, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_NAVY,
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
    backgroundColor: '#D1D1D6',
    marginHorizontal: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#444444',
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
    color: MUTED_TEXT,
    flex: 1,
  },
  shortDesc: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F7',
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
    color: PRIMARY_GREEN,
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
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DARK_NAVY,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: MUTED_TEXT,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  resetFiltersBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  resetFiltersBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_NAVY,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK_NAVY,
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
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  optionChipActive: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  optionChipText: {
    fontSize: 13,
    color: DARK_NAVY,
    fontWeight: '500',
  },
  optionChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 12,
  },
  modalResetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalResetBtnText: {
    color: DARK_NAVY,
    fontWeight: '600',
    fontSize: 15,
  },
  modalApplyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalApplyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
