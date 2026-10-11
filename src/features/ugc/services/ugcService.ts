import { MOCK_DESTINATIONS } from '../../explore/data/mockExploreData';
import { UGCPlatform, UGCItem } from '../types/ugcTypes';
import { MOCK_UGC_ITEMS } from '../data/mockUGCData';

export type DestinationMatchStatus = 'exact_match' | 'candidate_new' | 'ambiguous';

export interface VideoAnalysisResult {
  url: string;
  platform: UGCPlatform;
  title: string;
  creatorHandle: string;
  creatorAvatar?: string;
  thumbnailUrl: string;
  duration?: string;
  detectedDestination: string;
  city?: string;
  country?: string;
  locationConfidence: number; // 0.0 - 1.0 (e.g. 0.96)
  matchStatus: DestinationMatchStatus;
  matchingDestinationId?: string;
  matchingDestinationName?: string;
  summary: string;
  travelInsights: string[];
  detectedPlaces: string[];
  vibeTags: string[];
  bestTimeToVisit?: string;
  isBackendConnected: boolean; // false = client-side mock/demo boundary
}

export interface SubmissionCandidateRequest {
  url: string;
  platform: UGCPlatform;
  title: string;
  creatorHandle: string;
  thumbnailUrl: string;
  destination: string;
  destinationId?: string;
  isNewDestinationCandidate: boolean;
  notes?: string;
}

export interface SubmissionResponse {
  success: boolean;
  submissionId: string;
  status: 'pending';
  message: string;
  destination: string;
  isNewCandidate: boolean;
  isBackendConnected: boolean;
}

/**
 * Checks whether an inferred destination matches an existing destination in Tourbhook.
 */
export function matchDestination(destinationName: string): {
  status: DestinationMatchStatus;
  destinationId?: string;
  destinationName?: string;
} {
  const query = destinationName.toLowerCase().trim();

  // Low confidence / ambiguous check
  if (query.includes('unknown') || query.includes('ambiguous') || query.length < 3) {
    return { status: 'ambiguous' };
  }

  // Exact or partial match with existing verified destinations
  const matched = MOCK_DESTINATIONS.find((dest) => {
    const dName = dest.name.toLowerCase();
    const dCountry = dest.country.toLowerCase();
    return (
      query.includes(dName) ||
      dName.includes(query) ||
      query.includes(dCountry) ||
      `${dName}, ${dCountry}`.includes(query)
    );
  });

  if (matched) {
    return {
      status: 'exact_match',
      destinationId: matched.id,
      destinationName: `${matched.name}, ${matched.country}`,
    };
  }

  // Not found in catalog -> create candidate
  return {
    status: 'candidate_new',
  };
}

/**
 * AI Video Analysis Service
 * In production: calls backend POST /api/v1/ugc/analyze-video with the URL.
 * In development: simulates intelligent inference using supported sample fixtures.
 */
