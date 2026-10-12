import { NavigatorScreenParams } from '@react-navigation/native';
import { ImportedTripDraft } from '../../features/imports/types/importTypes';
import { ExploreCategory } from '../../features/explore/types/exploreTypes';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  ResetPassword: { email: string; otp: string };
};

// ── Trip Creation shared params ──────────────────────────────────────────────
export type TravelerType = 'solo' | 'couple' | 'family' | 'group';
export type TravelPurpose = 'Leisure' | 'Birthday' | 'Bachelorette';
export type TravelStyle = 'Budget Friendly' | 'Fast Travel' | 'Relaxed Vacation' | 'Explore Everything';
export type TravelMode = 'Airplane' | 'Boat' | 'Bus' | 'Car' | 'Public Transport' | 'Train';

/** Core trip info collected on PlanTrip */
export interface TripCreationParams {
  tripId?: string;
  mode?: 'edit' | 'create';
  isEditing?: boolean;
  itineraryName?: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelerType: TravelerType;
  adults: number;
  kids: number;
  purpose: TravelPurpose;
  /** Structured destination metadata (ID, coordinates, hierarchy) */
  destinationMetadata?: any;
  /** Age of primary traveler (from profile or inline input). -1 = not collected. */
  primaryAge: number;
  /** Only required when primaryAge >= 60 */
  medicalInfo?: string;
}

/** Full params carried through to AddPlaces / TravelMode / Packing */
export interface TripCreationFullParams extends TripCreationParams {
  travelStyle: TravelStyle;
  selectedPlaceIds?: string[];
  travelModes?: TravelMode[];
}

export type AppStackParamList = {
  // --- APP SCREENS ---
  MyItineraries: undefined;
  /** Step 1: core trip info */
  PlanTrip: { tripId?: string; mode?: 'edit' | 'create'; isEditing?: boolean } | undefined;
  /** Step 2: travel style / preferences — receives PlanTrip data */
  TripPreferences: TripCreationParams;
  /** Step 3: Review summary — receives full params after travel style */
  TripSummary: TripCreationFullParams;
  /** Step 4: Add Places — receives full params */
  AddPlaces: TripCreationFullParams & { tripId?: string };
  /** Step 5: Travel Mode selection */
  TravelMode: TripCreationFullParams & { selectedPlaceIds?: string[]; tripId?: string };
  /** Step 6+: Packing list / generation in creation flow */
  CheckingPacking: TripCreationFullParams & { tripId?: string };
  /** Itinerary view / packing tabs (existing trip) */
  TripDetails: { tripId: string };
  PlaceDetails: { placeId: string; placeName: string };
  ItineraryView: { tripId: string };
  ItineraryMap: { tripId: string };
  PackingList: { tripId: string };
  ProfileMenu: undefined;
  ProfileSettings: undefined;
  Language: undefined;
  UserLevels: undefined;
  UpgradePlan: undefined;
  PaymentMethods: { planId: string };
  PaymentDetails: { planId: string; cardId?: string };
  HelpSupport: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
  UGCPosting: { destination?: string; tripId?: string; placeName?: string } | undefined;
  GroupMatching: undefined;
  CreateGroup: { groupId?: string } | undefined;
  EditGroup: { groupId: string };
  GroupDetails: { groupId: string };
  GroupChat: { groupId: string };
  GroupInfo: { groupId: string };
  ImportData: undefined;
  ImportReview: { draft: ImportedTripDraft };
  Reviews: { placeId: string; placeName: string };
  EventsFeed: { destinationId?: string; destinationName?: string } | undefined;
  EventDetails: { eventId: string };
  Notifications: undefined;
  InstagramConnect: undefined;
  ExploreFeed: undefined;
  AllDestinations: { category?: ExploreCategory } | undefined;
  ReelViewer: {
    reelId?: string;
    reel?: any;
    initialIndex?: number;
    filter?: 'all' | 'instagram' | 'youtube';
    destination?: string;
  } | undefined;
  DestinationDetails: { destinationId?: string; destinationName: string; country?: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};
