import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { X, MoreVertical } from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { UGCContentDisplay } from '../../ugc/components/UGCContentDisplay';

export default function PlaceDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'PlaceDetails'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'PlaceDetails'>>();

  const placeName = route.params?.placeName || 'this place';
  const placeId = route.params?.placeId || '1';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <X size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Place Details</Text>
        <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
          <MoreVertical size={22} color={AppColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={require('../../../../assets/images/welcomeImage.jpg')} style={styles.image} />
        <View style={styles.gap16} />
        <Text style={styles.title}>{placeName}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Reviews', {
              placeId,
              placeName,
            })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.rating}>⭐ 4.8 (1,250 reviews)</Text>
        </TouchableOpacity>
        <View style={styles.gap16} />
        <Text style={styles.desc}>
          More details about {placeName} will appear here once place descriptions are available
          from the backend.
        </Text>
        <View style={styles.gap16} />

        <TouchableOpacity
          style={styles.nearbyEventsBtn}
          onPress={() =>
            navigation.navigate('EventsFeed', {
              destinationId: 'paris',
              destinationName: 'Paris, France',
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.nearbyEventsText}>🎪 Browse Events & Activities in {placeName}</Text>
        </TouchableOpacity>
        <View style={styles.gap24} />

        {/* UGC Content Display */}
        <UGCContentDisplay
          destination={placeName}
          placeId={placeId}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF7F2' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF7F2',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: AppColors.textPrimary },
  headerIconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  image: { width: '100%', height: 200, borderRadius: 20 },
  title: { fontSize: 26, fontWeight: '800', color: AppColors.textPrimary, letterSpacing: -0.3 },
  rating: { fontSize: 13, color: AppColors.textMuted, marginTop: 4, fontWeight: '500' },
  desc: { fontSize: 13, color: AppColors.textSecondary, lineHeight: 20, marginTop: 8 },
  nearbyEventsBtn: {
    padding: 14,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
  },
  nearbyEventsText: { fontSize: 13, fontWeight: '700', color: AppColors.primary },
  gap16: { height: 14 },
  gap24: { height: 20 },
});