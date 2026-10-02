import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
import { Review } from '../types/reviewTypes';
import { useReviewData } from '../hooks/useReviewData';
import { AppColors } from '../../../core/theme/colors';


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

function SkeletonReviewCard() {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeaderRow}>
        <SkeletonBlock style={styles.skeletonAvatar} />
        <View style={styles.skeletonAuthorBlock}>
          <SkeletonBlock style={styles.skeletonName} />
          <SkeletonBlock style={styles.skeletonTime} />
        </View>
      </View>
      <SkeletonBlock style={styles.skeletonStars} />
      <SkeletonBlock style={styles.skeletonLineFull} />
      <SkeletonBlock style={styles.skeletonLineShort} />
    </View>
  );
}

export default function ReviewsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'Reviews'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'Reviews'>>();
  const placeId = route.params?.placeId ?? '';

  const { data, isLoading, isError, retry } = useReviewData(placeId);

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

      {isError ? (
        <ErrorState message="Reviews couldn't be loaded. Try again." onRetry={retry} />
      ) : isLoading || !data ? (
        <ScrollView contentContainerStyle={styles.content}>
          <SkeletonBlock style={styles.skeletonRatingNumber} />
          <SkeletonBlock style={styles.skeletonRatingLabel} />
          <SkeletonBlock style={styles.skeletonWriteButton} />
          <SkeletonBlock style={styles.skeletonSummaryCard} />
          <SkeletonReviewCard />
          <SkeletonReviewCard />
        </ScrollView>
      ) : (
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
          {data.reviews.length === 0 ? (
            <EmptyState icon="✍️" message="No reviews yet. Be the first to share your experience!" />
          ) : (
            data.reviews.map(review => <ReviewCard key={review.id} review={review} />)
          )}
        </ScrollView>
      )}
      <BottomNavBar active="explore" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerTitle: { ...Typography.screenTitle, color: AppColors.textPrimary },
  headerPlaceholder: { width: 44 },

  content: { padding: 20, paddingBottom: 24 },

  starRow: { flexDirection: 'row' },
  star: { marginRight: 1 },
  starFilled: { color: AppColors.gold },
  starEmpty: { color: AppColors.border },

  ratingNumber: { fontSize: 40, fontWeight: '800', color: AppColors.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 20, gap: 8 },
  ratingCount: { ...Typography.smallDetail, color: AppColors.textMuted },

  writeReviewButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 26,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 24,
  },
  writeReviewButtonText: { color: AppColors.white, fontWeight: '700', fontSize: 15 },

  aiSummaryCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
    marginBottom: 24,
    shadowColor: AppColors.black,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  aiSummaryHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  aiSummaryTitle: { ...Typography.sectionHeading, color: AppColors.textPrimary },
  betaBadge: { backgroundColor: AppColors.primaryLight, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  betaBadgeText: { fontSize: 11, fontWeight: '700', color: AppColors.primaryDark },
  aiSummaryParagraph: { ...Typography.body, color: AppColors.textSecondary, lineHeight: 19, marginBottom: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { backgroundColor: AppColors.primaryLight, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  tagChipText: { ...Typography.smallDetail, fontWeight: '600', color: AppColors.primaryDark },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { ...Typography.sectionHeading, color: AppColors.textPrimary },
  filtersButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filtersIcon: { fontSize: 13, color: AppColors.primary },
  filtersText: { fontSize: 13, fontWeight: '600', color: AppColors.primary },

  reviewCard: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: AppColors.borderLight },
  reviewHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewAvatarEmoji: { fontSize: 16 },
  reviewAuthorBlock: { flex: 1 },
  reviewAuthorName: { ...Typography.contentName, color: AppColors.textPrimary },
  reviewTimeAgo: { ...Typography.smallDetail, color: AppColors.textMuted, marginTop: 1 },
  reviewStarsRow: { marginBottom: 6 },
  reviewText: { ...Typography.body, color: AppColors.textPrimary, lineHeight: 19 },
  skeletonRatingNumber: { width: 100, height: 40, marginBottom: 12 },
  skeletonRatingLabel: { width: 160, height: 16, marginBottom: 20 },
  skeletonWriteButton: { width: '100%', height: 48, borderRadius: 26, marginBottom: 24 },
  skeletonSummaryCard: { width: '100%', height: 140, borderRadius: 16, marginBottom: 24 },
  skeletonAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  skeletonAuthorBlock: { flex: 1 },
  skeletonName: { width: '40%', height: 13, marginBottom: 6 },
  skeletonTime: { width: '25%', height: 10 },
  skeletonStars: { width: 100, height: 12, marginBottom: 8 },
  skeletonLineFull: { width: '100%', height: 13, marginBottom: 4 },
  skeletonLineShort: { width: '80%', height: 13 },
});