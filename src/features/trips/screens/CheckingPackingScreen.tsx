import React from 'react';
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
});