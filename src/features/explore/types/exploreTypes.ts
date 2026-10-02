import { UGCItem } from '../../ugc/types/ugcTypes';
import { TravelGroup } from '../../groups/types/groupTypes';

export type ExploreCategory = 'All' | 'Adventure' | 'Culture' | 'Food' | 'Beach' | 'Nature';

export interface PlaceItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  shortDesc: string;
  imageUri: string;
}

export interface DestinationItem {
  id: string;
  name: string;
  country: string;
  reelsCountText: string;
  imageUri: string;
  category: 'adventure' | 'culture' | 'food' | 'beach' | 'nature';
  description: string;
  bestSeason: string;
  vibe: string;
  rating: number;
  reviewsCount: number;
  popularPlaces: PlaceItem[];
}

export interface SearchResultItem {
  type: 'destination' | 'place' | 'reel' | 'group';
  id: string;
  title: string;
  subtitle: string;
  category?: string;
  imageUri?: string;
  payload?: any;
}
