export type EventCategory = 'Culture' | 'Music' | 'Festival' | 'Food & Drink' | 'Sports' | 'Art' | 'Nightlife';

export interface EventItem {
  id: string;
  title: string;
  destination: string; // e.g., 'Paris, France', 'Tokyo, Japan', 'Bali, Indonesia'
  destinationId: string; // 'paris', 'tokyo', 'bali'
  location: string; // venue or neighborhood, e.g. 'Champ de Mars', 'Shinjuku', 'Ubud'
  date: string; // ISO date format YYYY-MM-DD
  time: string; // e.g. '19:30', '10:00 AM'
  category: EventCategory;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  price?: string; // e.g., '€25', 'Free Admission', '¥3,000'
  venueAddress?: string;
  organizer?: string;
  isPopular?: boolean;
}

export type DateFilterOption = 'all' | 'today' | 'this_week' | 'this_month';

export interface EventFilterState {
  dateFilter: DateFilterOption;
  locationFilter: string; // 'all' or specific location
  categoryFilter: string; // 'all' or specific category
  searchQuery: string;
}
