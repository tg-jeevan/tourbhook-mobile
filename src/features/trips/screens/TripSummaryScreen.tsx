import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Pencil,
  ArrowRight,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { TripFlowProgressHeader } from '../components/TripFlowProgressHeader';

export default function TripSummaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripSummary'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripSummary'>>();
  const params = route.params;

  const destination = params?.destination || 'Paris, France';
  const startDate = params?.startDate || 'Sept 12, 2026';
  const endDate = params?.endDate || 'Sept 17, 2026';
  const travelers = params?.travelers || 2;
  const preferences = params?.preferences && params.preferences.length > 0
    ? params.preferences
    : ['Adventure', 'Relaxation'];

  const getDestinationImage = () => {
    const q = destination.toLowerCase();
    if (q.includes('tokyo') || q.includes('japan')) {
      return 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80';
    }
    if (q.includes('kerala') || q.includes('india') || q.includes('bali')) {
      return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80';
    }
    // Default Paris
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80';
  };

  const handleEdit = () => {
    navigation.goBack();
  };

  const handleConfirm = () => {
    navigation.navigate('TripDetails', { tripId: '1' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ── PROGRESS HEADER ───────────────────────────────────────── */}
      <TripFlowProgressHeader
        currentStep={3}
        onBack={() => navigation.goBack()}
        showCloseIcon={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO TITLE ───────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Trip Summary</Text>
          <Text style={styles.heroSubtitle}>
            Review your details and let's create{'\n'}your itinerary
          </Text>
        </View>

        {/* ── SUMMARY DETAILS CARD ─────────────────────────────────── */}
        <View style={styles.summaryCard}>
          {/* Row 1: Destination */}
          <View style={styles.summaryRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <MapPin size={18} color="#0284C7" />
            </View>
            <View style={styles.summaryTextCol}>
              <Text style={styles.summaryLabel}>Destination</Text>
              <Text style={styles.summaryValue}>{destination}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={handleEdit} activeOpacity={0.7}>
              <Pencil size={13} color={AppColors.textMuted} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Row 2: Travel Dates */}
          <View style={styles.summaryRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Calendar size={18} color="#059669" />
            </View>
            <View style={styles.summaryTextCol}>
              <Text style={styles.summaryLabel}>Travel Dates</Text>
              <Text style={styles.summaryValue}>
                {startDate} – {endDate}
              </Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={handleEdit} activeOpacity={0.7}>
              <Pencil size={13} color={AppColors.textMuted} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Row 3: Number of Travelers */}
          <View style={styles.summaryRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFEDD5' }]}>
              <Users size={18} color="#EA580C" />
            </View>
            <View style={styles.summaryTextCol}>
              <Text style={styles.summaryLabel}>Number of Travelers</Text>
              <Text style={styles.summaryValue}>{travelers} Travelers</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={handleEdit} activeOpacity={0.7}>
              <Pencil size={13} color={AppColors.textMuted} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Row 4: Interests */}
          <View style={styles.summaryRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Star size={18} color="#7C3AED" />
            </View>
            <View style={styles.summaryTextCol}>
              <Text style={styles.summaryLabel}>Interests</Text>
              <View style={styles.interestsTagsRow}>
                {preferences.map((pref) => (
                  <View key={pref} style={styles.interestPill}>
                    <Text style={styles.interestPillText}>{pref}</Text>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={handleEdit} activeOpacity={0.7}>
              <Pencil size={13} color={AppColors.textMuted} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── PERSONALIZED ITINERARY BANNER ("Looks great!") ───────── */}
        <View style={styles.personalizedBanner}>
          <Image source={{ uri: getDestinationImage() }} style={styles.bannerImage} />
          <View style={styles.bannerGradient} />

          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerTitle}>Looks great!</Text>
            <Text style={styles.bannerDesc}>
              We'll create a personalized{'\n'}itinerary based on your details.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />

        {/* ── FINAL CTA BUTTON ─────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.primaryCtaBtn}
          onPress={handleConfirm}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryCtaText}>Confirm & Open Itinerary</Text>
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
    paddingBottom: 32,
  },

  /* Hero */
  heroSection: {
    marginTop: 6,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 19,
  },

  /* Summary Card */
  summaryCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 16,
    marginBottom: 18,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryTextCol: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FAF7F2',
  },
  editText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3EFE8',
  },
  interestsTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  interestPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  interestPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },

  /* Personalized Banner */
  personalizedBanner: {
    height: 140,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 36, 63, 0.45)',
  },
  bannerTextWrap: {
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: AppColors.white,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
  },

  bottomSpacer: {
    height: 24,
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
  primaryCtaText: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.white,
  },
});