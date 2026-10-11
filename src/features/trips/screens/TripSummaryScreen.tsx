import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
  Heart,
  Zap,
  Sparkles,
} from 'lucide-react-native';
import { AppStackParamList, TravelerType } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { TripFlowProgressHeader } from '../components/TripFlowProgressHeader';
import {
  formatDateRange,
  formatDestinationLocation,
} from '../utils/itineraryFormatting';

// ── Helpers ──────────────────────────────────────────────────────────────────
function travelerLabel(type: TravelerType, adults: number, kids: number): string {
  const typeLabel: Record<TravelerType, string> = {
    solo: 'Solo',
    couple: 'Couple',
    family: 'Family',
    group: 'Friends / Group',
  };

  let base = typeLabel[type];
  if (type === 'solo') return 'Solo Traveler (1 Traveler)';
  if (type === 'couple') return 'Couple (2 Travelers)';

  const parts: string[] = [`${adults} Adult${adults !== 1 ? 's' : ''}`];
  if (kids > 0) parts.push(`${kids} Kid${kids !== 1 ? 's' : ''}`);
  const total = adults + kids;
  return `${base} · ${parts.join(' + ')} (${total} Travelers)`;
}

function travelStyleEmoji(style: string): string {
  const map: Record<string, string> = {
    'Budget Friendly': '💰',
    'Fast Travel': '⚡',
    'Relaxed Vacation': '🌅',
    'Explore Everything': '🗺️',
  };
  return map[style] || '✨';
}

// ── Summary Row ───────────────────────────────────────────────────────────────
function SummaryRow({
  iconBg,
  icon,
  label,
  value,
  onEdit,
}: {
  iconBg: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <View style={rowStyles.row}>
      <View style={[rowStyles.iconCircle, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={rowStyles.textCol}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={rowStyles.value}>{value}</Text>
      </View>
      <TouchableOpacity style={rowStyles.editBtn} onPress={onEdit} activeOpacity={0.7}>
        <Pencil size={13} color={AppColors.textMuted} />
        <Text style={rowStyles.editText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
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
  textCol: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
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
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function TripSummaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripSummary'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripSummary'>>();
  const params = route.params;

  const rawDestination = params?.destination   || '—';
  const destination    = formatDestinationLocation(rawDestination);
  const startDate      = params?.startDate     || '—';
  const endDate        = params?.endDate       || '—';
  const travelerType   = params?.travelerType  || 'couple';
  const adults         = params?.adults        ?? 2;
  const kids           = params?.kids          ?? 0;
  const purpose        = params?.purpose       || 'Leisure';
  const travelStyle    = params?.travelStyle   || 'Explore Everything';
  const itineraryName  = params?.itineraryName?.trim();

  const formattedDates = formatDateRange(startDate, endDate);
  const travelersText = travelerLabel(travelerType, adults, kids);

  const goBackToStep1 = () => navigation.navigate('PlanTrip');
  const goBackToStep2 = () => navigation.goBack();

  const handleConfirm = () => {
    navigation.navigate('AddPlaces', {
      ...params,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TripFlowProgressHeader
        currentStep={3}
        totalSteps={6}
        stepLabel="Step 3 of 6 · Review"
        onBack={() => navigation.goBack()}
        showCloseIcon={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Trip Summary</Text>
          <Text style={styles.heroSubtitle}>
            Review your details before we start{'\n'}selecting places
          </Text>
        </View>

        {/* ── SUMMARY CARD ─────────────────────────────────────────── */}
        <View style={styles.summaryCard}>
          {itineraryName ? (
            <>
              <SummaryRow
                iconBg="#F3E8FF"
                icon={<Sparkles size={18} color="#7C3AED" />}
                label="Itinerary Name"
                value={itineraryName}
                onEdit={goBackToStep1}
              />
              <View style={styles.divider} />
            </>
          ) : null}

          <SummaryRow
            iconBg="#E0F2FE"
            icon={<MapPin size={18} color="#0284C7" />}
            label="Destination"
            value={destination}
            onEdit={goBackToStep1}
          />

          <View style={styles.divider} />

          <SummaryRow
            iconBg="#DCFCE7"
            icon={<Calendar size={18} color="#059669" />}
            label="Travel Dates"
            value={formattedDates}
            onEdit={goBackToStep1}
          />

          <View style={styles.divider} />

          <SummaryRow
            iconBg="#FFEDD5"
            icon={<Users size={18} color="#EA580C" />}
            label="Travelers"
            value={travelersText}
            onEdit={goBackToStep1}
          />

          <View style={styles.divider} />

          <SummaryRow
            iconBg="#FEF3C7"
            icon={<Heart size={18} color="#D97706" />}
            label="Purpose"
            value={purpose}
            onEdit={goBackToStep1}
          />

          <View style={styles.divider} />

          <SummaryRow
            iconBg="#F3E8FF"
            icon={<Star size={18} color="#7C3AED" />}
            label="Travel Style"
            value={`${travelStyleEmoji(travelStyle)}  ${travelStyle}`}
            onEdit={goBackToStep2}
          />
        </View>

        {/* ── CONFIRMATION BANNER ──────────────────────────────────── */}
        <View style={styles.confirmBanner}>
          <View style={styles.confirmBannerIcon}>
            <Zap size={22} color={AppColors.primary} />
          </View>
          <View style={styles.confirmBannerText}>
            <Text style={styles.confirmBannerTitle}>Everything looks great!</Text>
            <Text style={styles.confirmBannerDesc}>
              Next, select the places you'd like to visit and we'll craft your personalised itinerary.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.primaryCtaBtn}
          onPress={handleConfirm}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryCtaText}>Next: Add Places</Text>
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
    marginBottom: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3EFE8',
  },

  /* Confirmation Banner */
  confirmBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 16,
    gap: 14,
  },
  confirmBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBannerText: {
    flex: 1,
  },
  confirmBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  confirmBannerDesc: {
    fontSize: 12,
    color: AppColors.textMuted,
    lineHeight: 17,
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