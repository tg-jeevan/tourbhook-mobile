import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Share2,
  Star,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  Video,
  Users,
  Compass,
  Check,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { UGCContentDisplay } from '../../ugc/components/UGCContentDisplay';
import { getDestinationByNameOrId } from '../data/mockExploreData';
import { getMockTravelGroups } from '../../groups/types/groupTypes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DestinationDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, 'DestinationDetails'>>();

  const destinationName = route.params?.destinationName || 'Paris, France';
  const destinationId = route.params?.destinationId;

  const destination = getDestinationByNameOrId(destinationId || destinationName);
  const groups = getMockTravelGroups();

  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);

  const handleToggleJoin = (groupId: string) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups((prev) => prev.filter((id) => id !== groupId));
    } else {
      setJoinedGroups((prev) => [...prev, groupId]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ── TOP HEADER ───────────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={AppColors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {destination.name}, {destination.country}
        </Text>

        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Share2 size={20} color={AppColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO BANNER ─────────────────────────────────────────── */}
        <View style={styles.heroBannerWrap}>
          <Image source={{ uri: destination.imageUri }} style={styles.heroImage} />
          <View style={styles.heroGradientOverlay} />

          <View style={styles.heroBadgeRow}>
            <View style={styles.countryBadge}>
              <MapPin size={12} color={AppColors.white} />
              <Text style={styles.countryBadgeText}>{destination.country}</Text>
            </View>

            <View style={styles.reelsCountBadge}>
              <Video size={12} color={AppColors.white} />
              <Text style={styles.reelsCountBadgeText}>{destination.reelsCountText}</Text>
            </View>
          </View>

          <View style={styles.heroBottomTextWrap}>
            <Text style={styles.heroDestTitle}>{destination.name}</Text>
            <View style={styles.ratingRow}>
              <Star size={14} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingText}>
                {destination.rating} ({destination.reviewsCount} reviews)
              </Text>
            </View>
          </View>
        </View>

        {/* ── OVERVIEW & QUICK INFO ────────────────────────────────── */}
        <View style={styles.overviewSection}>
          <Text style={styles.overviewText}>{destination.description}</Text>

          <View style={styles.quickInfoGrid}>
            <View style={styles.quickInfoCard}>
              <Calendar size={16} color={AppColors.primary} />
              <Text style={styles.quickInfoLabel}>Best Season</Text>
              <Text style={styles.quickInfoValue} numberOfLines={2}>
                {destination.bestSeason}
              </Text>
            </View>

            <View style={styles.quickInfoCard}>
              <Sparkles size={16} color={AppColors.accent} />
              <Text style={styles.quickInfoLabel}>Travel Vibe</Text>
              <Text style={styles.quickInfoValue} numberOfLines={2}>
                {destination.vibe}
              </Text>
            </View>
          </View>
        </View>

        {/* ── POPULAR PLACES IN THIS DESTINATION ───────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={[styles.sectionIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Compass size={16} color={AppColors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Popular Places</Text>
            </View>
          </View>

          <View style={styles.placesList}>
            {destination.popularPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.placeCard}
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate('PlaceDetails', {
                    placeId: place.id,
                    placeName: place.name,
                  })
                }
              >
                <Image source={{ uri: place.imageUri }} style={styles.placeThumb} />
                <View style={styles.placeDetailsCol}>
                  <View style={styles.placeTopRow}>
                    <Text style={styles.placeName} numberOfLines={1}>
                      {place.name}
                    </Text>
                    <View style={styles.placeCategoryPill}>
                      <Text style={styles.placeCategoryText}>{place.category}</Text>
                    </View>
                  </View>

                  <Text style={styles.placeShortDesc} numberOfLines={2}>
                    {place.shortDesc}
                  </Text>

                  <View style={styles.placeRatingRow}>
                    <Star size={12} color="#FBBF24" fill="#FBBF24" />
                    <Text style={styles.placeRatingText}>
                      {place.rating} ({place.reviewsCount} reviews)
                    </Text>
                    <ChevronRight size={14} color={AppColors.textMuted} style={styles.placeChevron} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── EVENTS & ACTIVITIES BANNER ───────────────────────────── */}
        <TouchableOpacity
          style={styles.eventsBanner}
          activeOpacity={0.88}
          onPress={() =>
            navigation.navigate('EventsFeed', {
              destinationId: destination.id.replace('dest-', ''),
              destinationName: `${destination.name}, ${destination.country}`,
            })
          }
        >
          <View style={styles.eventsBannerTextWrap}>
            <Text style={styles.eventsBannerTitle}>
              🎉 Explore {destination.name} Events & Activities
            </Text>
            <Text style={styles.eventsBannerSubtitle}>
              Live festivals, food tours, concerts & excursions
            </Text>
          </View>
          <View style={styles.eventsBannerIconWrap}>
            <ChevronRight size={18} color={AppColors.primary} />
          </View>
        </TouchableOpacity>

        {/* ── TRAVELER REELS & SHORTS SECTION ──────────────────────── */}
        <View style={styles.sectionWrap}>
          <UGCContentDisplay
            destination={`${destination.name}, ${destination.country}`}
          />
        </View>

        {/* ── SUGGESTED TRAVEL GROUPS ──────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={[styles.sectionIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Users size={16} color="#059669" />
              </View>
              <Text style={styles.sectionTitle}>Join {destination.name} Groups</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('GroupMatching')}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>See all →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.groupsList}>
            {groups.slice(0, 2).map((group) => {
              const isJoined = joinedGroups.includes(group.id);
              return (
                <View key={group.id} style={styles.groupCard}>
                  <View style={styles.groupMainInfo}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupDesc} numberOfLines={2}>
                      {group.description}
                    </Text>
                    <Text style={styles.groupMembersText}>
                      👥 {group.memberCount}/{group.maxMembers} travelers joined
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.joinBtn, isJoined && styles.joinedBtn]}
                    onPress={() => handleToggleJoin(group.id)}
                    activeOpacity={0.85}
                  >
                    {isJoined ? (
                      <>
                        <Check size={13} color={AppColors.white} />
                        <Text style={styles.joinedBtnText}>Joined</Text>
                      </>
                    ) : (
                      <Text style={styles.joinBtnText}>Join</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* ── BOTTOM NAVIGATION ────────────────────────────────────── */}
      <BottomNavBar active="explore" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF7F2',
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  /* Hero Banner */
  heroBannerWrap: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 4,
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 36, 63, 0.35)',
  },
  heroBadgeRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  countryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.white,
  },
  reelsCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(14, 116, 144, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  reelsCountBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.white,
  },
  heroBottomTextWrap: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
  },
  heroDestTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: AppColors.white,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.white,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* Overview */
  overviewSection: {
    marginBottom: 20,
  },
  overviewText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  quickInfoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 12,
    gap: 4,
  },
  quickInfoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textMuted,
    marginTop: 2,
  },
  quickInfoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textPrimary,
    lineHeight: 16,
  },

  /* Sections */
  sectionWrap: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primary,
  },

  /* Places */
  placesList: {
    gap: 10,
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 10,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  placeThumb: {
    width: 80,
    height: 80,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  placeDetailsCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  placeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeName: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
    flex: 1,
  },
  placeCategoryPill: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  placeCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.primary,
  },
  placeShortDesc: {
    fontSize: 11,
    color: AppColors.textMuted,
    lineHeight: 15,
    marginTop: 2,
  },
  placeRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  placeRatingText: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
    flex: 1,
  },
  placeChevron: {
    marginLeft: 'auto',
  },

  /* Events Banner */
  eventsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 14,
    marginBottom: 20,
  },
  eventsBannerTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  eventsBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  eventsBannerSubtitle: {
    fontSize: 11,
    color: AppColors.textMuted,
  },
  eventsBannerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Groups */
  groupsList: {
    gap: 10,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 14,
  },
  groupMainInfo: {
    flex: 1,
    paddingRight: 12,
  },
  groupName: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  groupDesc: {
    fontSize: 11,
    color: AppColors.textMuted,
    lineHeight: 15,
    marginBottom: 4,
  },
  groupMembersText: {
    fontSize: 11,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  joinBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  joinBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.white,
  },
  joinedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
  },
  joinedBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.white,
  },
});
