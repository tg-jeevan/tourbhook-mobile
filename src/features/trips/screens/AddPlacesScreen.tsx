import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Search,
  Sparkles,
  MapPin,
  Plus,
  Check,
  ArrowRight,
  X,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { TripFlowProgressHeader } from '../components/TripFlowProgressHeader';
import { itineraryStore } from '../data/itineraryStore';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Place {
  id: string;
  name: string;
  category: string;
  emoji: string;
  isAiSuggested: boolean;
}

// ── AI-suggested places (destination-generic, presented as from destination) ──
function getAiSuggestionsForDestination(destination: string): Place[] {
  const dest = destination.toLowerCase();

  if (dest.includes('bangalore') || dest.includes('bengaluru')) {
    return [
      { id: 'ai-1', name: 'Lalbagh Botanical Garden', category: 'Nature', emoji: '🌿', isAiSuggested: true },
      { id: 'ai-2', name: 'Bangalore Palace',          category: 'Heritage', emoji: '🏰', isAiSuggested: true },
      { id: 'ai-3', name: 'Cubbon Park',               category: 'Nature', emoji: '🌳', isAiSuggested: true },
      { id: 'ai-4', name: 'ISKCON Temple',             category: 'Spiritual', emoji: '🛕', isAiSuggested: true },
      { id: 'ai-5', name: 'Commercial Street',         category: 'Shopping', emoji: '🛍️', isAiSuggested: true },
      { id: 'ai-6', name: 'Vidhana Soudha',            category: 'Architecture', emoji: '🏛️', isAiSuggested: true },
    ];
  }
  if (dest.includes('paris') || dest.includes('france')) {
    return [
      { id: 'ai-1', name: 'Eiffel Tower',      category: 'Landmark',  emoji: '🗼', isAiSuggested: true },
      { id: 'ai-2', name: 'Louvre Museum',      category: 'Art',       emoji: '🖼️', isAiSuggested: true },
      { id: 'ai-3', name: 'Notre-Dame',         category: 'Heritage',  emoji: '⛪', isAiSuggested: true },
      { id: 'ai-4', name: 'Champs-Élysées',     category: 'Shopping',  emoji: '🛍️', isAiSuggested: true },
      { id: 'ai-5', name: 'Sacré-Cœur',        category: 'Spiritual', emoji: '🕍', isAiSuggested: true },
      { id: 'ai-6', name: 'Musée d\'Orsay',    category: 'Art',       emoji: '🎨', isAiSuggested: true },
    ];
  }
  if (dest.includes('tokyo') || dest.includes('japan')) {
    return [
      { id: 'ai-1', name: 'Senso-ji Temple',    category: 'Spiritual',  emoji: '⛩️', isAiSuggested: true },
      { id: 'ai-2', name: 'Shibuya Crossing',   category: 'Landmark',   emoji: '🚦', isAiSuggested: true },
      { id: 'ai-3', name: 'Shinjuku Gyoen',     category: 'Nature',     emoji: '🌸', isAiSuggested: true },
      { id: 'ai-4', name: 'Tsukiji Market',     category: 'Food',       emoji: '🍣', isAiSuggested: true },
      { id: 'ai-5', name: 'Akihabara District', category: 'Shopping',   emoji: '🎮', isAiSuggested: true },
      { id: 'ai-6', name: 'Ueno Park & Zoo',    category: 'Nature',     emoji: '🦁', isAiSuggested: true },
    ];
  }
  // Generic fallback
  return [
    { id: 'ai-1', name: `${destination} Old Town`,   category: 'Heritage', emoji: '🏘️', isAiSuggested: true },
    { id: 'ai-2', name: `${destination} Central Park`,category: 'Nature',   emoji: '🌳', isAiSuggested: true },
    { id: 'ai-3', name: `${destination} Art Museum`, category: 'Art',      emoji: '🖼️', isAiSuggested: true },
    { id: 'ai-4', name: `${destination} Food Market`,category: 'Food',     emoji: '🛒', isAiSuggested: true },
  ];
}

// ── Fake search results (for manual search demo) ──────────────────────────────
function getSearchResults(query: string, destination: string): Place[] {
  if (!query.trim()) return [];
  // Simple filter over all AI suggestions + common extras
  const pool: Place[] = [
    ...getAiSuggestionsForDestination(destination),
    { id: 'manual-1', name: `${destination} Zoo`,        category: 'Nature',  emoji: '🦒', isAiSuggested: false },
    { id: 'manual-2', name: `${destination} Waterfall`,  category: 'Nature',  emoji: '💧', isAiSuggested: false },
    { id: 'manual-3', name: `${destination} Night Market`,category: 'Food',   emoji: '🌙', isAiSuggested: false },
    { id: 'manual-4', name: `${destination} Fort`,       category: 'Heritage',emoji: '🏯', isAiSuggested: false },
    { id: 'manual-5', name: `${destination} Beach`,      category: 'Nature',  emoji: '🏖️', isAiSuggested: false },
  ];
  const q = query.toLowerCase();
  return pool.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6);
}

