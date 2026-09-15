import { InstagramProfile, InstagramConnectionState } from '../types/ugcTypes';

// Initial default state (Not Connected)
let currentConnectionState: InstagramConnectionState = {
  isConnected: false,
  profile: null,
  lastSyncedAt: null,
  error: null,
};

// Mock connected profile for development/testing adapter
export const MOCK_CONNECTED_INSTAGRAM_PROFILE: InstagramProfile = {
  id: 'ig_984128491',
  username: 'wanderlust_mani',
  fullName: 'Mani | Travel Explorer',
  profilePicUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  connectedAt: '2026-09-15',
  reelsCount: 14,
  isVerified: true,
  bio: 'Exploring hidden cafes, scenic sunset points, and local gems across Europe & Asia ✈️🌍',
};

/**
 * Service interface for Instagram connection.
 * NOTE: Production implementation will exchange authorization code with backend OAuth endpoint.
 * This adapter handles the state machine cleanly for RN client requirements.
 */
export const InstagramService = {
  getConnectionState: (): InstagramConnectionState => {
    return { ...currentConnectionState };
  },

  /**
   * Initiates Instagram OAuth flow.
   * Simulates authentication handshake.
   */
  connectInstagram: async (): Promise<InstagramConnectionState> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(() => resolve(undefined), 800));

    currentConnectionState = {
      isConnected: true,
      profile: { ...MOCK_CONNECTED_INSTAGRAM_PROFILE },
      lastSyncedAt: new Date().toISOString(),
      error: null,
    };

    return { ...currentConnectionState };
  },

  /**
   * Disconnects linked Instagram profile.
   */
  disconnectInstagram: async (): Promise<InstagramConnectionState> => {
    await new Promise((resolve) => setTimeout(() => resolve(undefined), 400));

    currentConnectionState = {
      isConnected: false,
      profile: null,
      lastSyncedAt: null,
      error: null,
    };

    return { ...currentConnectionState };
  },

  /**
   * Fetches user's synced approved reels
   */
  fetchUserSyncedReels: async (): Promise<any[]> => {
    if (!currentConnectionState.isConnected) {
      return [];
    }
    // Return sample synced items
    return [
      {
        id: 'user-synced-1',
        destination: 'Paris, France',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/C3_ParisSunset',
        title: 'Top 5 Hidden Spots Near Eiffel Tower ✨',
        creatorHandle: '@wanderlust_mani',
        thumbnailUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
        status: 'approved',
        createdAt: '2026-09-15',
      },
    ];
  },

  /**
   * Sets custom error state for testing error handling.
   */
  simulateConnectionError: (errorMsg: string): InstagramConnectionState => {
    currentConnectionState = {
      isConnected: false,
      profile: null,
      lastSyncedAt: null,
      error: errorMsg,
    };
    return { ...currentConnectionState };
  },
};

export const instagramService = InstagramService;
export default InstagramService;
