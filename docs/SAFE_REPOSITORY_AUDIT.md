# TourbhookMobile — Safe Repository Audit & Clutter Inventory

**Audit Date**: October 2026  
**Auditor**: Senior React Native Engineer  
**Repository**: [https://github.com/tg-jeevan/tourbhook-mobile](https://github.com/tg-jeevan/tourbhook-mobile)  
**Branch**: `main`  
**Core Constraint**: Strict non-destructive repository audit; 100% preservation of all existing files, tracked state, source code, and assets.

---

## 1. Executive Summary

A comprehensive, non-destructive audit of the **TourbhookMobile** repository was executed. The project is an actively developed React Native CLI application (React 19.2.3, React Native 0.87.1, TypeScript 6.0.3) containing a mature, feature-rich travel planning application with 10 feature modules and 46 automated test suites.

### Key Audit Highlights:
1. **Verified Test & Typecheck Health**:
   - Jest Test Suite: **46 passed / 46 passed (398 tests passed, 0 failed)** in 108s.
   - TypeScript Compilation: **`npx tsc --noEmit` exited with 0 errors**.
   - ESLint Baseline: Pre-existing 143 lint notifications (54 errors, 89 warnings, mostly `@typescript-eslint/no-unused-vars` and inline styles) preserved without risky refactoring.
2. **App Branding & Native Identity**:
   - The application ID and package namespace is uniformly `com.tourbhookmobile` across Android and iOS.
   - App display name is `TourbhookMobile` in `app.json`, `android/app/src/main/res/values/strings.xml`, and `ios/TourbhookMobile/Info.plist`.
3. **Legacy "Shrine Tours" Audit**:
   - The ancestor project was a Flutter app named `shrine_tours` located in `scratch/shrine_tours_flutter/` which was converted to React Native using `scratch/migrate_all.js`.
   - All references to "shrine" inside `src/` are **legitimate travel-domain concepts** (e.g. visiting Shinto shrines in Tokyo and Kyoto). No active application code contains legacy Shrine Tours branding.
4. **Duplicate & Unused Assets**:
   - `assets/images/appLogoTransparent.png` is **byte-for-byte identical (SHA256: `BA95450F...`)** to `assets/images/tourBhookOfficialLogoSymbol.png`.
   - `gradientOverlay.png` (209 bytes) and `tourBhookOfficialLogo.png` (332 KB) are unreferenced in runtime code.
   - Per core safety rules, all assets have been preserved.
5. **Safe `.gitignore` Modernization**:
   - Targeted, non-destructive ignore rules were added for local environment variables (`.env*`), IDE directories (`.vscode/`), package manager debug logs, compiler caches (`.tsbuildinfo`, `.eslintcache`), and mobile binary packages (`*.apk`, `*.aab`).
   - Zero tracked files were untracked or modified.

---

## 2. Repository Structure & Module Breakdown

### 2.1 Root Structure
```
TourbhookMobile/
├── App.tsx                     # Global App bootstrap & provider tree
├── index.js                    # Entry point registering Root component
├── app.json                    # Application identity & display name
├── package.json                # Dependencies, devDependencies, and scripts
├── package-lock.json           # NPM deterministic dependency tree
├── tsconfig.json               # TypeScript configuration extending @react-native
├── jest.config.js              # Jest test configuration with transform mappings
├── jest.setup.js               # Jest native mocks (maps, async-storage)
├── .eslintrc.js                # ESLint configuration extending @react-native
├── .prettierrc.js              # Code formatting rules
├── metro.config.js             # Metro bundler configuration
├── babel.config.js             # Babel compiler preset configuration
├── react-native.config.js      # React Native CLI configuration
├── Gemfile                     # Ruby bundler configuration for CocoaPods
├── .bundle/                    # Bundler configuration (vendor/bundle)
├── .kilo/                      # Local editor agent configuration
├── assets/                     # Shared fonts & image assets
├── android/                    # Android native project
├── ios/                        # iOS native project
├── docs/                       # Architecture & Audit documentation
├── scratch/                    # Historical Flutter repo & migration scripts
└── src/                        # Application source code (core & features)
```

### 2.2 Major Module Purpose & Responsibilities

| Directory | Module / Purpose | Status |
| :--- | :--- | :--- |
| `src/core/api/` | Centralized Axios HTTP client, token refresh queue, base URLs, and exceptions. | Verified active |
| `src/core/auth/` | Authentication React Context, session restoration, user interfaces, auth store. | Verified active |
| `src/core/components/` | Core UI primitives (buttons, modals, headers, bottom nav, logos). | Verified active |
| `src/core/navigation/` | Stack navigators (`RootNavigator`, `AuthNavigator`, `AppNavigator`) and route typings. | Verified active |
| `src/core/query/` | TanStack React Query client singleton. | Verified active |
| `src/core/storage/` | Persistent AsyncStorage wrapper for auth tokens. | Verified active |
| `src/core/theme/` | Design system color palette (`AppColors`) and typography tokens. | Verified active |
| `src/features/trips/` | End-to-end 6-step trip wizard, day-by-day itinerary, interactive map, and packing list. | Verified active |
| `src/features/auth/` | Onboarding, sign in, sign up, password reset, and welcome screens. | Verified active |
| `src/features/explore/` | Destination discovery, reels player, category filters, and curated collections. | Verified active |
| `src/features/groups/` | Community matching, group chat, level gating, and group details. | Verified active |
| `src/features/profile/` | Account settings, language preferences, user levels, upgrade plans, payments, help. | Verified active |
| `src/features/ugc/` | User Generated Content creation, reel uploading, Instagram integration. | Verified active |
| `src/features/notifications/` | Filterable in-app alerts (updates, trips, reviews). | Verified active |
| `src/features/events/` | Destination event listings and event details. | Verified active |
| `src/features/imports/` | Third-party itinerary importing and review screen. | Verified active |
| `src/features/reviews/` | Attraction reviews and rating submission. | Verified active |

---

## 3. Confirmed Obsolete References & Files

### 3.1 Historical Flutter Codebase (`scratch/shrine_tours_flutter/`)
- **Finding**: A complete Flutter project exists inside `scratch/shrine_tours_flutter/` (originally cloned from `https://github.com/KK13221/-Shrine_Tours-.git`).
- **Purpose**: This was the Flutter mobile application from which the current React Native `TourbhookMobile` was rewritten/migrated.
- **Evidence**:
  - `scratch/shrine_tours_flutter/pubspec.yaml` specifies `name: shrine_tours`.
  - `scratch/migrate_all.js` (69 KB) is a migration script written to convert Flutter models, screens, and BLoCs into React Native TypeScript screens and Zustand stores.
- **Action**: Preserved in place. Documented as historical source code.

### 3.2 "Shrine" Keyword Distinction: Legacy vs Domain Concept
A targeted search for `"shrine"` across the repository reveals two distinct categories:

1. **Legacy Ancestor References (Confined to `scratch/`)**:
   - `scratch/shrine_tours_flutter/**` (Dart code, Flutter assets, BLoCs)
   - `scratch/shrine_tours_flutter/README.md`
   - `scratch/shrine_tours_flutter/lib/features/profile/presentation/screens/help_support_screen.dart` (`shrine.tours1@gmail.com`)
2. **Legitimate Travel Domain Concepts (In `src/`)**:
   - `src/features/explore/data/mockExploreData.ts` (Line 152):  
     `'...serene Shinto shrines, and rich pop-culture districts.'` (describing Tokyo, Japan).
   - `src/features/groups/types/groupTypes.ts` (Line 145):  
     `'Quiet morning walks through shrines, tea ceremonies and bamboo groves.'` (describing Kyoto cultural travel group).

> **Verification**: Neither `src/` nor `android/` nor `ios/` contains any legacy "Shrine Tours" app branding. All occurrences in `src/` are legitimate tourist destination concepts and must not be altered.

---

## 4. Asset Analysis & Potential Duplicates

### 4.1 Image Inventory (`assets/images/`)

| File Name | File Size | SHA256 Hash | Status / Usage |
| :--- | :--- | :--- | :--- |
| `tourBhookOfficialLogoSymbol.png` | 422,578 B | `BA95450F02FE3BEE17F34BBBE2CD7834FA5A5776F9C18E4BD9B577C86F73D44F` | **Active**: Imported in `AppLogo.tsx` and `WelcomeScreen.tsx`. |
| `appLogoTransparent.png` | 422,578 B | `BA95450F02FE3BEE17F34BBBE2CD7834FA5A5776F9C18E4BD9B577C86F73D44F` | **Duplicate**: 100% byte-for-byte identical to `tourBhookOfficialLogoSymbol.png`. Unreferenced in `src/`. |
| `tourBhookOfficialLogoTransparent.png` | 42,102 B | Distinct | **Active**: Imported in `AppLogo.tsx`. |
| `startup-india-logo.png` | 135,072 B | Distinct | **Active**: Imported in `WelcomeScreen.tsx` and tested in `OnboardingAndAuthFlow.test.tsx`. |
| `welcomeHeroBackground.jpg` | 221,842 B | Distinct | **Active**: Imported in `OnboardingScreen.tsx`, `SignInScreen.tsx`, `SignUpScreen.tsx`, `WelcomeScreen.tsx`. |
| `welcomeImage.jpg` | 1,075,766 B | Distinct | **Active**: Imported in `PlaceDetailsScreen.tsx` and `OnboardingScreen.tsx`. |
| `welcomeTravelIllustration.png` | 858,338 B | Distinct | **Active**: Imported across auth screens (`SignInScreen`, `SignUpScreen`, `ForgotPasswordScreen`, `OTPVerificationScreen`, `ResetPasswordScreen`, `WelcomeScreen`). |
| `tourBhookOfficialLogo.png` | 332,915 B | Distinct | **Unreferenced**: Full-color logo variant not currently imported in `src/`. Preserved. |
| `gradientOverlay.png` | 209 B | Distinct | **Unreferenced**: Generated by `scratch/generate_gradient.js`. React Native components use CSS-in-JS style overlays instead. Preserved. |

### 4.2 Font Synchronization (`assets/fonts/` vs `android/` / `ios/`)
- `assets/fonts/Inter-Regular.ttf` (411 KB)
- `assets/fonts/Inter-SemiBold.ttf` (419 KB)
- `assets/fonts/Inter-Bold.ttf` (420 KB)
- `assets/fonts/Inter-ExtraBold.ttf` (421 KB)
- **Status**: Identical binary copies are synchronized in `android/app/src/main/assets/fonts/` and registered under `UIAppFonts` in `ios/TourbhookMobile/Info.plist`. Both locations are required for native rendering.

---

## 5. Dependency Audit & Dead Code

### 5.1 Runtime Dependencies (`package.json`)

| Dependency | Declared Version | Actual Usage in `src/` | Evaluation |
| :--- | :--- | :--- | :--- |
| `@react-native-async-storage/async-storage` | `^3.1.1` | Used in `tokenStorage.ts`, `onboardingStorage.ts` | Essential |
| `@react-native/new-app-screen` | `0.87.1` | **Zero imports** in `src/` or `__tests__/` | **Suspected Unused**: Leftover template dependency from CLI init. Preserved per non-destructive rule. |
| `@react-navigation/native` | `^7.3.18` | Core navigation container & route hooks | Essential |
| `@react-navigation/native-stack` | `^7.18.10` | Native stack navigators | Essential |
| `@tanstack/react-query` | `^5.102.8` | Server state query client (`queryClient.ts`) | Essential |
| `axios` | `^1.20.0` | HTTP transport client (`apiClient.ts`) | Essential |
| `lucide-react-native` | `^1.45.0` | Comprehensive icon library across all features | Essential |
| `pngjs` | `^7.0.0` | **Zero imports in `src/`**. Used only in `scratch/*.js` | **Suspected Misclassified**: Build tool used for script generation; belongs in `devDependencies`. Preserved per rule. |
| `react` | `19.2.3` | React engine | Essential |
| `react-native` | `0.87.1` | React Native framework | Essential |
| `react-native-maps` | `^1.29.0` | Used in `ItineraryMapScreen.tsx` & `ItineraryDayRouteMap.tsx` | Essential |
| `react-native-safe-area-context` | `^5.9.1` | Screen container insets | Essential |
| `react-native-screens` | `^4.27.0` | Native screen optimization for React Navigation | Essential |
| `react-native-svg` | `^15.15.5` | Custom SVG graphics, social badges, illustrations | Essential |
| `zustand` | `^5.0.15` | Client state management across 6+ feature stores | Essential |

### 5.2 Pre-existing Generated Artifacts
- **`android/app/src/main/assets/index.android.bundle`** (3.74 MB):
  - Tracked in Git.
  - This is a pre-bundled JavaScript production bundle generated by React Native CLI.
  - Per strict non-destructive criteria, it remains tracked and preserved.

---

## 6. Safe `.gitignore` Management (Phase 3)

### 6.1 Review of Added Rules
The following conservative, standard ignore rules were added to `.gitignore` without untracking any currently committed files:

```gitignore
# Local environment & secrets (preserving any committed .env.example if created)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
!.env.example

# Editor directories & workspaces
.vscode/
*.code-workspace

# Windows & OS desktop metadata
Thumbs.db
ehthumbs.db
Desktop.ini

# TypeScript & Linter caches
*.tsbuildinfo
.eslintcache
.stylelintcache

# Node / Package manager logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Metro & React Native compiler caches
.metro/
.react-native-tsc/

# Standalone Android binary packages (debug/release outputs)
*.apk
*.aab
```

### 6.2 Safeguard Verification:
- None of the newly ignored patterns match existing tracked repository files.
- No broad wildcards (`*.json`, `*.png`, `src/`, `android/`, `ios/`, `scratch/`) were introduced.
- No files were removed from Git tracking (`git rm --cached` was not executed).

---

## 7. Verification Results (Phase 9)

| Verification Check | Tool / Command | Result | Details |
| :--- | :--- | :--- | :--- |
| **Jest Automated Tests** | `npm test` | **PASS (46/46 suites)** | 398 passed, 0 failed, 108.2s execution time. |
| **TypeScript Compilation** | `npx tsc --noEmit` | **PASS (0 errors)** | Clean typecheck across all `.ts` and `.tsx` source and test files. |
| **ESLint Analysis** | `npm run lint` | **Baseline Documented** | 143 items (54 errors, 89 warnings), mostly `@typescript-eslint/no-unused-vars` and inline styling. Preserved to prevent breaking functioning code. |
| **Git Working Tree Integrity** | `git status` | **Verified Safe** | No files deleted, moved, renamed, or untracked. Only `.gitignore`, `README.md`, and new documentation in `docs/` touched. |

---

## 8. Recommended Non-Destructive Improvements (Future Authorized Tasks)

The following items are documented for future review and should only be addressed under explicit user authorization:

1. **Dependency Hygiene**:
   - Safely move `pngjs` from `dependencies` to `devDependencies` if retaining scratch icon generation scripts.
   - Remove unused `@react-native/new-app-screen` from `package.json` after verifying no runtime dependencies exist.
2. **Asset Deduplication**:
   - `assets/images/appLogoTransparent.png` is an exact duplicate of `tourBhookOfficialLogoSymbol.png`. A future task may safely remove it and ensure any references point to `tourBhookOfficialLogoSymbol.png`.
3. **ESLint Cleanup**:
   - A dedicated linting cleanup task can safely remove unused imports and define explicit types for React Hook dependency arrays without altering user-facing functionality.
4. **Scratch Folder Archiving**:
   - When no longer needed for historical reference, `scratch/` could be archived to an external backup repository.
