export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  symbol: string;
  enabled: boolean;
}

export const AVAILABLE_LANGUAGES: LanguageItem[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    symbol: 'Aa',
    enabled: true,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    symbol: 'अ',
    enabled: true,
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    symbol: 'తె',
    enabled: true,
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    symbol: 'த',
    enabled: true,
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    symbol: 'ಕ',
    enabled: true,
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    symbol: 'മ',
    enabled: true,
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    symbol: 'म',
    enabled: true,
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    symbol: 'বা',
    enabled: true,
  },
];

export const DEFAULT_LANGUAGE_CODE = 'en';

export function getLanguageByCode(code: string): LanguageItem {
  if (!code) return AVAILABLE_LANGUAGES[0];
  const normalized = code.toLowerCase().trim();
  const match = AVAILABLE_LANGUAGES.find(
    lang => lang.code.toLowerCase() === normalized,
  );
  return match || AVAILABLE_LANGUAGES[0];
}
