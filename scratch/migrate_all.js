const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// 1. Create Core Components
const componentsDir = path.join(srcDir, 'core/components');
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

const primaryButtonContent = `import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface PrimaryButtonProps {
  text: string;
  onPressed: () => void;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  onPressed,
  isLoading = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={isLoading ? undefined : onPressed}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={[styles.text, textStyle]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
`;

const customTextFieldContent = `import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';

interface CustomTextFieldProps {
  label?: string;
  hint: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  obscureText?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  hint,
  prefixIcon,
  suffixIcon,
  obscureText = false,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.wrapper, focused && styles.focused]}>
        {prefixIcon && <View style={styles.prefix}>{prefixIcon}</View>}
        <TextInput
          style={styles.input}
          placeholder={hint}
          placeholderTextColor="#B0B0B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={obscureText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {suffixIcon && <View style={styles.suffix}>{suffixIcon}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  focused: {
    borderColor: '#E91E63',
  },
  prefix: {
    marginRight: 12,
  },
  suffix: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1A1A2E',
    fontSize: 14,
    padding: 0,
  },
});
`;

const backButtonContent = `import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.chevron}>
        <View style={styles.chevronLineTop} />
        <View style={styles.chevronLineBottom} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  chevron: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronLineTop: {
    width: 14,
    height: 3,
    backgroundColor: '#1A1A2E',
    borderRadius: 1.5,
    transform: [{ rotate: '-45deg' }, { translateY: 2 }],
  },
  chevronLineBottom: {
    width: 14,
    height: 3,
    backgroundColor: '#1A1A2E',
    borderRadius: 1.5,
    transform: [{ rotate: '45deg' }, { translateY: -2 }],
  },
});
`;

fs.writeFileSync(path.join(componentsDir, 'PrimaryButton.tsx'), primaryButtonContent);
fs.writeFileSync(path.join(componentsDir, 'CustomTextField.tsx'), customTextFieldContent);
fs.writeFileSync(path.join(componentsDir, 'BackButton.tsx'), backButtonContent);

// 2. Define Navigation Types
const navigationTypesPath = path.join(srcDir, 'core/navigation/types.ts');
const newNavigationTypesContent = `import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  ResetPassword: { email: string; otp: string };
};

export type AppStackParamList = {
  MyItineraries: undefined;
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
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};
`;
fs.writeFileSync(navigationTypesPath, newNavigationTypesContent);

// 3. Define and generate all Auth Screens
const authScreens = {
  'SplashScreen.tsx': `import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../core/navigation/types';

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Splash'>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/images/appLogoTransparent.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>ShrineTours</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 120, height: 120 },
  title: { marginTop: 16, fontSize: 32, fontWeight: '800', color: '#FFFFFF' }
});`,

  'SignUpScreen.tsx': `import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'SignUp'>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to start your journey</Text>
        <View style={styles.gap32} />

        <CustomTextField label="Full Name" hint="John Doe" value={name} onChangeText={setName} />
        <View style={styles.gap20} />
        <CustomTextField label="Email" hint="your@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <View style={styles.gap20} />
        <CustomTextField label="Password" hint="••••••••" value={password} onChangeText={setPassword} obscureText />

        <View style={styles.gap32} />
        <PrimaryButton text="Sign Up" onPressed={() => navigation.navigate('SignIn')} />

        <View style={styles.gap24} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 14, color: '#8E8E93' },
  link: { fontSize: 14, fontWeight: '600', color: '#E91E63' },
  gap20: { height: 20 },
  gap24: { height: 24 },
  gap32: { height: 32 }
});`,

  'ForgotPasswordScreen.tsx': `import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>>();
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email to reset your password</Text>
        <View style={styles.gap32} />

        <CustomTextField label="Email" hint="your@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <View style={styles.gap32} />
        <PrimaryButton text="Send Reset Link" onPressed={() => navigation.navigate('OTPVerification', { email })} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  gap24: { height: 24 },
  gap32: { height: 32 }
});`,

  'OTPVerificationScreen.tsx': `import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function OTPVerificationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'OTPVerification'>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'OTPVerification'>>();
  const [otp, setOtp] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Enter code sent to {route.params?.email || 'email'}</Text>
        <View style={styles.gap32} />

        <CustomTextField label="Verification Code" hint="1234" value={otp} onChangeText={setOtp} keyboardType="number-pad" />
        <View style={styles.gap32} />
        <PrimaryButton text="Verify" onPressed={() => navigation.navigate('ResetPassword', { email: route.params?.email, otp })} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  gap24: { height: 24 },
  gap32: { height: 32 }
});`,

  'ResetPasswordScreen.tsx': `import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Create a new password for your account</Text>
        <View style={styles.gap32} />

        <CustomTextField label="New Password" hint="••••••••" value={password} onChangeText={setPassword} obscureText />
        <View style={styles.gap20} />
        <CustomTextField label="Confirm Password" hint="••••••••" value={confirmPassword} onChangeText={setConfirmPassword} obscureText />

        <View style={styles.gap32} />
        <PrimaryButton text="Reset Password" onPressed={() => navigation.navigate('SignIn')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  gap20: { height: 20 },
  gap24: { height: 24 },
  gap32: { height: 32 }
});`
};

