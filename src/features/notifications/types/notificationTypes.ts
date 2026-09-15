export type NotificationType = 'travel_news' | 'itinerary_update' | 'destination_alert' | 'system';

export interface TravelNewsContent {
  headline: string;
  fullArticle: string;
  source: string;
  publishedAt: string; // ISO date or display string
  urgency?: 'normal' | 'advisory' | 'important';
  affectedPlaces?: string[];
  actionUrl?: string;
  keyTakeaways?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO string e.g. '2026-09-14T10:00:00Z'
  type: NotificationType;
  destination?: string; // e.g. 'Paris, France'
  tripId?: string;
  isRead: boolean;
  newsContent?: TravelNewsContent;
}

export type NotificationFilterType = 'all' | 'travel_news' | 'itinerary';
