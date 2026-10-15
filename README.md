# TourbhookMobile

> **TourbhookMobile** is a modern React Native CLI travel planning and community application. It provides an intuitive 6-step itinerary creation wizard, interactive day-by-day itinerary schedules, travel maps, packing checklists, travel reels, community group matching, user level gamification, and itinerary imports.

---

## 1. Project Overview & Verified Features

TourbhookMobile is built to assist travelers across every stage of their trip journey:

- **End-to-End Itinerary Creation Wizard**:
  - Step 1: Destination, travel dates, traveler group type, adult/child counts, traveler age, and medical requirements.
  - Step 2: Travel style preferences (Budget Friendly, Fast Travel, Relaxed Vacation, Explore Everything).
  - Step 3: Trip summary and confirmation.
  - Step 4: Attraction and point-of-interest discovery and selection.
  - Step 5: Transit mode preferences (Airplane, Train, Bus, Car, Boat, Public Transit).
  - Step 6: Automated itinerary synthesis and transition to packing.
- **Trip Management & Day-by-Day Timeline**:
  - View saved active, past, and draft itineraries.
  - Reorder, edit, and inspect timeline activities.
  - Interactive transit route maps powered by `react-native-maps`.
  - Smart packing checklists categorized by clothing, toiletries, gear, and documents.
- **Explore & Travel Reels**:
  - Video and image travel reels feed with creator tags, likes, and bookmarks.
  - Popular worldwide destinations with season guides, vibe tags, and ratings.
  - Category filters: Adventure, Culture, Food, Beach, and Nature.
- **Community & Travel Groups**:
  - Group matching based on travel style and destinations.
  - In-app travel group chat, member profiles, and level-gated community access.
- **Traveler Profile & Gamification**:
  - User level progression (Explorer, Adventurer, Trailblazer) with XP tracking.
  - Language selection, payment methods, and subscription tiers (Free, Explorer, Pro).
- **User Generated Content (UGC) & Social**:
  - Upload travel tips and reels with captioning.
  - Instagram account integration.

---

## 2. Technology Stack & Versions