const authScreensDir = path.join(srcDir, 'features/auth/screens');
Object.keys(authScreens).forEach(filename => {
  fs.writeFileSync(path.join(authScreensDir, filename), authScreens[filename]);
});

// 4. Update AuthNavigator.tsx
const authNavigatorPath = path.join(srcDir, 'core/navigation/AuthNavigator.tsx');
const newAuthNavigatorContent = `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import SplashScreen from '../../features/auth/screens/SplashScreen';
import WelcomeScreen from '../../features/auth/screens/WelcomeScreen';
import SignInScreen from '../../features/auth/screens/SignInScreen';
import SignUpScreen from '../../features/auth/screens/SignUpScreen';
import ForgotPasswordScreen from '../../features/auth/screens/ForgotPasswordScreen';
import OTPVerificationScreen from '../../features/auth/screens/OTPVerificationScreen';
import ResetPasswordScreen from '../../features/auth/screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};
`;
fs.writeFileSync(authNavigatorPath, newAuthNavigatorContent);

// 5. Generate and write all Trip Planning Screens
const tripScreens = {
  'MyItinerariesScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';

export default function MyItinerariesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'MyItineraries'>>();

  const dummyTrips = [
    { id: '1', destination: 'Paris, France', dates: 'Sept 10 - Sept 17, 2026', image: require('../../../../assets/images/welcomeImage.jpg') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Itineraries</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileMenu')}>
          <View style={styles.profileBadge} />
        </TouchableOpacity>
      </View>

      {dummyTrips.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No itineraries planned yet</Text>
        </View>
      ) : (
        <FlatList
          data={dummyTrips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}
              activeOpacity={0.9}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardOverlay} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.destination}</Text>
                <Text style={styles.cardSubtitle}>{item.dates}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PlanTrip')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A2E' },
  profileBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F7', borderWidth: 1.5, borderColor: '#E8E8E8' },
  list: { padding: 24 },
  card: { height: 180, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  cardContent: { position: 'absolute', bottom: 16, left: 16 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  cardSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#8E8E93' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabText: { fontSize: 28, color: '#FFFFFF', fontWeight: '300' }
});`,

  'PlanTripScreen.tsx': `import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function PlanTripScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'PlanTrip'>>();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('1');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Plan Your Trip</Text>
        <Text style={styles.subtitle}>Enter trip details to build your itinerary</Text>
        <View style={styles.gap32} />

        <CustomTextField label="Where to?" hint="e.g. Paris, France" value={destination} onChangeText={setDestination} />
        <View style={styles.gap20} />
        <CustomTextField label="Start Date" hint="YYYY-MM-DD" value={startDate} onChangeText={setStartDate} />
        <View style={styles.gap20} />
        <CustomTextField label="End Date" hint="YYYY-MM-DD" value={endDate} onChangeText={setEndDate} />
        <View style={styles.gap20} />
        <CustomTextField label="Number of Travelers" hint="1" value={travelers} onChangeText={setTravelers} keyboardType="number-pad" />

        <View style={styles.gap32} />
        <PrimaryButton
          text="Next: Preferences"
          onPressed={() =>
            navigation.navigate('TripPreferences', {
              destination,
              startDate,
              endDate,
              travelers: parseInt(travelers, 10) || 1,
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  gap20: { height: 20 },
  gap24: { height: 24 },
  gap32: { height: 32 }
});`,

  'TripPreferencesScreen.tsx': `import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function TripPreferencesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripPreferences'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripPreferences'>>();
  const [selected, setSelected] = useState<string[]>([]);

  const options = ['Adventure', 'Nature', 'Culture', 'Food', 'Shopping', 'Budget', 'Relaxation'];

  const toggleSelect = (opt: string) => {
    if (selected.includes(opt)) {
      setSelected(selected.filter(item => item !== opt));
    } else {
      setSelected([...selected, opt]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Your Preferences</Text>
        <Text style={styles.subtitle}>Select what matches your interests</Text>
        <View style={styles.gap32} />

        <View style={styles.grid}>
          {options.map((opt) => {
            const isSel = selected.includes(opt);
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.chip, isSel && styles.chipSelected]}
                onPress={() => toggleSelect(opt)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSel && styles.chipTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.gap40} />
        <PrimaryButton
          text="Build Itinerary"
          onPressed={() =>
            navigation.navigate('TripSummary', {
              ...route.params,
              preferences: selected,
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1.5, borderColor: '#E8E8E8', backgroundColor: '#FFFFFF' },
  chipSelected: { borderColor: '#E91E63', backgroundColor: '#FCE4EC' },
  chipText: { fontSize: 14, color: '#1A1A2E' },
  chipTextSelected: { color: '#E91E63', fontWeight: '600' },
  gap24: { height: 24 },
  gap32: { height: 32 },
  gap40: { height: 40 }
});`,

  'TripSummaryScreen.tsx': `import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function TripSummaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripSummary'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripSummary'>>();
  const params = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Trip Summary</Text>
        <Text style={styles.subtitle}>Review your generated travel plan</Text>
        <View style={styles.gap32} />

        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Destination</Text>
          <Text style={styles.cardValue}>{params?.destination}</Text>
          <View style={styles.gap16} />
          <Text style={styles.cardLabel}>Dates</Text>
          <Text style={styles.cardValue}>{params?.startDate} to {params?.endDate}</Text>
          <View style={styles.gap16} />
          <Text style={styles.cardLabel}>Travelers</Text>
          <Text style={styles.cardValue}>{params?.travelers} Traveler(s)</Text>
          <View style={styles.gap16} />
          <Text style={styles.cardLabel}>Interests</Text>
          <Text style={styles.cardValue}>{params?.preferences?.join(', ') || 'None'}</Text>
        </View>

        <View style={styles.gap40} />
        <PrimaryButton text="Confirm & Open Itinerary" onPressed={() => navigation.navigate('TripDetails', { tripId: '1' })} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  summaryCard: { padding: 20, backgroundColor: '#F5F5F7', borderRadius: 16, borderWidth: 1, borderColor: '#E8E8E8' },
  cardLabel: { fontSize: 12, color: '#8E8E93', fontWeight: '500', textTransform: 'uppercase' },
  cardValue: { fontSize: 16, color: '#1A1A2E', fontWeight: '600', marginTop: 4 },
  gap16: { height: 16 },
  gap24: { height: 24 },
  gap32: { height: 32 },
  gap40: { height: 40 }
});`,

  'TripDetailsScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';

export default function TripDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripDetails'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripDetails'>>();
  const tripId = route.params?.tripId || '1';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.destTitle}>Paris, France</Text>
        <Text style={styles.destDates}>Sept 10 - Sept 17, 2026</Text>
        <View style={styles.gap24} />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ItineraryView', { tripId })}>
            <Text style={styles.actionBtnText}>View Itinerary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('PackingList', { tripId })}>
            <Text style={styles.actionBtnText}>Packing List</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gap24} />
        <Text style={styles.sectionTitle}>Quick Itinerary Overview</Text>
        <View style={styles.dayCard}>
          <Text style={styles.dayTitle}>Day 1: Arrival & Exploration</Text>
          <Text style={styles.dayActivity}>10:00 AM - Eiffel Tower Visit</Text>
          <Text style={styles.dayActivity}>02:00 PM - Seine River Cruise</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  destTitle: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  destDates: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: '#E91E63', justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#E91E63', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  dayCard: { padding: 16, backgroundColor: '#F5F5F7', borderRadius: 12 },
  dayTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  dayActivity: { fontSize: 14, color: 'rgba(26,26,46,0.8)', marginTop: 4 },
  gap24: { height: 24 }
});`,

  'PlaceDetailsScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';

export default function PlaceDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'PlaceDetails'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'PlaceDetails'>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Place Details</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={require('../../../../assets/images/welcomeImage.jpg')} style={styles.image} />
        <View style={styles.gap16} />
        <Text style={styles.title}>{route.params?.placeName || 'Eiffel Tower'}</Text>
        <Text style={styles.rating}>⭐ 4.8 (1,250 reviews)</Text>
        <View style={styles.gap16} />
        <Text style={styles.desc}>
          The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  image: { width: '100%', height: 220, borderRadius: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A2E' },
  rating: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  desc: { fontSize: 14, color: 'rgba(26,26,46,0.8)', lineHeight: 21, marginTop: 12 },
  gap16: { height: 16 }
});`,

  'AddPlacesScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';

export default function AddPlacesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'AddPlaces'>>();

  const places = [
    { id: '1', name: 'Louvre Museum' },
    { id: '2', name: 'Notre-Dame Cathedral' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Add Places</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F5F5F7', borderRadius: 12, marginBottom: 16 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  addBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#E91E63' },
  addBtnText: { color: '#FFFFFF', fontWeight: '600' }
});`,

  'ItineraryViewScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';

export default function ItineraryViewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'ItineraryView'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'ItineraryView'>>();
  const tripId = route.params?.tripId || '1';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Itinerary View</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ItineraryMap', { tripId })}>
          <Text style={styles.mapLink}>Map</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.timeline}>
          <Text style={styles.day}>Day 1</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PlaceDetails', { placeId: '1', placeName: 'Eiffel Tower' })}>
            <Text style={styles.spot}>📍 Eiffel Tower - 10:00 AM</Text>
          </TouchableOpacity>
          <View style={styles.gap16} />
          <Text style={styles.day}>Day 2</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PlaceDetails', { placeId: '2', placeName: 'Louvre Museum' })}>
            <Text style={styles.spot}>📍 Louvre Museum - 02:00 PM</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  mapLink: { fontSize: 16, color: '#E91E63', fontWeight: '600', paddingHorizontal: 8 },
  content: { padding: 24 },
  timeline: { paddingLeft: 12 },
  day: { fontSize: 16, fontWeight: '700', color: '#E91E63', marginBottom: 8 },
  spot: { fontSize: 14, color: '#1A1A2E', textDecorationLine: 'underline' },
  gap16: { height: 16 }
});`,

  'ItineraryMapScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';

export default function ItineraryMapScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Itinerary Map</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.mapMock}>
        <Text style={styles.mapText}>[ Map View Simulation ]</Text>
        <Text style={styles.mapSubText}>Showing route for Paris trip</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  mapMock: { flex: 1, backgroundColor: '#E8E8E8', justifyContent: 'center', alignItems: 'center' },
  mapText: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  mapSubText: { fontSize: 14, color: '#8E8E93', marginTop: 8 }
});`,

  'PackingListScreen.tsx': `import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';

export default function PackingListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'PackingList'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'PackingList'>>();
  const tripId = route.params?.tripId || '1';

  const [items, setItems] = useState([
    { id: '1', name: 'Passport', checked: true },
    { id: '2', name: 'Camera', checked: false },
    { id: '3', name: 'Powerbank', checked: false },
  ]);

  const toggleCheck = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Packing List</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CheckingPacking', { tripId })}>
          <Text style={styles.overviewLink}>Overview</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => toggleCheck(item.id)} activeOpacity={0.7}>
            <View style={[styles.checkbox, item.checked && styles.checked]} />
            <Text style={[styles.itemName, item.checked && styles.itemChecked]}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  overviewLink: { fontSize: 16, color: '#E91E63', fontWeight: '600', paddingHorizontal: 8 },
  content: { padding: 24 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: '#8E8E93', marginRight: 12 },
  checked: { backgroundColor: '#E91E63', borderColor: '#E91E63' },
  itemName: { fontSize: 16, color: '#1A1A2E' },
  itemChecked: { textDecorationLine: 'line-through', color: '#8E8E93' }
});`,

  'CheckingPackingScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';

