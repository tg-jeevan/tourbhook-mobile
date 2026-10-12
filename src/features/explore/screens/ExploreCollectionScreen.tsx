import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, Play } from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { BackButton } from '../../../core/components/BackButton';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { EmptyState } from '../../../core/components/EmptyState';
import { DestinationItem } from '../types/exploreTypes';
import { MOCK_DESTINATIONS, MOCK_EXPLORE_REELS } from '../data/mockExploreData';
import { UGCItem } from '../../ugc/types/ugcTypes';

const PAGE_PADDING = 20;
const GRID_GAP = 12;

type CollectionNavigation = NativeStackNavigationProp<AppStackParamList, 'ExploreCollection'>;
type CollectionRoute = RouteProp<AppStackParamList, 'ExploreCollection'>;

interface ReelCardProps {
  reel: UGCItem;
  width: number;
  onPress: () => void;
}

interface DestinationCardProps {
  destination: DestinationItem;
  width: number;
  onPress: () => void;
}

const approvedReels = MOCK_EXPLORE_REELS.filter(reel => reel.status === 'approved');

function ReelGridCard({ reel, width, onPress }: ReelCardProps) {
  return (
    <TouchableOpacity
      style={[styles.reelCard, { width, height: Math.round(width * 1.52) }]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`View reel: ${reel.title}`}
    >
      <Image source={{ uri: reel.thumbnailUrl }} style={styles.fillImage} />
      <View style={styles.reelTint} />

      <View style={styles.durationPill}>
        <Play size={10} color={AppColors.white} fill={AppColors.white} />
        <Text style={styles.durationText}>{reel.duration || '0:45'}</Text>
      </View>

      <View style={styles.reelContent}>
        <Text style={styles.reelTitle} numberOfLines={2}>
          {reel.title}
        </Text>
        <View style={styles.creatorRow}>
          {reel.creatorAvatar ? (
            <Image source={{ uri: reel.creatorAvatar }} style={styles.creatorAvatar} />
          ) : (
            <View style={styles.creatorAvatarFallback}>
              <Text style={styles.creatorInitial}>
                {reel.creatorHandle?.[1]?.toUpperCase() || 'T'}
              </Text>
            </View>
          )}
          <Text style={styles.creatorHandle} numberOfLines={1}>
            {reel.creatorHandle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function DestinationGridCard({ destination, width, onPress }: DestinationCardProps) {
  return (
    <TouchableOpacity
      style={[styles.destinationCard, { width, height: Math.round(width * 1.38) }]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`View ${destination.name}, ${destination.country}`}
    >
      <Image source={{ uri: destination.imageUri }} style={styles.destinationImage} />
      <View style={styles.destinationImageTint} />

      <View style={styles.destinationContent}>
        <View>
          <Text style={styles.destinationName} numberOfLines={1}>
            {destination.name}
          </Text>
          <Text style={styles.destinationCountry} numberOfLines={1}>
            {destination.country}
          </Text>
        </View>

        <View style={styles.reelsBadge}>
          <Calendar size={10} color={AppColors.primary} />
          <Text style={styles.reelsBadgeText}>{destination.reelsCountText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ExploreCollectionScreen() {
  const navigation = useNavigation<CollectionNavigation>();
  const route = useRoute<CollectionRoute>();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const availableWidth = screenWidth - insets.left - insets.right;
  const cardWidth = Math.floor((availableWidth - PAGE_PADDING * 2 - GRID_GAP) / 2);
  const isReelsCollection = route.params.contentType === 'reels';

  const openReel = useCallback(
    (reel: UGCItem) => {
      navigation.navigate('ReelViewer', { reelId: reel.id, reel });
    },
    [navigation]
  );

  const openDestination = useCallback(
    (destination: DestinationItem) => {
      navigation.navigate('DestinationDetails', {
        destinationId: destination.id,
        destinationName: `${destination.name}, ${destination.country}`,
      });
    },
    [navigation]
  );

  const renderReel: ListRenderItem<UGCItem> = useCallback(
    ({ item }) => (
      <ReelGridCard reel={item} width={cardWidth} onPress={() => openReel(item)} />
    ),
    [cardWidth, openReel]
  );

  const renderDestination: ListRenderItem<DestinationItem> = useCallback(
    ({ item }) => (
      <DestinationGridCard
        destination={item}
        width={cardWidth}
        onPress={() => openDestination(item)}
      />
    ),
    [cardWidth, openDestination]
  );

  const title = isReelsCollection ? 'Travel Reels' : 'Popular Destinations';
  const subtitle = isReelsCollection
    ? 'Watch every travel story shared by our community.'
    : 'Explore every destination inspiring our travelers.';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      {isReelsCollection ? (
        <FlatList
          data={approvedReels}
          renderItem={renderReel}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState icon="🎬" message="No travel reels are available yet." />
          }
        />
      ) : (
        <FlatList
          data={MOCK_DESTINATIONS}
          renderItem={renderDestination}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState icon="🧭" message="No destinations are available yet." />
          }
        />
      )}

      <BottomNavBar active="explore" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.surfaceSubtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: PAGE_PADDING,
    paddingTop: 4,
    paddingBottom: 14,
  },
  headerText: {
    flex: 1,
    paddingTop: 4,
    paddingRight: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: AppColors.textMuted,
  },
  gridContent: {
    paddingHorizontal: PAGE_PADDING,
    paddingBottom: 24,
    flexGrow: 1,
  },
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  reelCard: {
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: AppColors.navigation,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 3,
  },
  fillImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  reelTint: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(16, 36, 63, 0.28)',
  },
  durationPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  durationText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.white,
  },
  reelContent: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    padding: 12,
    paddingTop: 24,
    backgroundColor: 'rgba(5, 11, 20, 0.66)',
  },
  reelTitle: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    color: AppColors.white,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creatorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.white,
  },
  creatorAvatarFallback: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.accent,
  },
  creatorInitial: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.white,
  },
  creatorHandle: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  destinationCard: {
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  destinationImage: {
    width: '100%',
    height: '58%',
    resizeMode: 'cover',
  },
  destinationImageTint: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: '58%',
    backgroundColor: 'rgba(16, 36, 63, 0.1)',
  },
  destinationContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  destinationName: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  destinationCountry: {
    marginTop: 2,
    fontSize: 11,
    color: AppColors.textMuted,
  },
  reelsBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: AppColors.infoLight,
  },
  reelsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.primary,
  },
});
