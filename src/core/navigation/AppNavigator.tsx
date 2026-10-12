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
import TravelModeScreen from '../../features/trips/screens/TravelModeScreen';
import ItineraryPackingScreen from '../../features/trips/screens/ItineraryPackingScreen';
import ItineraryMapScreen from '../../features/trips/screens/ItineraryMapScreen';
import CheckingPackingScreen from '../../features/trips/screens/CheckingPackingScreen';
import ProfileMenuScreen from '../../features/profile/screens/ProfileMenuScreen';
import ProfileSettingsScreen from '../../features/profile/screens/ProfileSettingsScreen';
import LanguageScreen from '../../features/profile/screens/LanguageScreen';
import UserLevelsScreen from '../../features/profile/screens/UserLevelsScreen';
import UpgradePlanScreen from '../../features/profile/screens/UpgradePlanScreen';
import PaymentMethodsScreen from '../../features/profile/screens/PaymentMethodsScreen';
import PaymentDetailsScreen from '../../features/profile/screens/PaymentDetailsScreen';
import HelpSupportScreen from '../../features/profile/screens/HelpSupportScreen';
import PrivacyPolicyScreen from '../../features/profile/screens/PrivacyPolicyScreen';
import TermsScreen from '../../features/profile/screens/TermsScreen';
import UGCPostingScreen from '../../features/ugc/screens/UGCPostingScreen';
import GroupMatchingScreen from '../../features/groups/screens/GroupMatchingScreen';
import CreateGroupScreen from '../../features/groups/screens/CreateGroupScreen';
import EditGroupScreen from '../../features/groups/screens/EditGroupScreen';
import GroupDetailsScreen from '../../features/groups/screens/GroupDetailsScreen';
import GroupChatScreen from '../../features/groups/screens/GroupChatScreen';
import GroupInfoScreen from '../../features/groups/screens/GroupInfoScreen';
import ImportDataScreen from '../../features/imports/screens/ImportDataScreen';
import ImportReviewScreen from '../../features/imports/screens/ImportReviewScreen';
import ReviewsScreen from '../../features/reviews/screens/ReviewsScreen';
import EventsFeedScreen from '../../features/events/screens/EventsFeedScreen';
import EventDetailsScreen from '../../features/events/screens/EventDetailsScreen';
import NotificationsScreen from '../../features/notifications/screens/NotificationsScreen';
import InstagramConnectScreen from '../../features/ugc/screens/InstagramConnectScreen';
import ExploreFeedScreen from '../../features/explore/screens/ExploreFeedScreen';
import ReelViewerScreen from '../../features/explore/screens/ReelViewerScreen';
import DestinationDetailsScreen from '../../features/explore/screens/DestinationDetailsScreen';
import AllDestinationsScreen from '../../features/explore/screens/AllDestinationsScreen';
import { AppColors } from '../theme/colors';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyItineraries"
      screenOptions={{
        headerShown: false,
        orientation: 'portrait',
        statusBarHidden: true,
        navigationBarColor: AppColors.surface,
      }}
    >
      {/* ── Main App ── */}
      <Stack.Screen name="MyItineraries" component={MyItinerariesScreen} />

      {/* ── Itinerary Creation Flow (Steps 1–6) ── */}
      <Stack.Screen name="PlanTrip" component={PlanTripScreen} />
      <Stack.Screen name="TripPreferences" component={TripPreferencesScreen} />
      <Stack.Screen name="TripSummary" component={TripSummaryScreen} />
      <Stack.Screen name="AddPlaces" component={AddPlacesScreen} />
      <Stack.Screen name="TravelMode" component={TravelModeScreen} />
      {/* Step 6: Generating / blank itinerary state */}
      <Stack.Screen name="CheckingPacking" component={CheckingPackingScreen} />

      {/* ── Existing Trip Screens ── */}
      <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
      <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
      {/* ItineraryView & PackingList share the same ItineraryPackingScreen (tab-switching) */}
      <Stack.Screen name="ItineraryView" component={ItineraryPackingScreen} />
      <Stack.Screen name="PackingList" component={ItineraryPackingScreen} />
      <Stack.Screen name="ItineraryMap" component={ItineraryMapScreen} />

      {/* ── Profile & Settings ── */}
      <Stack.Screen name="ProfileMenu" component={ProfileMenuScreen} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="UserLevels" component={UserLevelsScreen} />
      <Stack.Screen name="UpgradePlan" component={UpgradePlanScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />

      {/* ── Community & Social ── */}
      <Stack.Screen name="UGCPosting" component={UGCPostingScreen} />
      <Stack.Screen name="InstagramConnect" component={InstagramConnectScreen} />
      <Stack.Screen name="GroupMatching" component={GroupMatchingScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="EditGroup" component={EditGroupScreen} />
      <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
      <Stack.Screen name="GroupChat" component={GroupChatScreen} />
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />

      {/* ── Imports ── */}
      <Stack.Screen name="ImportData" component={ImportDataScreen} />
      <Stack.Screen name="ImportReview" component={ImportReviewScreen} />

      {/* ── Reviews & Events ── */}
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="EventsFeed" component={EventsFeedScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />

      {/* ── Notifications ── */}
      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      {/* ── Explore ── */}
      <Stack.Screen name="ExploreFeed" component={ExploreFeedScreen} />
      <Stack.Screen name="AllDestinations" component={AllDestinationsScreen} />
      <Stack.Screen name="ReelViewer" component={ReelViewerScreen} />
      <Stack.Screen name="DestinationDetails" component={DestinationDetailsScreen} />
    </Stack.Navigator>
  );
};