export default function CheckingPackingScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Packing Overview</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>1 of 3 items packed</Text>
        <View style={styles.progressBack}>
          <View style={styles.progressFill} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24, justifyContent: 'center', alignItems: 'center', flex: 1 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A2E' },
  progressBack: { width: '100%', height: 12, backgroundColor: '#F5F5F7', borderRadius: 6, marginTop: 20, overflow: 'hidden' },
  progressFill: { width: '33%', height: '100%', backgroundColor: '#E91E63' }
});`
};

const tripScreensDir = path.join(srcDir, 'features/trips/screens');
Object.keys(tripScreens).forEach(filename => {
  fs.writeFileSync(path.join(tripScreensDir, filename), tripScreens[filename]);
});

// 6. Generate and write Profile Screens
const profileScreens = {
  'ProfileMenuScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';

export default function ProfileMenuScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'ProfileMenu'>>();

  const menuItems = [
    { title: 'Profile Settings', route: 'ProfileSettings' as const },
    { title: 'User Levels', route: 'UserLevels' as const },
    { title: 'Upgrade Plan', route: 'UpgradePlan' as const },
    { title: 'Payment Methods', route: 'PaymentMethods' as const, params: { planId: 'pro' } },
    { title: 'Help & Support', route: 'HelpSupport' as const },
    { title: 'Privacy Policy', route: 'PrivacyPolicy' as const },
    { title: 'Terms & Conditions', route: 'Terms' as const },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Profile Menu</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar} />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@email.com</Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.item}
              onPress={() => navigation.navigate(item.route as any, item.params as any)}
            >
              <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  profileHeader: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F5F5F7', marginBottom: 12, borderWidth: 1.5, borderColor: '#E8E8E8' },
  name: { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  email: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  menu: { borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  item: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  itemText: { fontSize: 16, color: '#1A1A2E' }
});`,

  'ProfileSettingsScreen.tsx': `import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function ProfileSettingsScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <CustomTextField label="Full Name" hint="John Doe" value={name} onChangeText={setName} />
        <View style={styles.gap20} />
        <CustomTextField label="Email" hint="your@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <View style={styles.gap32} />
        <PrimaryButton text="Save Changes" onPressed={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  gap20: { height: 20 },
  gap32: { height: 32 }
});`,

  'UserLevelsScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';

