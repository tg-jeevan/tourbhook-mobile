import React, { createContext, useContext, useState, useEffect } from 'react';
import { restoreSession } from './session';
import { clearAuthStorage } from '../storage/tokenStorage';

export interface User {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  premium?: boolean;
  profilePictureUrl?: string;
  level?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: User | null;
  loginWithMock: () => void;
  logout: () => Promise<void>;
  initializeSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Minimum splash duration in milliseconds (1.5 seconds) to ensure branded visual display */
const MINIMUM_SPLASH_DURATION_MS = 1500;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const initializeSession = async () => {
    try {
      const minDurationPromise = new Promise<void>(resolve => {
        setTimeout(() => resolve(), MINIMUM_SPLASH_DURATION_MS);
      });

      const sessionPromise = restoreSession();

      const [, storedUser] = await Promise.all([
        minDurationPromise,
        sessionPromise.catch(() => null),
      ]);

      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    initializeSession();
  }, []);

  const loginWithMock = () => {
    setUser({
      id: 'mock-user-001',
      name: 'Mani Test',
      email: 'mani.test@example.com',
    });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await clearAuthStorage();
    } catch {
      // Ignored
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitializing,
        user,
        loginWithMock,
        logout,
        initializeSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
