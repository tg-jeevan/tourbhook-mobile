import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../components/BackButton';

export default function DevScreenTester() {
  const navigation = useNavigation<any>();

  const authScreens = [
    { name: 'Splash', route: 'Splash', params: undefined },
    { name: 'Welcome', route: 'Welcome', params: undefined },
    { name: 'Sign In', route: 'SignIn', params: undefined },
    { name: 'Sign Up', route: 'SignUp', params: undefined },
    { name: 'Forgot Password', route: 'ForgotPassword', params: undefined },
    { name: 'OTP Verification', route: 'OTPVerification', params: { email: 'mani.test@example.com' } },
    { name: 'Reset Password', route: 'ResetPassword', params: { email: 'mani.test@example.com', otp: '1234' } },
  ];

  const tripScreens = [
    { name: 'My Itineraries', route: 'MyItineraries', params: undefined },
    { name: 'Plan Trip', route: 'PlanTrip', params: undefined },
    { name: 'Trip Preferences', route: 'TripPreferences', params: { destination: 'Paris, France', startDate: '2026-09-12', endDate: '2026-09-17', travelers: 2 } },
    { name: 'Trip Summary', route: 'TripSummary', params: { destination: 'Paris, France', startDate: '2026-09-12', endDate: '2026-09-17', travelers: 2, preferences: ['Culture', 'Food'] } },
    { name: 'Trip Details', route: 'TripDetails', params: { tripId: '1' } },
    { name: 'Place Details', route: 'PlaceDetails', params: { placeId: '1', placeName: 'Eiffel Tower' } },
    { name: 'Add Places', route: 'AddPlaces', params: { tripId: '1' } },
    { name: 'Itinerary View', route: 'ItineraryView', params: { tripId: '1' } },
    { name: 'Itinerary Map', route: 'ItineraryMap', params: { tripId: '1' } },
    { name: 'UGC Posting', route: 'UGCPosting', params: { destination: 'Paris, France', tripId: '1' } },
  ];

  const packingScreens = [
    { name: 'Packing List', route: 'PackingList', params: { tripId: '1' } },
    { name: 'Checking Packing', route: 'CheckingPacking', params: { tripId: '1' } },
  ];

    const groupScreens = [
    { name: 'Group Matching', route: 'GroupMatching', params: undefined },
  ];

    const importScreens = [
    { name: 'Import Data', route: 'ImportData', params: undefined },
  ];

    const reviewScreens = [
    { name: 'Reviews', route: 'Reviews', params: { placeId: '1', placeName: 'Eiffel Tower' } },
  ];

  const profileScreens = [
    { name: 'Profile Menu', route: 'ProfileMenu', params: undefined },
    { name: 'Profile Settings', route: 'ProfileSettings', params: undefined },
    { name: 'User Levels', route: 'UserLevels', params: undefined },
    { name: 'Upgrade Plan', route: 'UpgradePlan', params: undefined },
    { name: 'Payment Methods', route: 'PaymentMethods', params: { planId: 'pro' } },
    { name: 'Payment Details', route: 'PaymentDetails', params: { planId: 'pro', cardId: '1' } },
    { name: 'Help & Support', route: 'HelpSupport', params: undefined },
    { name: 'Privacy Policy', route: 'PrivacyPolicy', params: undefined },
    { name: 'Terms', route: 'Terms', params: undefined },
  ];

  const renderGroup = (title: string, list: any[]) => (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.grid}>
        {list.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.button}
            onPress={() => navigation.navigate(item.route, item.params)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Dev Screen Tester</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {renderGroup('Authentication Flow', authScreens)}
        {renderGroup('Trips & Itinerary Flow', tripScreens)}
        {renderGroup('Packing Flow', packingScreens)}
        {renderGroup('Groups & Verification Flow', groupScreens)}
        {renderGroup('Data Import Flow', importScreens)}
        {renderGroup('Reviews Flow', reviewScreens)}
        {renderGroup('Profile & Settings Flow', profileScreens)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#E91E63' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  group: { marginBottom: 28 },
  groupTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#EEEEEE', paddingBottom: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F5F5F7', borderWidth: 1, borderColor: '#E8E8E8' },
  buttonText: { fontSize: 13, color: '#1A1A2E', fontWeight: '500' }
});