All versions are derived directly from [`package.json`](file:///c:/Users/jeeva/TourbhookMobile/package.json):

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime** | [React](https://react.dev) | `19.2.3` | UI component foundation |
| **Framework** | [React Native CLI](https://reactnative.dev) | `0.87.1` | Native cross-platform mobile engine |
| **Language** | [TypeScript](https://www.typescriptlang.org) | `^6.0.3` | Static type safety and strict checking |
| **Navigation** | [React Navigation](https://reactnavigation.org) | `^7.3.18` / `^7.18.10` | Native stack navigators & typed routing |
| **State Store** | [Zustand](https://github.com/pmndrs/zustand) | `^5.0.15` | Lightweight feature state stores |
| **Server State** | [TanStack React Query](https://tanstack.com/query) | `^5.102.8` | Network cache and server mutation orchestration |
| **HTTP Client** | [Axios](https://axios-http.com) | `^1.20.0` | HTTP requests with token refresh interceptors |
| **Vector Icons** | [Lucide React Native](https://lucide.dev) | `^1.45.0` | Comprehensive iconography system |
| **Mapping** | [React Native Maps](https://github.com/react-native-maps/react-native-maps) | `^1.29.0` | Interactive maps, markers, and polylines |
| **Vectors/SVG** | [React Native SVG](https://github.com/software-mansion/react-native-svg) | `^15.15.5` | Declarative SVG rendering |
| **Storage** | [Async Storage](https://react-native-async-storage.github.io/async-storage/) | `^3.1.1` | Encrypted persistent client key-value storage |
| **Testing** | [Jest](https://jestjs.io) | `^29.6.3` | Unit & integration test runner (46 test suites) |
| **Engine** | Node.js | `>= 22.11.0` | Minimum recommended Node environment |

---

## 3. Directory Layout

```
TourbhookMobile/
├── App.tsx                        # Global bootstrap, providers & status bar setup
├── index.js                       # AppRegistry entry point
├── app.json                       # App name & native display name
├── package.json                   # Dependencies, devDependencies, and scripts
├── assets/                        # Packaged fonts (Inter) & official logo assets
├── android/                       # Android native project (namespace: com.tourbhookmobile)
├── ios/                           # iOS native project (bundle ID: com.tourbhookmobile)
├── docs/                          # Comprehensive architecture and audit documents
│   ├── PROJECT_STRUCTURE.md       # Detailed architectural guide & data flow
│   └── SAFE_REPOSITORY_AUDIT.md   # Safe repository audit, clutter inventory & findings
├── scratch/                       # Historical migration scripts & upstream reference
└── src/
    ├── core/                      # Application-wide shared infrastructure
    │   ├── api/                   # Axios client, interceptors, endpoints, exceptions
    │   ├── auth/                  # AuthContext, session restore, auth store
    │   ├── components/            # Reusable UI primitives (buttons, modals, navbar)
    │   ├── navigation/            # RootNavigator, AuthNavigator, AppNavigator, types
    │   ├── query/                 # React Query client instance
    │   ├── storage/               # AsyncStorage token & profile storage
    │   └── theme/                 # AppColors palette & typography tokens
    └── features/                  # Isolated domain feature modules
        ├── auth/                  # Onboarding & authentication screens
        ├── events/                # Travel events feed & event details
        ├── explore/               # Discovery feed, reels viewer, destination details
        ├── groups/                # Group matching, group chat, level gating
        ├── imports/               # Third-party travel itinerary ingestion & review
        ├── notifications/         # Notification feed & category filters
        ├── profile/               # Settings, user levels, subscription, payments
        ├── reviews/               # Attraction review submission & viewing
        ├── trips/                 # Itinerary wizard, timeline, map, and packing
        └── ugc/                   # User generated content & Instagram linking
```

---

## 4. Installation & Development Setup

### 4.1 Prerequisites
- **Node.js**: `v22.11.0` or higher
- **Package Manager**: `npm` (uses `package-lock.json`)
- **Android Development**: Android Studio, Android SDK (API 34+), JDK 17, and configured Android Emulator or physical device.
- **iOS Development (macOS only)**: Xcode 15+, CocoaPods, and Ruby bundler.

### 4.2 Initial Setup
```bash
# Clone the repository
git clone https://github.com/tg-jeevan/tourbhook-mobile.git
cd TourbhookMobile

# Install Node dependencies
npm install

# (macOS only) Install CocoaPods dependencies
bundle install
bundle exec pod install --project-directory=ios
```

---

## 5. Development & Verification Commands

All commands below are verified to run directly in this codebase:

```bash
# Start Metro bundler
npm start

# Run on connected Android device or emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run the complete Jest test suite (398 tests)
npm test

# Run a specific test file
npx jest src/features/trips/data/itineraryStore.test.ts

# Run static TypeScript type checking
npx tsc --noEmit

# Run ESLint code inspection
npm run lint
```

---

## 6. Environment Configuration & Backend Integrations

### 6.1 Backend API Endpoint
The central API configuration lives in [`src/core/api/apiConstants.ts`](file:///c:/Users/jeeva/TourbhookMobile/src/core/api/apiConstants.ts):
- **Base URL**: `http://32.193.3.150:8080/api/v1`
- **Request Interceptors**: Automatically append `Authorization: Bearer <token>` to protected endpoints.
- **Response Interceptors**: Automatically capture HTTP 401 errors, trigger token refresh via `/auth/refresh`, and replay queued requests.

### 6.2 Mock Mode vs Production Backend
To allow rapid UI testing without requiring an active remote server:
- **Instant Mock Login**: Available via `loginWithMock()` in `AuthContext` (or using the quick demo login button on sign-in screens).
- **Mock Data Fallbacks**: Realistic mock datasets are provided for exploration (`mockExploreData.ts`), travel groups (`groupFeatures.ts`), notifications (`mockNotificationsData.ts`), and UGC reels (`mockUGCData.ts`).
- When a valid auth session exists in local storage (`tokenStorage.ts`), the app seamlessly uses live API calls.

---

## 7. Developer Guide: How to Extend the Codebase

### 7.1 Adding a New Screen
1. Create your screen component under `src/features/<feature_name>/screens/<ScreenName>.tsx`.
2. Register the route name and parameter types in [`src/core/navigation/types.ts`](file:///c:/Users/jeeva/TourbhookMobile/src/core/navigation/types.ts) inside `AppStackParamList` (or `AuthStackParamList`).
3. Add `<Stack.Screen name="<ScreenName>" component={<ScreenName>} />` to [`src/core/navigation/AppNavigator.tsx`](file:///c:/Users/jeeva/TourbhookMobile/src/core/navigation/AppNavigator.tsx).

### 7.2 Adding a Shared Component
- Place application-wide primitives in `src/core/components/`.
- Ensure styling uses tokens from `src/core/theme/colors.ts` (`AppColors`) and `src/core/theme/typography.ts`.

### 7.3 Adding a Zustand Store
- Place feature-specific stores in `src/features/<feature_name>/data/<name>Store.ts`.
- Follow the subscriber/notify pattern established in `itineraryStore.ts` or standard Zustand `create(...)`.

### 7.4 Adding Visual Assets
- Place vector icons in `lucide-react-native` where possible.
- Place image assets in `assets/images/`.
- Reference with `require('../../../../assets/images/<filename>.png')`.

### 7.5 Adding Tests
- Place unit tests adjacent to implementation files or inside `<feature>/data/` as `<name>.test.ts` / `<name>.test.tsx`.
- All tests run automatically via `npm test`.

---

## 8. Common Troubleshooting

### Metro Cache Issues
If Metro fails to resolve newly added packages or throws caching errors:
```bash
npx react-native start --reset-cache
```

### Android Build Clean
If Gradle build fails after pulling upstream changes:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS CocoaPods Clean
```bash
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
cd ..
npm run ios
```

### Font Display Issues
If custom Inter fonts appear as standard system fonts:
- Ensure the app was recompiled after linking: `Inter-*.ttf` files are present in `android/app/src/main/assets/fonts/` and registered under `UIAppFonts` in `ios/TourbhookMobile/Info.plist`.

---

## 9. Documentation References

For in-depth architectural specifications and safe audit details:
- [**Project Structure Guide**](file:///c:/Users/jeeva/TourbhookMobile/docs/PROJECT_STRUCTURE.md): Full breakdown of navigators, data flow, and components.
- [**Safe Repository Audit**](file:///c:/Users/jeeva/TourbhookMobile/docs/SAFE_REPOSITORY_AUDIT.md): Detailed inventory of dependencies, duplicate assets, legacy references, and test results.
