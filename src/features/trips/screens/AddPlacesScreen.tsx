import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';

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
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: AppColors.textPrimary },
  placeholder: { width: 44 },
  content: { padding: 24 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 16,
  },
  itemName: { fontSize: 16, fontWeight: '600', color: AppColors.textPrimary },
  addBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: AppColors.primary },
  addBtnText: { color: AppColors.textOnPrimary, fontWeight: '600' },
});