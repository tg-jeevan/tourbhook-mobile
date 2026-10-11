import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE_CODE,
  getLanguageByCode,
} from './languages';
import { languageStore } from './languageStore';

describe('Languages Data & Language Store', () => {
  beforeEach(() => {
    languageStore.reset();
  });

  describe('languages data', () => {
    it('contains all 8 supported Indian and local languages', () => {
      const codes = AVAILABLE_LANGUAGES.map(l => l.code);
      expect(codes).toContain('en');
      expect(codes).toContain('hi');
      expect(codes).toContain('te');
      expect(codes).toContain('ta');
      expect(codes).toContain('kn');
      expect(codes).toContain('ml');
      expect(codes).toContain('mr');
      expect(codes).toContain('bn');
      expect(AVAILABLE_LANGUAGES.length).toBe(8);
    });

    it('getLanguageByCode returns correct language item', () => {
      const telugu = getLanguageByCode('te');
      expect(telugu.name).toBe('Telugu');
      expect(telugu.nativeName).toBe('తెలుగు');
      expect(telugu.symbol).toBe('తె');

      const hindi = getLanguageByCode('hi');
      expect(hindi.name).toBe('Hindi');
      expect(hindi.nativeName).toBe('हिन्दी');
      expect(hindi.symbol).toBe('अ');
    });

    it('getLanguageByCode falls back to English for invalid code', () => {
      const unknown = getLanguageByCode('xyz');
      expect(unknown.code).toBe(DEFAULT_LANGUAGE_CODE);
      expect(unknown.name).toBe('English');
    });
  });

  describe('languageStore', () => {
    it('defaults to English', () => {
      expect(languageStore.getLanguageCode()).toBe('en');
      expect(languageStore.getLanguage().name).toBe('English');
    });

    it('updates language code and notifies subscribers', async () => {
      const listener = jest.fn();
      const unsubscribe = languageStore.subscribe(listener);

      await languageStore.setLanguageCode('te');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(languageStore.getLanguageCode()).toBe('te');
      expect(languageStore.getLanguage().nativeName).toBe('తెలుగు');

      unsubscribe();
      await languageStore.setLanguageCode('hi');
      expect(listener).toHaveBeenCalledTimes(1); // not called again
      expect(languageStore.getLanguageCode()).toBe('hi');
    });

    it('reset sets back to default English', async () => {
      await languageStore.setLanguageCode('ta');
      expect(languageStore.getLanguageCode()).toBe('ta');
      languageStore.reset();
      expect(languageStore.getLanguageCode()).toBe('en');
    });
  });
});
