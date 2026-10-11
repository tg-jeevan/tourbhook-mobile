import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE_CODE,
  LanguageItem,
  getLanguageByCode,
} from './languages';

const LANGUAGE_STORAGE_KEY = 'user_language_preference';

class LanguageStore {
  private currentLanguageCode: string = DEFAULT_LANGUAGE_CODE;
  private isHydrated: boolean = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  async loadFromStorage(): Promise<string> {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored) {
        this.currentLanguageCode = stored;
      }
    } catch {
      // Fallback to default in case storage read fails
    } finally {
      this.isHydrated = true;
      this.notify();
    }
    return this.currentLanguageCode;
  }

  getLanguageCode(): string {
    return this.currentLanguageCode;
  }

  getLanguage(): LanguageItem {
    return getLanguageByCode(this.currentLanguageCode);
  }

  async setLanguageCode(code: string): Promise<void> {
    const validLanguage = getLanguageByCode(code);
    this.currentLanguageCode = validLanguage.code;
    this.notify();

    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, validLanguage.code);
    } catch {
      // Storage error ignored
    }
  }

  getIsHydrated(): boolean {
    return this.isHydrated;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => {
      try {
        l();
      } catch {
        // Ignored
      }
    });
  }

  reset(): void {
    this.currentLanguageCode = DEFAULT_LANGUAGE_CODE;
    this.notify();
  }
}

export const languageStore = new LanguageStore();

export function useLanguagePreference() {
  const [currentLanguageCode, setCurrentLanguageCode] = useState<string>(() =>
    languageStore.getLanguageCode(),
  );

  useEffect(() => {
    setCurrentLanguageCode(languageStore.getLanguageCode());
    const unsubscribe = languageStore.subscribe(() => {
      setCurrentLanguageCode(languageStore.getLanguageCode());
    });
    return unsubscribe;
  }, []);

  const currentLanguage = getLanguageByCode(currentLanguageCode);

  return {
    currentLanguage,
    currentLanguageCode,
    availableLanguages: AVAILABLE_LANGUAGES,
    setLanguage: (code: string) => languageStore.setLanguageCode(code),
  };
}
