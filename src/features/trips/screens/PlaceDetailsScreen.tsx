import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
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
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Reviews', {
              placeId: route.params?.placeId ?? '',
              placeName: route.params?.placeName ?? 'Eiffel Tower',
            })
          }
        >
        <Text style={styles.rating}>⭐ 4.8 (1,250 reviews)</Text>
        </TouchableOpacity>
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
});