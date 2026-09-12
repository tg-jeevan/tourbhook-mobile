import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
import MyItinerariesScreen from '../../features/trips/screens/MyItinerariesScreen';
import PlanTripScreen from '../../features/trips/screens/PlanTripScreen';
import TripPreferencesScreen from '../../features/trips/screens/TripPreferencesScreen';
import TripSummaryScreen from '../../features/trips/screens/TripSummaryScreen';
import TripDetailsScreen from '../../features/trips/screens/TripDetailsScreen';
import PlaceDetailsScreen from '../../features/trips/screens/PlaceDetailsScreen';
import AddPlacesScreen from '../../features/trips/screens/AddPlacesScreen';
import ProfileMenuScreen from '../../features/profile/screens/ProfileMenuScreen';
import ProfileSettingsScreen from '../../features/profile/screens/ProfileSettingsScreen';
import UserLevelsScreen from '../../features/profile/screens/UserLevelsScreen';
import UpgradePlanScreen from '../../features/profile/screens/UpgradePlanScreen';
import PaymentMethodsScreen from '../../features/profile/screens/PaymentMethodsScreen';
import PaymentDetailsScreen from '../../features/profile/screens/PaymentDetailsScreen';
import HelpSupportScreen from '../../features/profile/screens/HelpSupportScreen';
import PrivacyPolicyScreen from '../../features/profile/screens/PrivacyPolicyScreen';
import TermsScreen from '../../features/profile/screens/TermsScreen';
import UGCPostingScreen from '../../features/ugc/screens/UGCPostingScreen';
import GroupMatchingScreen from '../../features/groups/screens/GroupMatchingScreen';
import ImportDataScreen from '../../features/imports/screens/ImportDataScreen';
import ImportReviewScreen from '../../features/imports/screens/ImportReviewScreen';
import ReviewsScreen from '../../features/reviews/screens/ReviewsScreen';
import DevScreenTester from './DevScreenNavigator';
import ItineraryPackingScreen from '../../features/trips/screens/ItineraryPackingScreen';
import ItineraryMapScreen from '../../features/trips/screens/ItineraryMapScreen';
import CheckingPackingScreen from '../../features/trips/screens/CheckingPackingScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MyItineraries" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyItineraries" component={MyItinerariesScreen} />
      <Stack.Screen name="PlanTrip" component={PlanTripScreen} />
      <Stack.Screen name="TripPreferences" component={TripPreferencesScreen} />
      <Stack.Screen name="TripSummary" component={TripSummaryScreen} />
      <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
      <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
      <Stack.Screen name="AddPlaces" component={AddPlacesScreen} />
      <Stack.Screen name="ItineraryView" component={ItineraryPackingScreen} />
      <Stack.Screen name="ItineraryMap" component={ItineraryMapScreen} />
      <Stack.Screen name="PackingList" component={ItineraryPackingScreen} />
      <Stack.Screen name="CheckingPacking" component={CheckingPackingScreen} />
      <Stack.Screen name="ProfileMenu" component={ProfileMenuScreen} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen name="UserLevels" component={UserLevelsScreen} />
      <Stack.Screen name="UpgradePlan" component={UpgradePlanScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="UGCPosting" component={UGCPostingScreen} />
      <Stack.Screen name="GroupMatching" component={GroupMatchingScreen} />
      <Stack.Screen name="ImportData" component={ImportDataScreen} />
      <Stack.Screen name="ImportReview" component={ImportReviewScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="DevScreenTester" component={DevScreenTester} />
    </Stack.Navigator>
  );
};
