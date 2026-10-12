import React from 'react';
import { Alert } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import PaymentDetailsScreen from './PaymentDetailsScreen';
import { subscriptionStore } from '../data/subscriptionStore';
import { BackButton } from '../../../core/components/BackButton';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
let mockRouteParams: any = { planId: 'voyager' };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
  }),
  useRoute: () => ({
    params: mockRouteParams,
  }),
}));

describe('PaymentDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = { planId: 'voyager' };
    jest.spyOn(subscriptionStore, 'upgradeToPremium');
    jest.spyOn(Alert, 'alert');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly with monthly billing by default', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<PaymentDetailsScreen />);
    });
    const root = renderer!.root;

    // Header title
    const headerTitle = root.findAllByProps({ children: 'Payment Details' });
    expect(headerTitle.length).toBeGreaterThan(0);

    // Plan title
    const planTitle = root.findAllByProps({ children: 'Premium — Voyager' });
    expect(planTitle.length).toBeGreaterThan(0);

    // Plan price amount
    const planPrice = root.findByProps({ testID: 'plan-price-amount' });
    expect(planPrice.props.children).toBe('149');

    // Summary subtotal & final amount
    const summarySubtotal = root.findByProps({ testID: 'summary-subtotal' });
    expect(summarySubtotal.props.children).toBe('₹149');

    const finalAmount = root.findByProps({ testID: 'final-amount' });
    expect(finalAmount.props.children).toBe('₹149');

    // Bottom Pay button
    const payBtn = root.findByProps({ testID: 'pay-now-button' });
    expect(payBtn).toBeDefined();
    const btnText = root.findAllByProps({ children: 'Pay ₹149' });
    expect(btnText.length).toBeGreaterThan(0);
  });

  it('updates pricing, order summary, and pay button when switching to yearly billing cycle', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<PaymentDetailsScreen />);
    });
    const root = renderer!.root;

    // Click yearly option
    const yearlyOption = root.findByProps({ testID: 'billing-cycle-yearly' });
    ReactTestRenderer.act(() => {
      yearlyOption.props.onPress();
    });

    // Plan price should now be 1,199
    const planPrice = root.findByProps({ testID: 'plan-price-amount' });
    expect(planPrice.props.children).toBe('1,199');

    // Summary should show yearly subtotal and 33% discount
    const summarySubtotal = root.findByProps({ testID: 'summary-subtotal' });
    expect(summarySubtotal.props.children).toBe('₹1,788');

    const summaryDiscount = root.findByProps({ testID: 'summary-discount' });
    expect(summaryDiscount.props.children).toBe('-₹589');

    const finalAmount = root.findByProps({ testID: 'final-amount' });
    expect(finalAmount.props.children).toBe('₹1,199');

    // Bottom Pay button should display Pay ₹1,199
    const payBtnText = root.findAllByProps({ children: 'Pay ₹1,199' });
    expect(payBtnText.length).toBeGreaterThan(0);

    // Switch back to monthly
    const monthlyOption = root.findByProps({ testID: 'billing-cycle-monthly' });
    ReactTestRenderer.act(() => {
      monthlyOption.props.onPress();
    });

    const resetAmount = root.findByProps({ testID: 'final-amount' });
    expect(resetAmount.props.children).toBe('₹149');
  });

  it('allows selecting payment methods', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<PaymentDetailsScreen />);
    });
    const root = renderer!.root;

    // Default method is UPI
    const upiRow = root.findByProps({ testID: 'payment-method-upi' });
    expect(upiRow).toBeDefined();

    // Select Card
    const cardRow = root.findByProps({ testID: 'payment-method-card' });
    ReactTestRenderer.act(() => {
      cardRow.props.onPress();
    });

    // Select Net Banking
    const netbankingRow = root.findByProps({ testID: 'payment-method-netbanking' });
    ReactTestRenderer.act(() => {
      netbankingRow.props.onPress();
    });

    // Select Wallet
    const walletRow = root.findByProps({ testID: 'payment-method-wallet' });
    ReactTestRenderer.act(() => {
      walletRow.props.onPress();
    });
  });

  it('pre-selects card and displays saved card details when cardId is passed in route params', () => {
    mockRouteParams = { planId: 'voyager', cardId: '1' };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<PaymentDetailsScreen />);
    });
    const root = renderer!.root;

    const savedCardText = root.findAllByProps({ children: 'Visa ending in •••• 4242' });
    expect(savedCardText.length).toBeGreaterThan(0);
  });

  it('triggers upgradeToPremium and navigates to MyItineraries on successful payment', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<PaymentDetailsScreen />);
    });
    const root = renderer!.root;

    const payButton = root.findByProps({ testID: 'pay-now-button' });
    ReactTestRenderer.act(() => {
      payButton.props.onPress();
    });

    expect(subscriptionStore.upgradeToPremium).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith(
      'Upgrade Successful! 🎉',
      expect.stringContaining('Welcome to Premium Voyager'),
      expect.any(Array),
      { cancelable: false }
    );

    // Trigger alert action
    const alertCalls = (Alert.alert as jest.Mock).mock.calls;
    const alertButtons = alertCalls[0][2];
    alertButtons[0].onPress();
    expect(mockNavigate).toHaveBeenCalledWith('MyItineraries');
  });

  it('navigates back when header back button is pressed', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<PaymentDetailsScreen />);
    });
    const root = renderer!.root;

    const backButton = root.findByType(BackButton);
    ReactTestRenderer.act(() => {
      backButton.props.onPress();
    });
    expect(mockGoBack).toHaveBeenCalled();
  });
});
