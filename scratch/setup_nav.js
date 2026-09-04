const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../src');

const screens = [
  { path: 'features/auth/screens/WelcomeScreen.tsx', name: 'WelcomeScreen' },
  { path: 'features/auth/screens/SignInScreen.tsx', name: 'SignInScreen' },
  { path: 'features/auth/screens/SignUpScreen.tsx', name: 'SignUpScreen' },
  { path: 'features/trips/screens/MyItinerariesScreen.tsx', name: 'MyItinerariesScreen' },
  { path: 'features/trips/screens/PlanTripScreen.tsx', name: 'PlanTripScreen' },
  { path: 'features/trips/screens/TripDetailsScreen.tsx', name: 'TripDetailsScreen' },
  { path: 'features/trips/screens/ItineraryViewScreen.tsx', name: 'ItineraryViewScreen' },
  { path: 'features/trips/screens/PackingListScreen.tsx', name: 'PackingListScreen' },
  { path: 'features/profile/screens/ProfileScreen.tsx', name: 'ProfileScreen' },
];

const screenTemplate = (name) => `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ${name} = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>${name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});

export default ${name};
`;

screens.forEach(screen => {
  const fullPath = path.join(baseDir, screen.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, screenTemplate(screen.name));
});

const typesContent = `import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type AppStackParamList = {
  MyItineraries: undefined;
  PlanTrip: undefined;
  TripDetails: undefined;
  ItineraryView: undefined;
  PackingList: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};
`;

const authNavContent = `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import WelcomeScreen from '../../features/auth/screens/WelcomeScreen';
import SignInScreen from '../../features/auth/screens/SignInScreen';
import SignUpScreen from '../../features/auth/screens/SignUpScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};
`;

const appNavContent = `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
import MyItinerariesScreen from '../../features/trips/screens/MyItinerariesScreen';
import PlanTripScreen from '../../features/trips/screens/PlanTripScreen';
import TripDetailsScreen from '../../features/trips/screens/TripDetailsScreen';
import ItineraryViewScreen from '../../features/trips/screens/ItineraryViewScreen';
import PackingListScreen from '../../features/trips/screens/PackingListScreen';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MyItineraries">
      <Stack.Screen name="MyItineraries" component={MyItinerariesScreen} />
      <Stack.Screen name="PlanTrip" component={PlanTripScreen} />
      <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
      <Stack.Screen name="ItineraryView" component={ItineraryViewScreen} />
      <Stack.Screen name="PackingList" component={PackingListScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
`;

const rootNavContent = `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Note: isAuthenticated state should be managed by a global state manager (e.g., Context, Redux, Zustand)
// This is a placeholder for the wiring.
export const RootNavigator = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
`;

const navDir = path.join(baseDir, 'core/navigation');
fs.mkdirSync(navDir, { recursive: true });
fs.writeFileSync(path.join(navDir, 'types.ts'), typesContent);
fs.writeFileSync(path.join(navDir, 'AuthNavigator.tsx'), authNavContent);
fs.writeFileSync(path.join(navDir, 'AppNavigator.tsx'), appNavContent);
fs.writeFileSync(path.join(navDir, 'RootNavigator.tsx'), rootNavContent);

console.log('Setup complete!');
