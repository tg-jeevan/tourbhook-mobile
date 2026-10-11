import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';
import { FeedbackToast } from '../../../core/components/FeedbackToast';
import { LanguageOption } from '../components/LanguageOption';
import { LanguageItem } from '../data/languages';
import { useLanguagePreference } from '../data/languageStore';
import { languageService } from '../services/languageService';
import { AppColors } from '../../../core/theme/colors';

export default function LanguageScreen() {
  const navigation = useNavigation();
  const { currentLanguage, currentLanguageCode, availableLanguages } =
    useLanguagePreference();

  const [loadingCode, setLoadingCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  useEffect(() => {
    // Synchronize latest language preference from backend
    languageService.getCurrentLanguage().catch(() => {
      // Handled silently by fallback
    });
  }, []);

  const handleSelectLanguage = async (language: LanguageItem) => {
    if (loadingCode !== null) return;
    if (language.code === currentLanguageCode) return;

    setLoadingCode(language.code);

    try {
      await languageService.updateLanguage(language.code);
      setToastMessage('Language preference updated');
      setToastType('success');
      setToastVisible(true);
    } catch {
      setToastMessage("Couldn't update language. Please try again.");
      setToastType('error');
      setToastVisible(true);
    } finally {
      setLoadingCode(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Subtitle */}
        <View style={styles.introSection}>
          <Text style={styles.sectionTitle}>Choose your preferred language</Text>
          <Text style={styles.sectionSubtitle}>
            Select the language you want to use across Tourbhook.
          </Text>
        </View>

        {/* Languages List */}
        <View style={styles.languagesList}>
          {availableLanguages.map((lang: LanguageItem) => (
            <LanguageOption
              key={lang.code}
              language={lang}
              isSelected={lang.code === currentLanguageCode}
              isLoading={loadingCode === lang.code}
              disabled={loadingCode !== null && loadingCode !== lang.code}
              onSelect={handleSelectLanguage}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Feedback Toast */}
      <FeedbackToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onDismiss={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  introSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: AppColors.textMuted,
    lineHeight: 20,
  },
  languagesList: {
    marginTop: 4,
  },
});
