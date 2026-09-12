import { create } from 'zustand';
import { User, AuthToken } from './authModels';
import { saveTokens, saveUserInfo, clearAuthStorage } from '../storage/tokenStorage';
import { restoreSession } from './session';


type AuthStatus = 'hydrating' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  hydrate: () => Promise<void>;
  setSession: (user: User, token: AuthToken) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'hydrating',
  user: null,

  /** Call once on app start (splash screen equivalent) to restore a session. */
  hydrate: async () => {
    const user = await restoreSession();
    set({
      status: user ? 'authenticated' : 'unauthenticated',
      user,
    });
  },

  /** Call after a successful login/register/google-sign-in API response. */
  setSession: async (user: User, token: AuthToken) => {
    await saveTokens(token);
    await saveUserInfo(user);
    set({ status: 'authenticated', user });
  },

  logout: async () => {
    await clearAuthStorage();
    set({ status: 'unauthenticated', user: null });
  },
}));