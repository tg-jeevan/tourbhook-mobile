import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { buildDraftFromSource, IMPORT_SOURCES, ImportSourceId } from '../types/importTypes';

const GREEN = '#1FAE5D';
const TEXT_DARK = '#1A1A2E';
const TEXT_MUTED = '#8E8E93';
const PURPLE = '#7C5CFC';
const PURPLE_LIGHT = '#F1EDFF';
const INFO_BG = '#EAF3FB';
const INFO_TEXT = '#3A6EA5';

export default function ImportDataScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'ImportData'>>();

  const [expandedSource, setExpandedSource] = useState<ImportSourceId | null>(null);
  const [csvText, setCsvText] = useState('');
  const [processingSource, setProcessingSource] = useState<ImportSourceId | null>(null);

  const startImport = (source: ImportSourceId, csv?: string) => {
    setProcessingSource(source);
    setTimeout(() => {
      const draft = buildDraftFromSource(source, csv);
      setProcessingSource(null);
      navigation.navigate('ImportReview', { draft });
    }, 900);
  };

  const handleSourcePress = (source: ImportSourceId) => {
    if (source === 'csv') {
      setExpandedSource(prev => (prev === 'csv' ? null : 'csv'));
      return;
    }
    startImport(source);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Import Data</Text>
          <View style={styles.betaBadge}>
            <Text style={styles.betaBadgeText}>Beta</Text>
          </View>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Import your travel data from other platforms</Text>

        {IMPORT_SOURCES.map(sourceOption => {
          const isProcessing = processingSource === sourceOption.id;
          const isExpanded = expandedSource === sourceOption.id;

          return (
            <View key={sourceOption.id}>
              <TouchableOpacity
                style={styles.sourceCard}
                activeOpacity={0.8}
                onPress={() => handleSourcePress(sourceOption.id)}
                disabled={processingSource !== null}
              >
                <View
                  style={[
                    styles.sourceIconWrap,
                    { backgroundColor: sourceOption.iconBackgroundColor },
                  ]}
                >
                  <Text style={styles.sourceIconEmoji}>{sourceOption.iconEmoji}</Text>
                </View>
                <View style={styles.sourceTextBlock}>
                  <Text style={styles.sourceTitle}>{sourceOption.title}</Text>
                  <Text style={styles.sourceDescription}>{sourceOption.description}</Text>
                </View>
                {isProcessing ? (
                  <ActivityIndicator color={GREEN} />
                ) : (
                  <Text style={styles.chevron}>{'>'}</Text>
                )}
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.csvPanel}>
                  <Text style={styles.csvPanelLabel}>Paste your CSV data</Text>
                  <TextInput
                    style={styles.csvInput}
                    multiline
                    numberOfLines={6}
                    placeholder={'Trip name\n- Place one\n- Place two'}
                    placeholderTextColor={TEXT_MUTED}
                    value={csvText}
                    onChangeText={setCsvText}
                    textAlignVertical="top"
                  />
                  <TouchableOpacity
                    style={styles.csvImportButton}
                    activeOpacity={0.85}
                    onPress={() => startImport('csv', csvText)}
                    disabled={!csvText.trim() || processingSource !== null}
                  >
                    <Text style={styles.csvImportButtonText}>Import CSV</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>ⓘ</Text>
          <Text style={styles.infoText}>
            Your data is processed securely and only used to create your personal travel
            experience.
          </Text>
        </View>
      </ScrollView>
      <BottomNavBar active="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitleRow: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: TEXT_DARK },
  betaBadge: { backgroundColor: PURPLE_LIGHT, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  betaBadgeText: { fontSize: 11, fontWeight: '700', color: PURPLE },
  headerPlaceholder: { width: 44 },

  content: { padding: 24, paddingBottom: 24 },
  subtitle: { fontSize: 14, fontWeight: '600', color: GREEN, marginBottom: 20 },

  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFF2',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sourceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFF2',
    marginRight: 12,
  },
  sourceIconEmoji: { fontSize: 20 },
  sourceTextBlock: { flex: 1 },
  sourceTitle: { fontSize: 15, fontWeight: '700', color: TEXT_DARK },
  sourceDescription: { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },
  chevron: { fontSize: 16, color: TEXT_MUTED },

  csvPanel: {
    backgroundColor: '#F7F7F9',
    borderRadius: 14,
    padding: 14,
    marginTop: -4,
    marginBottom: 12,
  },
  csvPanelLabel: { fontSize: 13, fontWeight: '600', color: TEXT_DARK, marginBottom: 8 },
  csvInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 12,
    minHeight: 110,
    fontSize: 13,
    color: TEXT_DARK,
    marginBottom: 10,
  },
  csvImportButton: {
    backgroundColor: GREEN,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  csvImportButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },

  infoBanner: {
    flexDirection: 'row',
    backgroundColor: INFO_BG,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  infoIcon: { fontSize: 16, color: INFO_TEXT, marginRight: 10 },
  infoText: { flex: 1, fontSize: 12, color: INFO_TEXT, lineHeight: 17 },
});