import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_STORAGE_KEY = '@tourbhook_onboarding_completed';

/**
 * Checks if the first-time onboarding flow has been completed.
 * Returns true if completed, false on first launch.
 */
export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

/**
 * Marks first-time onboarding as completed so subsequent launches skip it.
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  } catch {
    // Ignore storage write errors
  }
}

/**
 * Resets the onboarding status (useful for testing or debugging).
 */
export async function resetOnboardingStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    // Ignore storage deletion errors
  }
}
