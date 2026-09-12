import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { getMockReviewData, Review } from '../types/reviewTypes';

const GREEN = '#1FAE5D';
const GREEN_LIGHT = '#E6F7EC';
const TEXT_DARK = '#1A1A2E';
const TEXT_MUTED = '#8E8E93';
const GOLD = '#F5A623';
const PURPLE = '#7C5CFC';
const PURPLE_LIGHT = '#F1EDFF';
const AMBER = '#E8871E';

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(position => (
        <Text
          key={position}
          style={[styles.star, { fontSize: size }, position <= rating ? styles.starFilled : styles.starEmpty]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeaderRow}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.reviewAvatarEmoji}>{review.authorAvatarEmoji}</Text>
        </View>
        <View style={styles.reviewAuthorBlock}>
          <Text style={styles.reviewAuthorName}>{review.authorName}</Text>
          <Text style={styles.reviewTimeAgo}>{review.timeAgo}</Text>
        </View>
      </View>
      <View style={styles.reviewStarsRow}>
        <StarRow rating={review.rating} size={13} />
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>
    </View>
  );
}

export default function ReviewsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'Reviews'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'Reviews'>>();
  const placeId = route.params?.placeId ?? '';

  const data = useMemo(() => getMockReviewData(placeId), [placeId]);

  const handleWriteReview = () => {
    console.log('Write a review tapped for place:', placeId);
  };

  const handleFilters = () => {
    console.log('Filters tapped');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.ratingNumber}>{data.averageRating.toFixed(1)}</Text>
        <View style={styles.ratingRow}>
          <StarRow rating={Math.round(data.averageRating)} size={18} />
          <Text style={styles.ratingCount}>{data.totalReviews.toLocaleString()} reviews</Text>
        </View>

        <TouchableOpacity style={styles.writeReviewButton} activeOpacity={0.85} onPress={handleWriteReview}>
          <Text style={styles.writeReviewButtonText}>Write a review</Text>
        </TouchableOpacity>

        <View style={styles.aiSummaryCard}>
          <View style={styles.aiSummaryHeaderRow}>
            <Text style={styles.aiSummaryTitle}>AI Summary</Text>
            <View style={styles.betaBadge}>
              <Text style={styles.betaBadgeText}>Beta</Text>
            </View>
          </View>
          <Text style={styles.aiSummaryParagraph}>{data.aiSummary.paragraph}</Text>
          <View style={styles.tagRow}>
            {data.aiSummary.tags.map(tag => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Traveler Reviews</Text>
          <TouchableOpacity style={styles.filtersButton} onPress={handleFilters}>
            <Text style={styles.filtersIcon}>⚙</Text>
            <Text style={styles.filtersText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {data.reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ScrollView>
        <BottomNavBar active="explore" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: TEXT_DARK },
  headerPlaceholder: { width: 44 },

  content: { padding: 24, paddingBottom: 24 },

  starRow: { flexDirection: 'row' },
  star: { marginRight: 1 },
  starFilled: { color: GOLD },
  starEmpty: { color: '#E0E0E0' },

  ratingNumber: { fontSize: 40, fontWeight: '800', color: TEXT_DARK },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 20, gap: 8 },
  ratingCount: { fontSize: 13, color: TEXT_MUTED },

  writeReviewButton: {
    backgroundColor: GREEN,
    borderRadius: 26,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 24,
  },
  writeReviewButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

  aiSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFF2',
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  aiSummaryHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  aiSummaryTitle: { fontSize: 15, fontWeight: '700', color: TEXT_DARK },
  betaBadge: { backgroundColor: PURPLE_LIGHT, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  betaBadgeText: { fontSize: 11, fontWeight: '700', color: PURPLE },
  aiSummaryParagraph: { fontSize: 13, color: TEXT_MUTED, lineHeight: 19, marginBottom: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { backgroundColor: GREEN_LIGHT, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  tagChipText: { fontSize: 12, fontWeight: '600', color: GREEN },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  filtersButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filtersIcon: { fontSize: 13, color: AMBER },
  filtersText: { fontSize: 13, fontWeight: '600', color: AMBER },

  reviewCard: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  reviewHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GREEN_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewAvatarEmoji: { fontSize: 16 },
  reviewAuthorBlock: { flex: 1 },
  reviewAuthorName: { fontSize: 14, fontWeight: '700', color: TEXT_DARK },
  reviewTimeAgo: { fontSize: 11, color: TEXT_MUTED, marginTop: 1 },
  reviewStarsRow: { marginBottom: 6 },
  reviewText: { fontSize: 13, color: TEXT_DARK, lineHeight: 19 },
});