import React from 'react';
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
});