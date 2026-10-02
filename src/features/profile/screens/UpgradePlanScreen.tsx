import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Check,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';
import { useSubscription } from '../data/subscriptionStore';

export default function UpgradePlanScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'UpgradePlan'>>();
  const { isPremium } = useSubscription();

  const handleUpgradePress = () => {
    navigation.navigate('PaymentMethods', { planId: 'voyager' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Subscription Plans</Text>
          <Text style={styles.headerSubtitle}>Choose the plan that fits your journey</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── CARD 1: FREE — EXPLORER ──────────────────────────────── */}
        <View style={[styles.planCard, styles.freePlanCard]}>
          {/* Top Row: Plan Name & Badge */}
          <View style={styles.planHeaderRow}>
            <View>
              <Text style={styles.planName}>Free — Explorer</Text>
              <Text style={styles.planPriceRow}>
                <Text style={styles.priceMain}>₹0</Text>
                <Text style={styles.priceSub}> / forever</Text>
              </Text>
            </View>
            {!isPremium && (
              <View style={styles.currentPlanBadge}>
                <Text style={styles.currentPlanBadgeText}>Current Plan</Text>
              </View>
            )}
          </View>

          <Text style={styles.planDescription}>
            Phase 1 features carry over in full
          </Text>

          <View style={styles.divider} />

          {/* Section: Community & Discovery */}
          <Text style={styles.sectionHeader}>COMMUNITY & DISCOVERY</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.checkWrap}>
                <Check size={14} color="#059669" strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>Read all community reviews & ratings</Text>
              <View style={styles.chipNew}><Text style={styles.chipText}>new</Text></View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.checkWrap}>
                <Check size={14} color="#059669" strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>Submit reviews & star ratings</Text>
              <View style={styles.chipNew}><Text style={styles.chipText}>new</Text></View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.checkWrap}>
                <Check size={14} color="#059669" strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>Travel news & advisories feed</Text>
              <View style={styles.chipNew}><Text style={styles.chipText}>new</Text></View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.checkWrap}>
                <Check size={14} color="#059669" strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>App in your preferred language</Text>
              <View style={styles.chipNew}><Text style={styles.chipText}>new</Text></View>
            </View>
          </View>

          {/* Section: Events & Activities */}
          <Text style={styles.sectionHeader}>EVENTS & ACTIVITIES</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.checkWrap}>
                <Check size={14} color="#059669" strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>Generic events feed (top 5 per city)</Text>
              <View style={styles.chipLimited}><Text style={styles.chipTextLimited}>limited</Text></View>
            </View>
          </View>

          {/* Section: Locked in Free */}
          <Text style={styles.sectionHeaderLocked}>LOCKED IN FREE — UPGRADE TO UNLOCK</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItemLocked}>
              <View style={styles.lockWrap}>
                <Lock size={13} color="#94A3B8" strokeWidth={2.5} />
              </View>
              <Text style={styles.featureTextLocked}>AI review summary per destination</Text>
              <View style={styles.chipPremium}><Text style={styles.chipTextPremium}>premium</Text></View>
            </View>

            <View style={styles.featureItemLocked}>
              <View style={styles.lockWrap}>
                <Lock size={13} color="#94A3B8" strokeWidth={2.5} />
              </View>
              <Text style={styles.featureTextLocked}>4.5+ star content prioritization in AI routes</Text>
              <View style={styles.chipPremium}><Text style={styles.chipTextPremium}>premium</Text></View>
            </View>

            <View style={styles.featureItemLocked}>
              <View style={styles.lockWrap}>
                <Lock size={13} color="#94A3B8" strokeWidth={2.5} />
              </View>
              <Text style={styles.featureTextLocked}>Personalised events tied to your itinerary</Text>
              <View style={styles.chipPremium}><Text style={styles.chipTextPremium}>premium</Text></View>
            </View>
          </View>
        </View>

        {/* ── CARD 2: PREMIUM — VOYAGER ─────────────────────────────── */}
        <View style={[styles.planCard, styles.premiumPlanCard]}>
          {/* Highlight Badge */}
          <View style={styles.recommendedBadge}>
            <Sparkles size={12} color={AppColors.white} />
            <Text style={styles.recommendedBadgeText}>
              {isPremium ? 'CURRENT ACTIVE PLAN' : 'RECOMMENDED'}
            </Text>
          </View>

          {/* Plan Header */}
          <View style={styles.planHeaderRow}>
            <View>
              <Text style={styles.planNamePremium}>Premium — Voyager</Text>
              <Text style={styles.planPriceRow}>
                <Text style={styles.priceMainPremium}>₹149</Text>
                <Text style={styles.priceSubPremium}> / month</Text>
              </Text>
              <Text style={styles.annualPriceText}>or ₹1,199 / year — save 33%</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Section: AI Gets Smarter */}
          <Text style={styles.sectionHeaderPremium}>AI GETS SMARTER IN PHASE 2</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.checkWrapPremium}>
                <Check size={14} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>AI summary of all reviews per destination</Text>
              <View style={styles.chipAi}><Text style={styles.chipTextAi}>AI</Text></View>
              <View style={styles.chipNew}><Text style={styles.chipText}>new</Text></View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.checkWrapPremium}>
                <Check size={14} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>Itinerary AI now auto-favours 4.5+ rated spots</Text>
              <View style={styles.chipAi}><Text style={styles.chipTextAi}>AI</Text></View>
              <View style={styles.chipNew}><Text style={styles.chipText}>new</Text></View>
            </View>
          </View>

          {/* Section: Community & Discovery */}
          <Text style={styles.sectionHeaderPremium}>COMMUNITY & DISCOVERY</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.checkWrapPremium}>
                <Check size={14} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>All free community features included</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.checkWrapPremium}>
                <Check size={14} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>Personalised events & festivals tied to your itinerary dates</Text>
              <View style={styles.chipNew}><Text style={styles.chipText}>new</Text></View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.checkWrapPremium}>
                <Check size={14} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>Curated news filtered to your saved destinations</Text>
              <View style={styles.chipNew}><Text style={styles.chipText}>new</Text></View>
            </View>
          </View>

          {/* Section: Carried Over */}
          <Text style={styles.sectionHeaderPremium}>CARRIED OVER FROM PHASE 1</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.checkWrapPremium}>
                <Check size={14} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>10 trips, unlimited edits, unlimited UGC posts</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.checkWrapPremium}>
                <Check size={14} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>Unlimited AI itinerary optimization</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.checkWrapPremium}>
                <Check size={14} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>Custom packing lists + priority support</Text>
            </View>
          </View>

          {/* Upgrade CTA Button */}
          <TouchableOpacity
            style={[styles.upgradeBtn, isPremium && styles.upgradeBtnActive]}
            onPress={isPremium ? undefined : handleUpgradePress}
            activeOpacity={isPremium ? 1 : 0.88}
          >
            {isPremium ? (
              <>
                <ShieldCheck size={18} color={AppColors.white} />
                <Text style={styles.upgradeBtnText}>Active Voyager Member</Text>
              </>
            ) : (
              <>
                <Text style={styles.upgradeBtnText}>Upgrade to Voyager</Text>
                <ArrowRight size={18} color={AppColors.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE5DC',
    backgroundColor: '#FAF7F2',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 1,
  },
  headerPlaceholder: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
    gap: 20,
  },

  /* ── Plan Cards ── */
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    borderWidth: 1.5,
    padding: 20,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
  },
  freePlanCard: {
    borderColor: '#EAE5DC',
  },
  premiumPlanCard: {
    borderColor: AppColors.primary,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.white,
    letterSpacing: 0.4,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  planName: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  planNamePremium: {
    fontSize: 22,
    fontWeight: '900',
    color: AppColors.primary,
    marginBottom: 4,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceMain: {
    fontSize: 26,
    fontWeight: '900',
    color: AppColors.textPrimary,
  },
  priceSub: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textMuted,
  },
  priceMainPremium: {
    fontSize: 28,
    fontWeight: '900',
    color: AppColors.primary,
  },
  priceSubPremium: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.primary,
  },
  annualPriceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  currentPlanBadge: {
    backgroundColor: '#F1ECE4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  currentPlanBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  planDescription: {
    fontSize: 13,
    color: AppColors.textMuted,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1ECE4',
    marginVertical: 12,
  },

  /* ── Section Headers ── */
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
  },
  sectionHeaderLocked: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 10,
  },
  sectionHeaderPremium: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.primary,
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
  },

  /* ── Features List ── */
  featuresList: {
    gap: 10,
    marginBottom: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureItemLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.75,
  },
  checkWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkWrapPremium: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: AppColors.textPrimary,
    lineHeight: 18,
    fontWeight: '500',
  },
  featureTextLocked: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },

  /* ── Chips / Badges ── */
  chipNew: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
  },
  chipLimited: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  chipTextLimited: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  chipPremium: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  chipTextPremium: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
  },
  chipAi: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  chipTextAi: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
  },

  /* ── CTA ── */
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 15,
    borderRadius: 22,
    marginTop: 6,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeBtnActive: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  upgradeBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.white,
  },
});