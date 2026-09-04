import React, { useState } from 'react';
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
    { id: '2', name: 'Travel documents', checked: true },
    { id: '3', name: 'Camera', checked: false },
    { id: '4', name: 'Walking shoes', checked: false },
    { id: '5', name: 'Charger', checked: false },
    { id: '6', name: 'Jacket', checked: false },
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
});