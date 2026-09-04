import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  SignIn: undefined;
  DevScreenTester: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  ResetPassword: { email: string; otp: string };
};

export type AppStackParamList = {
  MyItineraries: undefined;
  DevScreenTester: undefined;
  PlanTrip: undefined;
  TripPreferences: { destination: string; startDate: string; endDate: string; travelers: number };
  TripSummary: { destination: string; startDate: string; endDate: string; travelers: number; preferences: string[] };
  TripDetails: { tripId: string };
  PlaceDetails: { placeId: string; placeName: string };
  AddPlaces: { tripId: string };
  ItineraryView: { tripId: string };
  ItineraryMap: { tripId: string };
  PackingList: { tripId: string };
  CheckingPacking: { tripId: string };
  ProfileMenu: undefined;
  ProfileSettings: undefined;
  UserLevels: undefined;
  UpgradePlan: undefined;
  PaymentMethods: { planId: string };
  PaymentDetails: { planId: string; cardId?: string };
  HelpSupport: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
  UGCPosting: { destination?: string; tripId?: string; placeName?: string } | undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};
