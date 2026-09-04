import React, { useEffect } from 'react';
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
});