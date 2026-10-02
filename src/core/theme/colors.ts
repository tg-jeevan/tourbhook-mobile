/**
 * Tourbhook Brand Color System
 * Single source of truth for the entire application palette.
 *
 * 1. Primary Brand: Ocean Teal (#0E7490) - Main actions, buttons, active nav, selected states
 * 2. Text / Navigation: Deep Navy (#10243F) - Titles, headings, structural UI, navigation
 * 3. CTA / Accent: Sunset Coral (#FF6B4A) - High-priority highlights, FABs, travel accents
 * 4. Background: Warm Sand (#F6F1E8) - Main application page background
 * 5. Content Surface: Pure White (#FFFFFF) - Cards, inputs, modals, sheets
 */

export const AppColors = {
  // --- PRIMARY BRAND (Ocean Teal) ---
  primary: '#0E7490',
  primaryLight: '#E0F2FE',
  primaryDark: '#0B5A70',
  primaryMuted: '#0E74901A',

  // --- CTA / ACCENT (Sunset Coral) ---
  accent: '#FF6B4A',
  accentLight: '#FFE8E2',
  accentDark: '#E04D2B',
  accentMuted: '#FF6B4A1A',

  // --- SURFACES & BACKGROUNDS ---
  background: '#F6F1E8', // Warm Sand
  surface: '#FFFFFF', // Pure White for cards/modals/inputs
  surfaceMuted: '#EDE8DE', // Subtle warm sand surface
  surfaceSubtle: '#FAF7F2', // Light sand tint for item rows
  surfaceHighlight: '#E6F4F8', // Subtle teal tint for highlights

  // --- TYPOGRAPHY / TEXT (Derived from Deep Navy #10243F) ---
  textPrimary: '#10243F', // Deep Navy
  textSecondary: '#3B4D63', // Slate Navy
  textMuted: '#64748B', // Muted Navy
  textLight: '#94A3B8', // Subtle captions & placeholders
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',
  navigation: '#10243F',

  // --- BORDERS & DIVIDERS ---
  border: '#E5E0D8', // Standardized warm neutral border
  borderLight: '#EFECE6', // Soft divider/border
  borderDark: '#CBD5E1', // Focused / stronger border
  divider: '#EBE6DE', // Standard divider

  // --- SEMANTIC STATES ---
  // Success
  success: '#10B981',
  successLight: '#ECFDF5',
  successDark: '#059669',
  successBorder: '#A7F3D0',

  // Error
  error: '#EF4444',
  errorLight: '#FEF2F2',
  errorDark: '#DC2626',
  errorBorder: '#FECACA',

  // Warning
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  warningDark: '#D97706',
  warningBorder: '#FDE68A',

  // Info
  info: '#0284C7',
  infoLight: '#F0F9FF',
  infoDark: '#0369A1',
  infoBorder: '#BAE6FD',

  // Ratings / Gold
  gold: '#F59E0B',
  goldLight: '#FEF3C7',

  // Neutrals & Overlays
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(16, 36, 63, 0.7)',

  // --- FEATURE & THIRD-PARTY BRAND COLORS ---
  instagram: '#E1306C',
  instagramAlt: '#C13584',
  youtube: '#FF0000',
  tripit: '#004B87',
  mapRoute: '#0E7490',
  mapMarker: '#0E7490',
  mapMarkerAccent: '#FF6B4A',

  // --- ALIASES FOR BACKWARD COMPATIBILITY ---
  navy: '#10243F',
  textDark: '#10243F',
  cardBorder: '#E5E0D8',
  backgroundGrey: '#F6F1E8',
} as const;

export type AppColorKey = keyof typeof AppColors;