export async function analyzeVideoUrl(
  url: string,
  platform: UGCPlatform
): Promise<VideoAnalysisResult> {
  const lowerUrl = url.toLowerCase();

  // Simulate network latency for backend analysis
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 1200));

  // Determine scenario based on URL patterns for testing/demo
  if (lowerUrl.includes('faroe') || lowerUrl.includes('newdest')) {
    // Scenario 2: Potentially new destination not yet in Tourbhook catalog
    const match = matchDestination('Faroe Islands');
    return {
      url,
      platform,
      title: 'Hiking to the Edge of the World 🌊',
      creatorHandle: '@nordic_wanderer',
      creatorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
      duration: '0:42',
      detectedDestination: 'Faroe Islands',
      city: 'Tórshavn',
      country: 'Faroe Islands',
      locationConfidence: 0.94,
      matchStatus: match.status,
      matchingDestinationId: match.destinationId,
      matchingDestinationName: match.destinationName,
      summary:
        'Cliffside hiking trails overlooking dramatic North Atlantic seascapes and emerald valleys.',
      travelInsights: [
        'Pack waterproof boots and windbreakers.',
        'Summer daylight lasts over 19 hours.',
      ],
      detectedPlaces: ['Kallur Lighthouse', 'Trælanípa Cliff'],
      vibeTags: ['Adventure', 'Nature', 'Dramatic', 'Nordic'],
      bestTimeToVisit: 'June – August',
      isBackendConnected: false,
    };
  }

  if (lowerUrl.includes('ambiguous') || lowerUrl.includes('unknown') || lowerUrl.includes('beach')) {
    // Scenario 3: Multiple possible matches or low confidence
    const match = matchDestination('unknown beach');
    return {
      url,
      platform,
      title: 'Tropical Sunset Bliss 🌅',
      creatorHandle: '@beach_vibes',
      creatorAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      duration: '0:35',
      detectedDestination: 'Tropical Beach (Multiple Matches)',
      locationConfidence: 0.58,
      matchStatus: 'ambiguous',
      summary:
        'Sunset silhouette shots on palm-lined white sand coast. Visual landmark confidence is low.',
      travelInsights: ['Location could be Bali, Phuket, or Goa.'],
      detectedPlaces: ['Beachfront Palm Trees'],
      vibeTags: ['Sunset', 'Beach', 'Relaxing'],
      bestTimeToVisit: 'Dry Season (Nov – Apr)',
      isBackendConnected: false,
    };
  }

  if (lowerUrl.includes('bali') || lowerUrl.includes('waterfall') || lowerUrl.includes('ubud')) {
    // Scenario 1B: Matches Bali, Indonesia
    const match = matchDestination('Bali, Indonesia');
    return {
      url,
      platform,
      title: 'Hidden Waterfall Oasis in Ubud 🌿💦',
      creatorHandle: '@island_explorer',
      creatorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
      duration: '0:50',
      detectedDestination: 'Bali, Indonesia',
      city: 'Ubud',
      country: 'Indonesia',
      locationConfidence: 0.98,
      matchStatus: match.status,
      matchingDestinationId: match.destinationId,
      matchingDestinationName: match.destinationName,
      summary:
        'Secluded jungle cascades with emerald swimming pools located 20 minutes outside central Ubud.',
      travelInsights: [
        'Arrive before 9 AM to avoid crowds.',
        'Slippery stairs; sturdy sandals recommended.',
      ],
      detectedPlaces: ['Tegenungan Waterfall', 'Ubud Monkey Forest'],
      vibeTags: ['Waterfalls', 'Jungle', 'Nature', 'Spiritual'],
      bestTimeToVisit: '08:00 – 10:30',
      isBackendConnected: false,
    };
  }

  // Default: Paris, France (Scenario 1A: Existing destination found)
  const match = matchDestination('Paris, France');
  return {
    url,
    platform,
    title: 'Top 5 Hidden Spots Near Eiffel Tower ✨',
    creatorHandle: '@wanderlust_claire',
    creatorAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    duration: '0:45',
    detectedDestination: 'Paris, France',
    city: 'Paris',
    country: 'France',
    locationConfidence: 0.99,
    matchStatus: match.status,
    matchingDestinationId: match.destinationId,
    matchingDestinationName: match.destinationName,
    summary:
      'Scenic photography viewpoints around Trocadéro and Bir-Hakeim bridge during golden hour.',
    travelInsights: [
      'Golden hour lighting is best around 7 PM.',
      'Metro Line 6 offers elevated views.',
    ],
    detectedPlaces: ['Pont de Bir-Hakeim', 'Trocadéro'],
    vibeTags: ['Scenic', 'Golden Hour', 'Photo Spots', 'Romantic'],
    bestTimeToVisit: '18:30 – 20:00 (Sunset)',
    isBackendConnected: false,
  };
}

/**
 * Submits the Reel / Short candidate for moderation review.
 * Under ZERO-TOLERANCE moderation rules, submissions are saved with status 'pending'
 * and will NEVER be surfaced to ordinary users until approved by the review team.
 */
export async function submitReelCandidate(
  data: SubmissionCandidateRequest
): Promise<SubmissionResponse> {
  // Simulate network latency for backend submission
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 800));

  const submissionId = `ugc-sub-${Date.now()}`;

  // Add into local mock store with STRICT status 'pending'
  const newUGCItem: UGCItem = {
    id: submissionId,
    destination: data.destination,
    platform: data.platform,
    url: data.url,
    title: data.title,
    creatorHandle: data.creatorHandle,
    thumbnailUrl: data.thumbnailUrl,
    status: 'pending', // ZERO TOLERANCE: Stored as pending!
    createdAt: new Date().toISOString().split('T')[0],
  };

  MOCK_UGC_ITEMS.unshift(newUGCItem);

  return {
    success: true,
    submissionId,
    status: 'pending',
    message: 'Your travel Reel has been submitted for review.',
    destination: data.destination,
    isNewCandidate: data.isNewDestinationCandidate,
    isBackendConnected: false,
  };
}
