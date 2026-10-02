import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Rect, G, Text as SvgText } from 'react-native-svg';
import {
  X,
  MoreVertical,
  Calendar,
  Package,
  ChevronRight,
  Plane,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { UGCContentDisplay } from '../../ugc/components/UGCContentDisplay';

/**
 * Hero Travel Illustration (Map, plane route, postcard sketch)
 */
const TripHeroGraphic = () => (
  <View style={styles.heroGraphicContainer} pointerEvents="none">
    <Svg width="150" height="110" viewBox="0 0 150 110" fill="none">
      {/* Soft Map Silhouette */}
      <Path
        d="M20 40 C40 20, 80 15, 120 30 C140 40, 145 70, 130 90 C110 105, 60 100, 30 85 C15 75, 10 55, 20 40 Z"
        fill="#E2F1F8"
        opacity={0.6}
      />
      
      {/* Dashed flight path */}
      <Path
        d="M 30 75 C 50 60, 75 45, 110 30"
        stroke="#0E7490"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeOpacity={0.6}
        fill="none"
      />
      
      {/* Small Plane */}
      <G transform="translate(105, 24) rotate(-25)">
        <Path
          d="M0 0 L7 2.5 L10 0 L8.5 4 L12 5.5 L8.5 6.5 L7.5 10 L6 6.5 L1.5 7.5 L3 5 Z"
          fill="#0E7490"
          opacity={0.9}
        />
      </G>

      {/* Postcard with Eiffel Sketch */}
      <G transform="translate(95, 38) rotate(6)">
        <Rect
          x="0"
          y="0"
          width="42"
          height="56"
          rx="4"
          fill="#FFFFFF"
          stroke="#E5E0D8"
          strokeWidth="1"
        />
        {/* Eiffel Tower Outline inside postcard */}
        <Path
          d="M21 8 L15 42 M21 8 L27 42 M17 22 L25 22 M15 32 L27 32 M13 42 C17 38, 25 38, 29 42"
          stroke="#10243F"
          strokeWidth="1"
          strokeOpacity={0.6}
        />
        <SvgText
          x="10"
          y="50"
          fontSize="6"
          fontWeight="bold"
          fill="#10243F"
          opacity={0.5}
        >
          PARIS
        </SvgText>
      </G>

      {/* Location Pin */}
      <Circle cx="120" cy="22" r="14" fill="#FFE8E2" opacity={0.8} />
      <Circle cx="120" cy="22" r="6" fill="#FF6B4A" />
    </Svg>
  </View>
);

export default function TripDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripDetails'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripDetails'>>();
  const tripId = route.params?.tripId || '1';
  const destination = 'Paris, France';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <X size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
          <MoreVertical size={22} color={AppColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Destination Hero Row */}
        <View style={styles.heroRow}>
          <View style={styles.heroTextCol}>
            <Text style={styles.destTitle}>{destination}</Text>
            <View style={styles.dateRow}>
              <Calendar size={14} color={AppColors.textMuted} />
              <Text style={styles.destDates}>Sept 10 - Sept 17, 2026</Text>
            </View>
            <View style={styles.daysBadge}>
              <Plane size={12} color={AppColors.primary} />
              <Text style={styles.daysBadgeText}>7 Days • 6 Nights</Text>
            </View>
          </View>
          <TripHeroGraphic />
        </View>

        {/* Quick Action Cards */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ItineraryView', { tripId })}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <Calendar size={18} color={AppColors.primary} />
            </View>
            <Text style={styles.actionCardText}>View Itinerary</Text>
            <ChevronRight size={16} color={AppColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('PackingList', { tripId })}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <Package size={18} color={AppColors.success} />
            </View>
            <Text style={styles.actionCardText}>Packing List</Text>
            <ChevronRight size={16} color={AppColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Events & Activities Banner */}
        <TouchableOpacity
          style={styles.eventsBannerBtn}
          onPress={() =>
            navigation.navigate('EventsFeed', {
              destinationId: 'paris',
              destinationName: destination,
            })
          }
          activeOpacity={0.85}
        >
          <View style={styles.eventsBannerTextCol}>
            <Text style={styles.eventsBannerTitle}>🎉 Explore {destination} Events & Activities</Text>
            <Text style={styles.eventsBannerSubtitle}>Browse live festivals, food walks & concerts</Text>
          </View>
          <View style={styles.eventsBannerChevronWrap}>
            <ChevronRight size={16} color={AppColors.primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.sectionSpacer} />

        {/* Destination UGC / Traveler Stories Display */}
        <UGCContentDisplay
          destination={destination}
          tripId={tripId}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF7F2' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF7F2',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: AppColors.textPrimary },
  headerIconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  
  /* Hero Row */
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 18,
    position: 'relative',
  },
  heroTextCol: {
    flex: 1,
  },
  destTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  destDates: { fontSize: 13, color: AppColors.textMuted, fontWeight: '500' },
  daysBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  daysBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
  },
  heroGraphicContainer: {
    width: 130,
    height: 100,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  /* Action Cards */
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionCard: {
    flex: 1,
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    backgroundColor: AppColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionCardText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },

  /* Events Banner */
  eventsBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 18,
  },
  eventsBannerTextCol: {
    flex: 1,
  },
  eventsBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  eventsBannerSubtitle: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  eventsBannerChevronWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sectionSpacer: {
    height: 6,
  },
});