export default function UserLevelsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>User Levels</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Text style={styles.levelName}>Globetrotter (Level 3)</Text>
        <Text style={styles.points}>1200 / 1500 XP</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24, justifyContent: 'center', alignItems: 'center', flex: 1 },
  levelName: { fontSize: 24, fontWeight: '700', color: '#E91E63' },
  points: { fontSize: 16, color: '#8E8E93', marginTop: 12 }
});`,

  'UpgradePlanScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function UpgradePlanScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'UpgradePlan'>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Upgrade Plan</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Pro Plan</Text>
          <Text style={styles.planPrice}>$9.99/mo</Text>
          <Text style={styles.planBenefit}>✓ Unlimited dynamic itineraries</Text>
          <Text style={styles.planBenefit}>✓ Offline maps & routing support</Text>
          <View style={styles.gap24} />
          <PrimaryButton text="Upgrade Now" onPressed={() => navigation.navigate('PaymentMethods', { planId: 'pro' })} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  planCard: { padding: 24, backgroundColor: '#FCE4EC', borderRadius: 16, borderWidth: 1.5, borderColor: '#E91E63' },
  planTitle: { fontSize: 20, fontWeight: '700', color: '#E91E63' },
  planPrice: { fontSize: 28, fontWeight: '800', color: '#1A1A2E', marginVertical: 12 },
  planBenefit: { fontSize: 14, color: 'rgba(26,26,46,0.8)', marginTop: 8 },
  gap24: { height: 24 }
});`,

  'PaymentMethodsScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';

