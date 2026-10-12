import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Search,
  X,
  Star,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  LayoutGrid,
  Mountain,
  Landmark,
  Utensils,
  Palmtree,
  Leaf,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { BackButton } from '../../../core/components/BackButton';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { MOCK_DESTINATIONS } from '../data/mockExploreData';
import { DestinationItem, ExploreCategory } from '../types/exploreTypes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES: {
  label: ExploreCategory;
  icon: React.ComponentType<{ size: number; color: string }>;
}[] = [
  { label: 'All', icon: LayoutGrid },
  { label: 'Adventure', icon: Mountain },
  { label: 'Culture', icon: Landmark },
  { label: 'Food', icon: Utensils },
  { label: 'Beach', icon: Palmtree },
  { label: 'Nature', icon: Leaf },
];

export default function AllDestinationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, 'AllDestinations'>>();

  const initialCategory = route.params?.category || 'All';
  const [activeCategory, setActiveCategory] = useState<ExploreCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter destinations based on category and search query
  const filteredDestinations = useMemo(() => {
    let list: DestinationItem[] = [...MOCK_DESTINATIONS];

    // Filter by category
    if (activeCategory !== 'All') {
      const catLower = activeCategory.toLowerCase();
      list = list.filter((dest) => dest.category.toLowerCase() === catLower);
    }

    // Filter by search query
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((dest) => {
        const nameMatch = dest.name.toLowerCase().includes(query);
        const countryMatch = dest.country.toLowerCase().includes(query);
        const descMatch = dest.description.toLowerCase().includes(query);
        const vibeMatch = dest.vibe.toLowerCase().includes(query);
        const placesMatch = dest.popularPlaces.some(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.shortDesc.toLowerCase().includes(query)
        );
        return nameMatch || countryMatch || descMatch || vibeMatch || placesMatch;
      });
    }

    return list;
  }, [activeCategory, searchQuery]);

  const handleDestinationPress = (destination: DestinationItem) => {
    navigation.navigate('DestinationDetails', {
      destinationId: destination.id,
      destinationName: `${destination.name}, ${destination.country}`,
      country: destination.country,
    });
  };

  const handlePlacePress = (placeId: string, placeName: string) => {
    navigation.navigate('PlaceDetails', {
      placeId,
      placeName,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar hidden={true} barStyle="dark-content" />

      {/* ── TOP HEADER ───────────────────────────────────────────── */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Popular Destinations</Text>
          <Text style={styles.headerSubtitle}>
            {filteredDestinations.length}{' '}
            {filteredDestinations.length === 1 ? 'place' : 'places'} to explore
          </Text>
        </View>
        <View style={styles.headerRightSpacer} />
      </View>

      {/* ── SEARCH BAR ───────────────────────────────────────────── */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color={AppColors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations or countries..."
            placeholderTextColor={AppColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            testID="all-destinations-search-input"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="clear-search-btn"
            >
              <X size={16} color={AppColors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── CATEGORY FILTER CHIPS ─────────────────────────────────── */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.label;
            const Icon = cat.icon;
            return (
              <TouchableOpacity
                key={cat.label}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat.label)}
                activeOpacity={0.8}
                testID={`category-chip-${cat.label.toLowerCase()}`}
              >
                <Icon
                  size={14}
                  color={isActive ? AppColors.white : AppColors.textPrimary}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── DESTINATIONS LIST ────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredDestinations.length === 0 ? (
          <View style={styles.emptyContainer} testID="all-destinations-empty-state">
            <View style={styles.emptyIconCircle}>
              <MapPin size={32} color={AppColors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No destinations found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search query or selecting a different category filter.
            </Text>
            <TouchableOpacity
              style={styles.resetFiltersBtn}
              onPress={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.resetFiltersText}>Reset filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredDestinations.map((dest) => (
            <TouchableOpacity
              key={dest.id}
              style={styles.card}
              activeOpacity={0.92}
              onPress={() => handleDestinationPress(dest)}
              testID={`destination-item-${dest.id}`}
            >
              {/* Card Banner Image */}
              <View style={styles.cardImageWrap}>
                <Image source={{ uri: dest.imageUri }} style={styles.cardImage} />
                <View style={styles.imageGradientOverlay} />

                {/* Top Badge: Category */}
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {dest.category.toUpperCase()}
                  </Text>
                </View>

                {/* Top-Right Badge: Reels Count */}
                <View style={styles.reelsBadge}>
                  <Calendar size={11} color={AppColors.white} />
                  <Text style={styles.reelsBadgeText}>{dest.reelsCountText}</Text>
                </View>

                {/* Bottom Overlay Title & Location */}
                <View style={styles.imageBottomInfo}>
                  <Text style={styles.cardDestName}>{dest.name}</Text>
                  <View style={styles.cardLocationRow}>
                    <MapPin size={12} color={AppColors.white} />
                    <Text style={styles.cardLocationText}>
                      {dest.name}, {dest.country}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                {/* Rating & Reviews row */}
                {typeof dest.rating === 'number' && dest.rating > 0 && (
                  <View style={styles.ratingRow}>
                    <View style={styles.starBadge}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingValue}>{dest.rating.toFixed(1)}</Text>
                    </View>
                    {dest.reviewsCount ? (
                      <Text style={styles.reviewsCountText}>
                        ({dest.reviewsCount.toLocaleString()} reviews)
                      </Text>
                    ) : null}
                    {dest.vibe ? (
                      <View style={styles.vibePill}>
                        <Sparkles size={10} color={AppColors.primary} />
                        <Text style={styles.vibeText} numberOfLines={1}>
                          {dest.vibe.split(',')[0]}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}

                {/* Description */}
                {dest.description ? (
                  <Text style={styles.descriptionText} numberOfLines={2}>
                    {dest.description}
                  </Text>
                ) : null}

                {/* Popular Places Mini Chips */}
                {dest.popularPlaces && dest.popularPlaces.length > 0 && (
                  <View style={styles.placesContainer}>
                    <Text style={styles.placesHeading}>Popular Highlights:</Text>
                    <View style={styles.placesRow}>
                      {dest.popularPlaces.slice(0, 3).map((place) => (
                        <TouchableOpacity
                          key={place.id}
                          style={styles.placePill}
                          onPress={() => handlePlacePress(place.id, place.name)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.placePillText} numberOfLines={1}>
                            {place.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Footer Action */}
                <View style={styles.cardFooter}>
                  <Text style={styles.exploreCtaText}>Explore destination details</Text>
                  <ChevronRight size={16} color={AppColors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* ── BOTTOM NAVIGATION BAR ─────────────────────────────────── */}
      <BottomNavBar active="explore" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FAF8F5',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textMuted,
    marginTop: 2,
  },
  headerRightSpacer: {
    width: 44,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    paddingHorizontal: 14,
    height: 44,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: AppColors.textPrimary,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  categoriesContainer: {
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  categoryChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  categoryChipTextActive: {
    color: AppColors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  resetFiltersBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: AppColors.primary,
  },
  resetFiltersText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.white,
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageWrap: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(14, 116, 144, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: AppColors.white,
    letterSpacing: 0.5,
  },
  reelsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reelsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.white,
  },
  imageBottomInfo: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
  },
  cardDestName: {
    fontSize: 22,
    fontWeight: '900',
    color: AppColors.white,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  cardLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cardBody: {
    padding: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  reviewsCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textMuted,
  },
  vibePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  vibeText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.primary,
  },
  descriptionText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  placesContainer: {
    marginBottom: 12,
    paddingTop: 4,
  },
  placesHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  placesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  placePill: {
    backgroundColor: '#F3EFE8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  placePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3EFE8',
  },
  exploreCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primary,
  },
});
