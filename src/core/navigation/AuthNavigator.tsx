import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import SplashScreen from '../../features/auth/screens/SplashScreen';
import WelcomeScreen from '../../features/auth/screens/WelcomeScreen';
import SignInScreen from '../../features/auth/screens/SignInScreen';
import SignUpScreen from '../../features/auth/screens/SignUpScreen';
import ForgotPasswordScreen from '../../features/auth/screens/ForgotPasswordScreen';
import OTPVerificationScreen from '../../features/auth/screens/OTPVerificationScreen';
import ResetPasswordScreen from '../../features/auth/screens/ResetPasswordScreen';
import DevScreenTester from './DevScreenNavigator';

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
      <Stack.Screen name="DevScreenTester" component={DevScreenTester} />
    </Stack.Navigator>
  );
};