export default function PaymentMethodsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'PaymentMethods'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'PaymentMethods'>>();
  const planId = route.params?.planId || 'pro';

  const cards = [
    { id: '1', type: 'Visa', last4: '4242' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PaymentDetails', { planId, cardId: item.id })}
          >
            <Text style={styles.cardText}>{item.type} ending in •••• {item.last4}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  card: { padding: 16, backgroundColor: '#F5F5F7', borderRadius: 12, borderWidth: 1, borderColor: '#E8E8E8' },
  cardText: { fontSize: 16, color: '#1A1A2E', fontWeight: '500' }
});`,

  'PaymentDetailsScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function PaymentDetailsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Text style={styles.info}>Plan: Pro Plan Upgrade</Text>
        <Text style={styles.amount}>Total: $9.99</Text>
        <View style={styles.gap32} />
        <PrimaryButton text="Pay Now" onPressed={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24, justifyContent: 'center', alignItems: 'center', flex: 1 },
  info: { fontSize: 18, color: '#1A1A2E' },
  amount: { fontSize: 24, fontWeight: '800', color: '#E91E63', marginTop: 12 },
  gap32: { height: 32 }
});`,

  'HelpSupportScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';

export default function HelpSupportScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>FAQs</Text>
        <Text style={styles.faqTitle}>How to plan a new trip?</Text>
        <Text style={styles.faqBody}>Go to My Itineraries list, tap the "+" floating button, and follow details.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  section: { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  faqTitle: { fontSize: 16, fontWeight: '600', color: '#E91E63' },
  faqBody: { fontSize: 14, color: 'rgba(26,26,46,0.8)', marginTop: 4 }
});`,

  'PrivacyPolicyScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.policyText}>
          Your privacy is extremely important to us. This privacy policy document outlines the types of personal information that is received and collected by ShrineTours and how it is used.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  policyText: { fontSize: 14, color: 'rgba(26,26,46,0.8)', lineHeight: 21 }
});`,

  'TermsScreen.tsx': `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';

export default function TermsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.termsText}>
          By using ShrineTours application, you agree to comply with and be bound by the following terms and conditions of use. If you disagree with any part of these terms, please do not use our application.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  termsText: { fontSize: 14, color: 'rgba(26,26,46,0.8)', lineHeight: 21 }
});`
};

