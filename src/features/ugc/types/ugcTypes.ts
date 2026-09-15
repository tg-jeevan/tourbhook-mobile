export type UGCStatus = 'approved' | 'pending' | 'rejected';
export type UGCPlatform = 'instagram' | 'youtube';

export interface ReelAIAnalysis {
  summary?: string;
  vibeTags?: string[];
  detectedPlace?: string;
  bestTimeToVisit?: string;
  moderationScore?: number; // 0.0 - 1.0 (internal confidence)
}

export interface UGCItem {
  id: string;
  destination: string; // e.g. 'Paris, France', 'Eiffel Tower', 'Bali, Indonesia', 'Tokyo, Japan'
  platform: UGCPlatform;
  url: string;
  title: string;
  creatorHandle: string;
  creatorAvatar?: string;
  thumbnailUrl: string;
  status: UGCStatus; // ZERO TOLERANCE: ONLY 'approved' IS DISPLAYED
  createdAt: string;
  likesCount?: number;
  viewsCount?: number;
  duration?: string; // e.g. '0:45'
  aiAnalysis?: ReelAIAnalysis;
}

export interface InstagramProfile {
  id: string;
  username: string;
  fullName: string;
  profilePicUrl: string;
  connectedAt: string;
  reelsCount: number;
  isVerified: boolean;
  bio?: string;
}

export interface InstagramConnectionState {
  isConnected: boolean;
  profile: InstagramProfile | null;
  lastSyncedAt: string | null;
  error?: string | null;
}

export interface UGCContentDisplayProps {
  destination: string;
  tripId?: string;
  placeId?: string;
  onPostClick?: () => void;
}
