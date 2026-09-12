import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthToken, User } from '../auth/authModels';


const KEYS = {
  accessToken: 'auth_access_token',
  refreshToken: 'auth_refresh_token',
  expiresAt: 'auth_expires_at',
  userId: 'auth_user_id',
  userName: 'auth_user_name',
  userEmail: 'auth_user_email',
  userPhone: 'auth_user_phone',
  userPremium: 'auth_user_premium',
  userProfilePicture: 'auth_user_profile_picture',
} as const;

export async function saveTokens(token: AuthToken): Promise<void> {
  await AsyncStorage.setMany({
    [KEYS.accessToken]: token.accessToken,
    [KEYS.refreshToken]: token.refreshToken,
    [KEYS.expiresAt]: token.expiresAt,
  });
}

export async function saveUserInfo(user: User): Promise<void> {
  const entries: Record<string, string> = {
    [KEYS.userName]: user.name ?? '',
    [KEYS.userEmail]: user.email ?? '',
    [KEYS.userProfilePicture]: user.profilePictureUrl ?? '',
  };
  if (user.id) entries[KEYS.userId] = user.id;
  if (user.phone) entries[KEYS.userPhone] = user.phone;
  if (user.premium !== undefined) entries[KEYS.userPremium] = String(user.premium);

  await AsyncStorage.setMany(entries);
}

/** Returns null if any token field is missing (not logged in). */
export async function getTokens(): Promise<AuthToken | null> {
  const map = await AsyncStorage.getMany([
    KEYS.accessToken,
    KEYS.refreshToken,
    KEYS.expiresAt,
  ]);

  const accessToken = map[KEYS.accessToken];
  const refreshToken = map[KEYS.refreshToken];
  const expiresAt = map[KEYS.expiresAt];

  if (!accessToken || !refreshToken || !expiresAt) return null;

  return { accessToken, refreshToken, expiresAt };
}

export async function getStoredUser(): Promise<User | null> {
  const map = await AsyncStorage.getMany([
    KEYS.userId,
    KEYS.userName,
    KEYS.userEmail,
    KEYS.userPhone,
    KEYS.userPremium,
    KEYS.userProfilePicture,
  ]);

  const name = map[KEYS.userName];
  const email = map[KEYS.userEmail];
  if (!name || !email) return null;

  return {
    id: map[KEYS.userId] ?? undefined,
    name,
    email,
    phone: map[KEYS.userPhone] ?? undefined,
    premium: map[KEYS.userPremium] ? map[KEYS.userPremium] === 'true' : undefined,
    profilePictureUrl: map[KEYS.userProfilePicture] ?? undefined,
  };
}

/** Convenience: is there a valid session stored? */
export async function hasSession(): Promise<boolean> {
  return (await getTokens()) !== null;
}

export async function clearAuthStorage(): Promise<void> {
  await AsyncStorage.removeMany(Object.values(KEYS));
}