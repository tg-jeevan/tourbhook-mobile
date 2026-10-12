import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import SplashScreen from '../../features/auth/screens/SplashScreen';
import OnboardingScreen from '../../features/auth/screens/OnboardingScreen';
import WelcomeScreen from '../../features/auth/screens/WelcomeScreen';
import SignInScreen from '../../features/auth/screens/SignInScreen';
import SignUpScreen from '../../features/auth/screens/SignUpScreen';
import ForgotPasswordScreen from '../../features/auth/screens/ForgotPasswordScreen';
import OTPVerificationScreen from '../../features/auth/screens/OTPVerificationScreen';
import ResetPasswordScreen from '../../features/auth/screens/ResetPasswordScreen';
import { isOnboardingCompleted } from '../../features/auth/services/onboardingStorage';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  initialRoute?: keyof AuthStackParamList;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({ initialRoute }) => {
  const [initialRouteName, setInitialRouteName] = useState<keyof AuthStackParamList | null>(
    initialRoute || null
  );

  useEffect(() => {
    if (!initialRoute) {
      let isMounted = true;
      isOnboardingCompleted().then((completed) => {
        if (isMounted) {
          setInitialRouteName(completed ? 'Welcome' : 'Onboarding');
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [initialRoute]);

  if (!initialRouteName) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      key={initialRouteName}
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        orientation: 'portrait',
        statusBarHidden: true,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
    </Stack.Navigator>
  );
};
