import React from 'react';
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
});