// ── Place Chip ────────────────────────────────────────────────────────────────
function PlaceChip({
  place,
  isSelected,
  onToggle,
}: {
  place: Place;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.placeChip, isSelected && styles.placeChipSelected]}
      onPress={() => onToggle(place.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.placeChipEmoji}>{place.emoji}</Text>
      <View style={styles.placeChipTextCol}>
        <Text style={[styles.placeChipName, isSelected && styles.placeChipNameSelected]} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.placeChipCat}>{place.category}</Text>
      </View>
      <View style={[styles.placeChipCheckWrap, isSelected && styles.placeChipCheckWrapSelected]}>
        {isSelected ? (
          <Check size={13} color={AppColors.white} strokeWidth={2.5} />
        ) : (
          <Plus size={13} color={AppColors.textMuted} />
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AddPlacesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'AddPlaces'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'AddPlaces'>>();
  const tripParams = route.params;

  const destination = tripParams?.destination || 'Your Destination';

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    if (tripParams?.selectedPlaceIds && tripParams.selectedPlaceIds.length > 0) {
      return new Set(tripParams.selectedPlaceIds);
    }
    if (tripParams?.tripId) {
      const existing = itineraryStore.getItineraryById(tripParams.tripId);
      if (existing?.selectedPlaceIds && existing.selectedPlaceIds.length > 0) {
        return new Set(existing.selectedPlaceIds);
      }
    }
    return new Set();
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const aiSuggestions = useMemo(
    () => getAiSuggestionsForDestination(destination),
    [destination],
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return getSearchResults(searchQuery, destination);
  }, [searchQuery, destination]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      setIsSearching(true);
      // Simulate a brief search delay
      setTimeout(() => setIsSearching(false), 300);
    } else {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleNext = () => {
    navigation.navigate('TravelMode', {
      ...tripParams,
      selectedPlaceIds: Array.from(selectedIds),
    });
  };

  const selectedCount = selectedIds.size;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TripFlowProgressHeader
        currentStep={4}
        totalSteps={6}
        stepLabel="Step 4 of 6 · Add Places"
        onBack={() => navigation.goBack()}
        showCloseIcon={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Add Places</Text>
          <Text style={styles.heroSubtitle}>
            Select from AI suggestions or search for{'\n'}places in{' '}
            <Text style={styles.heroDestinationHighlight}>{destination}</Text>
          </Text>
        </View>

        {/* ── MANUAL SEARCH ────────────────────────────────────────── */}
        <View style={styles.searchCard}>
          <View style={styles.searchRow}>
            <Search size={18} color={AppColors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search places in ${destination}…`}
              placeholderTextColor={AppColors.textMuted}
              value={searchQuery}
              onChangeText={handleSearchChange}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} activeOpacity={0.7}>
                <X size={16} color={AppColors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── SEARCH RESULTS ───────────────────────────────────────── */}
        {searchQuery.trim().length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {isSearching ? (
              <ActivityIndicator color={AppColors.primary} style={{ marginVertical: 16 }} />
            ) : searchResults.length > 0 ? (
              searchResults.map((place) => (
                <PlaceChip
                  key={place.id}
                  place={place}
                  isSelected={selectedIds.has(place.id)}
                  onToggle={handleToggle}
                />
              ))
            ) : (
              <View style={styles.noResultsCard}>
                <Text style={styles.noResultsText}>
                  No places found for "{searchQuery}" in {destination}.{'\n'}
                  Try a different search or pick from AI suggestions.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── AI SUGGESTIONS ───────────────────────────────────────── */}
        {(!searchQuery.trim() || searchResults.length === 0) && (
          <View style={styles.sectionBlock}>
            {/* AI Badge */}
            <View style={styles.aiHeaderRow}>
              <View style={styles.aiIconCircle}>
                <Sparkles size={16} color={AppColors.primary} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>AI Suggested Places</Text>
                <Text style={styles.aiSubtitle}>Based on your destination & travel style</Text>
              </View>
            </View>

            {aiSuggestions.map((place) => (
              <PlaceChip
                key={place.id}
                place={place}
                isSelected={selectedIds.has(place.id)}
                onToggle={handleToggle}
              />
            ))}
          </View>
        )}

        {/* ── SELECTED COUNT HINT ──────────────────────────────────── */}
        {selectedCount > 0 && (
          <View style={styles.selectedCountBanner}>
            <MapPin size={16} color={AppColors.primary} />
            <Text style={styles.selectedCountText}>
              {selectedCount} place{selectedCount !== 1 ? 's' : ''} selected
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.primaryCtaBtn, selectedCount === 0 && styles.primaryCtaBtnMuted]}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryCtaText}>
            {selectedCount > 0 ? `Continue with ${selectedCount} Place${selectedCount !== 1 ? 's' : ''}` : 'Skip & Continue'}
          </Text>
          <ArrowRight size={18} color={AppColors.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },

  /* Hero */
  heroSection: {
    marginTop: 4,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 19,
  },
  heroDestinationHighlight: {
    fontWeight: '800',
    color: AppColors.primary,
  },

  /* Search Card */
  searchCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
    paddingVertical: 0,
  },

  /* Section Block */
  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 10,
  },

  /* AI header */
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  aiIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiSubtitle: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '500',
  },

  /* Place Chip */
  placeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EAE5DC',
    padding: 12,
    marginBottom: 10,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  placeChipSelected: {
    borderColor: AppColors.primary,
    backgroundColor: '#EFF6FF',
  },
  placeChipEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  placeChipTextCol: {
    flex: 1,
  },
  placeChipName: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  placeChipNameSelected: {
    color: AppColors.primary,
  },
  placeChipCat: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  placeChipCheckWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeChipCheckWrapSelected: {
    backgroundColor: AppColors.primary,
  },

  /* No results */
  noResultsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 16,
  },
  noResultsText: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 19,
    textAlign: 'center',
  },

  /* Selected count banner */
  selectedCountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 4,
  },
  selectedCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primary,
  },

  bottomSpacer: {
    height: 16,
  },

  /* CTA */
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 15,
    borderRadius: 22,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCtaBtnMuted: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryCtaText: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.white,
  },
});