const profileScreensDir = path.join(srcDir, 'features/profile/screens');
Object.keys(profileScreens).forEach(filename => {
  fs.writeFileSync(path.join(profileScreensDir, filename), profileScreens[filename]);
});

// 7. Update AppNavigator.tsx
const appNavigatorPath = path.join(srcDir, 'core/navigation/AppNavigator.tsx');
const newAppNavigatorContent = `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
import MyItinerariesScreen from '../../features/trips/screens/MyItinerariesScreen';
import PlanTripScreen from '../../features/trips/screens/PlanTripScreen';
import TripPreferencesScreen from '../../features/trips/screens/TripPreferencesScreen';
import TripSummaryScreen from '../../features/trips/screens/TripSummaryScreen';
import TripDetailsScreen from '../../features/trips/screens/TripDetailsScreen';
import PlaceDetailsScreen from '../../features/trips/screens/PlaceDetailsScreen';
import AddPlacesScreen from '../../features/trips/screens/AddPlacesScreen';
import ItineraryViewScreen from '../../features/trips/screens/ItineraryViewScreen';
import ItineraryMapScreen from '../../features/trips/screens/ItineraryMapScreen';
import PackingListScreen from '../../features/trips/screens/PackingListScreen';
import CheckingPackingScreen from '../../features/trips/screens/CheckingPackingScreen';
import ProfileMenuScreen from '../../features/profile/screens/ProfileMenuScreen';
import ProfileSettingsScreen from '../../features/profile/screens/ProfileSettingsScreen';
import UserLevelsScreen from '../../features/profile/screens/UserLevelsScreen';
import UpgradePlanScreen from '../../features/profile/screens/UpgradePlanScreen';
import PaymentMethodsScreen from '../../features/profile/screens/PaymentMethodsScreen';
import PaymentDetailsScreen from '../../features/profile/screens/PaymentDetailsScreen';
import HelpSupportScreen from '../../features/profile/screens/HelpSupportScreen';
import PrivacyPolicyScreen from '../../features/profile/screens/PrivacyPolicyScreen';
import TermsScreen from '../../features/profile/screens/TermsScreen';

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
      <Stack.Screen name="ItineraryView" component={ItineraryViewScreen} />
      <Stack.Screen name="ItineraryMap" component={ItineraryMapScreen} />
      <Stack.Screen name="PackingList" component={PackingListScreen} />
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
    </Stack.Navigator>
  );
};
`;
fs.writeFileSync(appNavigatorPath, newAppNavigatorContent);

console.log('Successfully completed full screen migration!');
