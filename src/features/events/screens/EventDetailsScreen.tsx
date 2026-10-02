import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Bookmark,
  Building2,
  Ticket,
  CheckCircle2,
  Navigation,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { MOCK_EVENTS } from '../data/mockEventsData';
import { AppColors } from '../../../core/theme/colors';

export default function EventDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, 'EventDetails'>>();
  const eventId = route.params?.eventId;

  const [isSaved, setIsSaved] = useState(false);
  const [isAddedToTrip, setIsAddedToTrip] = useState(false);

  const event = MOCK_EVENTS.find((e) => e.id === eventId) || MOCK_EVENTS[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${event.title} in ${event.destination} on Tourbhook!`,
      });
    } catch {
      // Ignored
    }
  };

  const handleAddToItinerary = () => {
    setIsAddedToTrip(!isAddedToTrip);
    Alert.alert(
      !isAddedToTrip ? 'Added to Itinerary' : 'Removed from Itinerary',
      !isAddedToTrip
        ? `"${event.title}" has been scheduled into your travel itinerary.`
        : `"${event.title}" was removed from your itinerary.`
    );
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setIsSaved(!isSaved)}
            activeOpacity={0.7}
          >
            <Bookmark
              size={20}
              color={isSaved ? AppColors.accent : AppColors.textPrimary}
              fill={isSaved ? AppColors.accent : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare} activeOpacity={0.7}>
            <Share2 size={20} color={AppColors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: event.imageUrl }} style={styles.image} />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{event.category}</Text>
          </View>
          {event.price && (
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeText}>{event.price}</Text>
            </View>
          )}
        </View>

        {/* Title and Destination */}
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.destinationText}>{event.destination}</Text>

        {/* Info Grid Cards */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <Calendar size={18} color={AppColors.primary} />
            </View>
            <View style={styles.infoDetails}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{formatDateDisplay(event.date)}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <Clock size={18} color={AppColors.primary} />
            </View>
            <View style={styles.infoDetails}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{event.time}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <MapPin size={18} color={AppColors.primary} />
            </View>
            <View style={styles.infoDetails}>
              <Text style={styles.infoLabel}>Location & Venue</Text>
              <Text style={styles.infoValue}>{event.location}</Text>
              {event.venueAddress && (
                <Text style={styles.infoSubValue}>{event.venueAddress}</Text>
              )}
            </View>
          </View>

          {event.organizer && (
            <>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIconBg}>
                  <Building2 size={18} color={AppColors.primary} />
                </View>
                <View style={styles.infoDetails}>
                  <Text style={styles.infoLabel}>Organized by</Text>
                  <Text style={styles.infoValue}>{event.organizer}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* About / Description */}
        <Text style={styles.sectionTitle}>About This Event</Text>
        <Text style={styles.descriptionText}>{event.fullDescription}</Text>

        {/* Highlights / Admission info */}
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>Visitor Information</Text>
          <View style={styles.bulletItem}>
            <CheckCircle2 size={16} color={AppColors.primary} />
            <Text style={styles.bulletText}>Instant digital ticket confirmation & mobile entry</Text>
          </View>
          <View style={styles.bulletItem}>
            <CheckCircle2 size={16} color={AppColors.primary} />
            <Text style={styles.bulletText}>English & local language support on site</Text>
          </View>
          <View style={styles.bulletItem}>
            <CheckCircle2 size={16} color={AppColors.primary} />
            <Text style={styles.bulletText}>Syncs directly with your Tourbhook itinerary map</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryActionBtn, isAddedToTrip && styles.primaryActionBtnAdded]}
          onPress={handleAddToItinerary}
          activeOpacity={0.85}
        >
          {isAddedToTrip ? (
            <>
              <CheckCircle2 size={20} color={AppColors.white} />
              <Text style={styles.primaryActionBtnText}>Saved in Itinerary</Text>
            </>
          ) : (
            <>
              <Ticket size={20} color={AppColors.white} />
              <Text style={styles.primaryActionBtnText}>Add to Itinerary</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
    backgroundColor: AppColors.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AppColors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  imageWrap: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: AppColors.surfaceMuted,
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(16, 36, 63, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceBadgeText: {
    color: AppColors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.textPrimary,
    lineHeight: 30,
    marginBottom: 4,
  },
  destinationText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  infoDetails: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  infoSubValue: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: AppColors.borderLight,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: AppColors.textSecondary,
    lineHeight: 23,
    marginBottom: 24,
  },
  highlightCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 10,
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulletText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
    backgroundColor: AppColors.surface,
  },
  primaryActionBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryActionBtnAdded: {
    backgroundColor: AppColors.success,
  },
  primaryActionBtnText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
