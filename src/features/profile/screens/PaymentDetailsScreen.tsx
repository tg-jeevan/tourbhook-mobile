import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Sparkles,
  Check,
  Smartphone,
  CreditCard,
  Building2,
  Wallet,
  Lock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';
import { subscriptionStore } from '../data/subscriptionStore';

type BillingCycle = 'monthly' | 'yearly';
type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet';

// Configuration aligned with existing Voyager subscription pricing
const MONTHLY_PRICE = 149;
const YEARLY_PRICE = 1199;
const YEARLY_BASE_PRICE = MONTHLY_PRICE * 12; // 1,788
const YEARLY_SAVINGS = YEARLY_BASE_PRICE - YEARLY_PRICE; // 589
const SAVINGS_PERCENT = Math.round((YEARLY_SAVINGS / YEARLY_BASE_PRICE) * 100); // 33%

export default function PaymentDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'PaymentDetails'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'PaymentDetails'>>();

  const cardId = route.params?.cardId;
  const initialCycle: BillingCycle =
    (route.params as any)?.billingCycle === 'yearly' ? 'yearly' : 'monthly';

  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initialCycle);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(
    cardId ? 'card' : 'upi'
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const isYearly = billingCycle === 'yearly';
  const currentPrice = isYearly ? YEARLY_PRICE : MONTHLY_PRICE;
  const priceFrequency = isYearly ? '/ year' : '/ month';
  const billingPeriodLabel = isYearly ? 'Annual (12 Months)' : 'Monthly (1 Month)';

  const handlePay = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      subscriptionStore.upgradeToPremium();
      setIsProcessing(false);
      Alert.alert(
        'Upgrade Successful! 🎉',
        'Welcome to Premium Voyager. You now have unlimited trips, AI reviews, and priority travel features.',
        [
          {
            text: 'Start Exploring',
            onPress: () => {
              navigation.navigate('MyItineraries');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      setIsProcessing(false);
      Alert.alert(
        'Payment Failed',
        error?.message ||
          'Could not complete transaction. Please check your payment details and try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      {/* ── A. HEADER ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── B. SELECTED PLAN SUMMARY ────────────────────────────── */}
        <View style={styles.planCard}>
          <View style={styles.planCardTop}>
            <View style={styles.planBadge}>
              <Sparkles size={13} color={AppColors.primary} />
              <Text style={styles.planBadgeText}>VOYAGER PREMIUM</Text>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>{isYearly ? 'Annual Plan' : 'Monthly Plan'}</Text>
            </View>
          </View>

          <Text style={styles.planTitle}>Premium — Voyager</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceCurrency}>₹</Text>
            <Text style={styles.priceAmount} testID="plan-price-amount">
              {currentPrice.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.pricePeriod}>{priceFrequency}</Text>
            {isYearly && (
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>SAVE {SAVINGS_PERCENT}%</Text>
              </View>
            )}
          </View>

          <Text style={styles.planRenewalText}>
            {isYearly
              ? 'Auto-renews annually at ₹1,199. Cancel anytime.'
              : 'Auto-renews monthly at ₹149. Cancel anytime.'}
          </Text>

          <View style={styles.planDivider} />

          <View style={styles.perksContainer}>
            <View style={styles.perkItem}>
              <View style={styles.checkWrap}>
                <Check size={12} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.perkText}>Unlimited Trips & Edits</Text>
            </View>
            <View style={styles.perkItem}>
              <View style={styles.checkWrap}>
                <Check size={12} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.perkText}>AI Destination Reviews</Text>
            </View>
            <View style={styles.perkItem}>
              <View style={styles.checkWrap}>
                <Check size={12} color={AppColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.perkText}>Priority AI Itinerary Optimization</Text>
            </View>
          </View>
        </View>

        {/* ── C. BILLING CYCLE SELECTION ──────────────────────────── */}
        <Text style={styles.sectionHeading}>Select Billing Cycle</Text>
        <View style={styles.cycleContainer}>
          {/* Monthly Option */}
          <TouchableOpacity
            style={[styles.cycleCard, !isYearly && styles.cycleCardActive]}
            onPress={() => setBillingCycle('monthly')}
            activeOpacity={0.7}
            testID="billing-cycle-monthly"
          >
            <View style={[styles.cycleRadio, !isYearly && styles.cycleRadioActive]}>
              {!isYearly && <View style={styles.cycleRadioInner} />}
            </View>
            <View style={styles.cycleInfo}>
              <Text style={[styles.cycleTitle, !isYearly && styles.cycleTitleActive]}>
                Monthly
              </Text>
              <Text style={styles.cycleSubtitle}>Billed every month</Text>
            </View>
            <View style={styles.cyclePriceWrap}>
              <Text style={[styles.cyclePrice, !isYearly && styles.cyclePriceActive]}>₹149</Text>
              <Text style={styles.cyclePeriod}>/mo</Text>
            </View>
          </TouchableOpacity>

          {/* Yearly Option */}
          <TouchableOpacity
            style={[styles.cycleCard, isYearly && styles.cycleCardActive]}
            onPress={() => setBillingCycle('yearly')}
            activeOpacity={0.7}
            testID="billing-cycle-yearly"
          >
            <View style={styles.savePillTop}>
              <Text style={styles.savePillText}>SAVE {SAVINGS_PERCENT}%</Text>
            </View>
            <View style={[styles.cycleRadio, isYearly && styles.cycleRadioActive]}>
              {isYearly && <View style={styles.cycleRadioInner} />}
            </View>
            <View style={styles.cycleInfo}>
              <Text style={[styles.cycleTitle, isYearly && styles.cycleTitleActive]}>
                Yearly
              </Text>
              <Text style={styles.cycleSubtitle}>₹99.92/mo • Billed annually</Text>
            </View>
            <View style={styles.cyclePriceWrap}>
              <Text style={[styles.cyclePrice, isYearly && styles.cyclePriceActive]}>₹1,199</Text>
              <Text style={styles.cyclePeriod}>/yr</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── D. ORDER SUMMARY ────────────────────────────────────── */}
        <Text style={styles.sectionHeading}>Order Summary</Text>
        <View style={styles.cardContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subscription Plan</Text>
            <Text style={styles.summaryValue}>Premium — Voyager</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Billing Period</Text>
            <Text style={styles.summaryValue} testID="summary-billing-period">
              {billingPeriodLabel}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue} testID="summary-subtotal">
              {`₹${(isYearly ? YEARLY_BASE_PRICE : MONTHLY_PRICE).toLocaleString('en-IN')}`}
            </Text>
          </View>
          {isYearly && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: AppColors.successDark }]}>
                Annual Discount (Save {SAVINGS_PERCENT}%)
              </Text>
              <Text
                style={[styles.summaryValue, { color: AppColors.successDark }]}
                testID="summary-discount"
              >
                {`-₹${YEARLY_SAVINGS.toLocaleString('en-IN')}`}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Applicable Taxes (GST)</Text>
            <Text style={styles.summaryValueLight}>Included in price</Text>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount Payable</Text>
            <Text style={styles.totalValue} testID="final-amount">
              {`₹${currentPrice.toLocaleString('en-IN')}`}
            </Text>
          </View>

          <Text style={styles.taxNotice}>
            * All prices are inclusive of GST. Amount will be confirmed and charged in INR via
            Razorpay checkout.
          </Text>
        </View>

        {/* ── E. PAYMENT METHOD ──────────────────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Payment Method</Text>
          <Text style={styles.sectionSubtext}>Powered by Razorpay</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* UPI */}
          <TouchableOpacity
            style={[styles.methodRow, selectedMethod === 'upi' && styles.methodRowActive]}
            onPress={() => setSelectedMethod('upi')}
            activeOpacity={0.7}
            testID="payment-method-upi"
          >
            <View style={styles.methodIconWrap}>
              <Smartphone size={18} color={AppColors.primary} />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>UPI</Text>
              <Text style={styles.methodSubtext}>Google Pay, PhonePe, Paytm, BHIM</Text>
            </View>
            <View style={[styles.cycleRadio, selectedMethod === 'upi' && styles.cycleRadioActive]}>
              {selectedMethod === 'upi' && <View style={styles.cycleRadioInner} />}
            </View>
          </TouchableOpacity>

          <View style={styles.methodDivider} />

          {/* Cards */}
          <TouchableOpacity
            style={[styles.methodRow, selectedMethod === 'card' && styles.methodRowActive]}
            onPress={() => setSelectedMethod('card')}
            activeOpacity={0.7}
            testID="payment-method-card"
          >
            <View style={styles.methodIconWrap}>
              <CreditCard size={18} color={AppColors.primary} />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>
                {cardId ? 'Saved Card' : 'Credit / Debit Cards'}
              </Text>
              <Text style={styles.methodSubtext}>
                {cardId ? 'Visa ending in •••• 4242' : 'Visa, Mastercard, RuPay, Maestro'}
              </Text>
            </View>
            <View style={[styles.cycleRadio, selectedMethod === 'card' && styles.cycleRadioActive]}>
              {selectedMethod === 'card' && <View style={styles.cycleRadioInner} />}
            </View>
          </TouchableOpacity>

          <View style={styles.methodDivider} />

          {/* Net Banking */}
          <TouchableOpacity
            style={[styles.methodRow, selectedMethod === 'netbanking' && styles.methodRowActive]}
            onPress={() => setSelectedMethod('netbanking')}
            activeOpacity={0.7}
            testID="payment-method-netbanking"
          >
            <View style={styles.methodIconWrap}>
              <Building2 size={18} color={AppColors.primary} />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>Net Banking</Text>
              <Text style={styles.methodSubtext}>SBI, HDFC, ICICI, Axis & 50+ other banks</Text>
            </View>
            <View
              style={[
                styles.cycleRadio,
                selectedMethod === 'netbanking' && styles.cycleRadioActive,
              ]}
            >
              {selectedMethod === 'netbanking' && <View style={styles.cycleRadioInner} />}
            </View>
          </TouchableOpacity>

          <View style={styles.methodDivider} />

          {/* Wallets */}
          <TouchableOpacity
            style={[styles.methodRow, selectedMethod === 'wallet' && styles.methodRowActive]}
            onPress={() => setSelectedMethod('wallet')}
            activeOpacity={0.7}
            testID="payment-method-wallet"
          >
            <View style={styles.methodIconWrap}>
              <Wallet size={18} color={AppColors.primary} />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>Wallets</Text>
              <Text style={styles.methodSubtext}>Paytm, PhonePe & other wallets</Text>
            </View>
            <View
              style={[styles.cycleRadio, selectedMethod === 'wallet' && styles.cycleRadioActive]}
            >
              {selectedMethod === 'wallet' && <View style={styles.cycleRadioInner} />}
            </View>
          </TouchableOpacity>

          {/* Payment Notice Callout */}
          <View style={styles.checkoutNotice}>
            <Lock size={14} color={AppColors.textMuted} />
            <Text style={styles.checkoutNoticeText}>
              Choose your payment method at secure checkout. Tourbhook never collects or stores
              raw card credentials, CVV, or UPI PINs.
            </Text>
          </View>
        </View>

        {/* ── F. SECURE PAYMENT INFORMATION ───────────────────────── */}
        <View style={styles.trustBadge}>
          <View style={styles.trustIconWrap}>
            <ShieldCheck size={20} color={AppColors.primary} />
          </View>
          <View style={styles.trustTextWrap}>
            <Text style={styles.trustTitle}>Secure payment powered by Razorpay</Text>
            <Text style={styles.trustSubtitle}>
              256-bit SSL encrypted checkout. Payment credentials are handled through Razorpay’s
              PCI-DSS Level 1 compliant secure servers.
            </Text>
          </View>
        </View>

        {/* ── G. RENEWAL INFORMATION ──────────────────────────────── */}
        <View style={styles.renewalBox}>
          <View style={styles.renewalHeaderRow}>
            <RefreshCw size={14} color={AppColors.textSecondary} />
            <Text style={styles.renewalHeaderTitle}>Subscription & Renewal Terms</Text>
          </View>
          <Text style={styles.renewalBullet}>
            • Subscription automatically renews {isYearly ? 'annually at ₹1,199' : 'monthly at ₹149'}{' '}
            unless cancelled before renewal.
          </Text>
          <Text style={styles.renewalBullet}>
            • You can cancel anytime from Profile &gt; Subscription Settings without cancellation
            fees.
          </Text>
          <Text style={styles.renewalBullet}>
            • If cancelled, full Voyager premium features remain active until the end of your
            current paid cycle.
          </Text>
        </View>
      </ScrollView>

      {/* ── H. BOTTOM PAYMENT ACTION ────────────────────────────── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceSummary}>
          <Text style={styles.bottomPriceLabel}>Total Payable</Text>
          <Text style={styles.bottomPriceValue} testID="bottom-total-price">
            {`₹${currentPrice.toLocaleString('en-IN')}`}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePay}
          activeOpacity={0.8}
          disabled={isProcessing}
          testID="pay-now-button"
        >
          {isProcessing ? (
            <View style={styles.processingWrap}>
              <ActivityIndicator color={AppColors.white} size="small" />
              <Text style={styles.payButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.payButtonText} testID="pay-button-text">
              {`Pay ₹${currentPrice.toLocaleString('en-IN')}`}
            </Text>
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
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Plan Card
  planCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: AppColors.primaryLight,
    padding: 18,
    marginBottom: 20,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  planCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surfaceHighlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.primary,
    letterSpacing: 0.5,
  },
  activeTag: {
    backgroundColor: AppColors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textMuted,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  priceCurrency: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.primary,
    marginRight: 2,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: AppColors.primary,
    letterSpacing: -0.5,
  },
  pricePeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textMuted,
    marginLeft: 4,
  },
  saveBadge: {
    backgroundColor: AppColors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 10,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: AppColors.white,
    letterSpacing: 0.5,
  },
  planRenewalText: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginBottom: 12,
  },
  planDivider: {
    height: 1,
    backgroundColor: AppColors.borderLight,
    marginBottom: 12,
  },
  perksContainer: {
    gap: 8,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: AppColors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  perkText: {
    fontSize: 13,
    fontWeight: '500',
    color: AppColors.textSecondary,
  },

  // Headings
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionSubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textMuted,
  },

  // Cycle Selection
  cycleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  cycleCard: {
    flex: 1,
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    padding: 14,
    position: 'relative',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cycleCardActive: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.surfaceHighlight,
  },
  savePillTop: {
    position: 'absolute',
    top: -9,
    right: 10,
    backgroundColor: AppColors.accent,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  savePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: AppColors.white,
    letterSpacing: 0.4,
  },
  cycleRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: AppColors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cycleRadioActive: {
    borderColor: AppColors.primary,
  },
  cycleRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.primary,
  },
  cycleInfo: {
    marginBottom: 6,
  },
  cycleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  cycleTitleActive: {
    color: AppColors.primary,
  },
  cycleSubtitle: {
    fontSize: 11,
    color: AppColors.textMuted,
    lineHeight: 14,
  },
  cyclePriceWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cyclePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  cyclePriceActive: {
    color: AppColors.primary,
  },
  cyclePeriod: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textMuted,
    marginLeft: 2,
  },

  // Common Card Container
  cardContainer: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
    marginBottom: 22,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  // Order Summary
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  summaryLabel: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  summaryValueLight: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textMuted,
  },
  cardDivider: {
    height: 1,
    backgroundColor: AppColors.borderLight,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 6,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: AppColors.primary,
  },
  taxNotice: {
    fontSize: 11,
    color: AppColors.textLight,
    marginTop: 6,
    lineHeight: 15,
  },

  // Payment Method Rows
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  methodRowActive: {
    // Subtle row emphasis
  },
  methodIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: AppColors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  methodSubtext: {
    fontSize: 12,
    color: AppColors.textMuted,
  },
  methodDivider: {
    height: 1,
    backgroundColor: AppColors.borderLight,
    marginVertical: 2,
  },
  checkoutNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: AppColors.surfaceSubtle,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    gap: 8,
  },
  checkoutNoticeText: {
    flex: 1,
    fontSize: 11,
    color: AppColors.textMuted,
    lineHeight: 16,
  },

  // Trust Badge
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  trustIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustTextWrap: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  trustSubtitle: {
    fontSize: 11,
    color: AppColors.textMuted,
    lineHeight: 15,
  },

  // Renewal Terms Box
  renewalBox: {
    backgroundColor: AppColors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 14,
    marginBottom: 10,
  },
  renewalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  renewalHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  renewalBullet: {
    fontSize: 11.5,
    color: AppColors.textMuted,
    lineHeight: 17,
    marginBottom: 4,
  },

  // Bottom Fixed Bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  bottomPriceSummary: {
    justifyContent: 'center',
  },
  bottomPriceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textMuted,
  },
  bottomPriceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: AppColors.primary,
  },
  payButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 170,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.white,
  },
  processingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});