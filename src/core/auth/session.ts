import { getTokens, getStoredUser } from '../storage/tokenStorage';
import { isTokenExpired, User } from './authModels';
import { refreshAccessToken } from '../api/apiClient';

export async function restoreSession(): Promise<User | null> {
  const token = await getTokens();
  if (!token) return null;

  if (isTokenExpired(token)) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) return null;
  }

  const user = await getStoredUser();
  return user;
}

export async function getValidAccessToken(): Promise<string | null> {
  const token = await getTokens();
  if (!token) return null;

  if (isTokenExpired(token)) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) return null;
  }

  const latest = await getTokens();
  return latest?.accessToken ?? null;
}