import { validateUGCLink } from './UGCPostingScreen';
import {
  matchDestination,
  submitReelCandidate,
  analyzeVideoUrl,
} from '../services/ugcService';
import { filterApprovedDestinationReels, MOCK_UGC_ITEMS } from '../data/mockUGCData';

describe('UGC Reel/Short Submission & Destination Discovery Flow', () => {
  describe('validateUGCLink URL validation', () => {
    it('returns invalid for empty or whitespace strings', () => {
      expect(validateUGCLink('').isValid).toBe(false);
      expect(validateUGCLink('   ').isValid).toBe(false);
    });

    it('validates various Instagram Reel and post URLs correctly', () => {
      const validInstagramUrls = [
        'https://www.instagram.com/reel/C3_ParisSunset/',
        'https://instagram.com/reel/C29abCD123',
        'https://www.instagram.com/reels/DF123456789',
        'https://instagr.am/p/C99123456',
        'http://www.instagram.com/reel/xyz123',
        'instagram.com/reel/abc_123-xyz',
      ];

      validInstagramUrls.forEach((url) => {
        const result = validateUGCLink(url);
        expect(result.isValid).toBe(true);
        expect(result.platform).toBe('instagram');
      });
    });

    it('validates various YouTube Shorts and video URLs correctly', () => {
      const validYouTubeUrls = [
        'https://www.youtube.com/shorts/ParisFoodGuide2026',
        'https://youtube.com/shorts/dQw4w9WgXcQ',
        'https://m.youtube.com/shorts/abc123xyz',
        'https://youtu.be/dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ];

      validYouTubeUrls.forEach((url) => {
        const result = validateUGCLink(url);
        expect(result.isValid).toBe(true);
        expect(result.platform).toBe('youtube');
      });
    });

    it('rejects invalid or non-supported platform URLs with descriptive message', () => {
      const invalidUrls = [
        'https://www.tiktok.com/@user/video/1234567890',
        'https://facebook.com/watch?v=12345',
        'https://google.com',
        'not-a-valid-url',
        'https://twitter.com/travel/status/12345',
      ];

      invalidUrls.forEach((url) => {
        const result = validateUGCLink(url);
        expect(result.isValid).toBe(false);
        expect(result.platform).toBeNull();
        expect(result.error).toBeDefined();
        expect(result.error).toContain('valid Instagram Reel or YouTube Shorts URL');
      });
    });
  });

  describe('Destination Matching Logic (ugcService)', () => {
    it('matches an existing catalog destination correctly', () => {
      const result = matchDestination('Paris, France');
      expect(result.status).toBe('exact_match');
      expect(result.destinationId).toBeDefined();
      expect(result.destinationName).toContain('Paris');
    });

    it('identifies a new destination candidate when place is not in catalog', () => {
      const result = matchDestination('Faroe Islands');
      expect(result.status).toBe('candidate_new');
      expect(result.destinationId).toBeUndefined();
    });

    it('flags ambiguous or unknown location queries', () => {
      const ambiguous1 = matchDestination('Unknown Beach');
      expect(ambiguous1.status).toBe('ambiguous');

      const ambiguous2 = matchDestination('ab');
      expect(ambiguous2.status).toBe('ambiguous');
    });
  });

  describe('AI Analysis Service Boundary (ugcService)', () => {
    it('infers destination and travel insights from URL', async () => {
      const result = await analyzeVideoUrl(
        'https://www.instagram.com/reel/C3_ParisSunset',
        'instagram'
      );
      expect(result.url).toBe('https://www.instagram.com/reel/C3_ParisSunset');
      expect(result.platform).toBe('instagram');
      expect(result.detectedDestination).toBeDefined();
      expect(result.locationConfidence).toBeGreaterThan(0.5);
      expect(result.travelInsights.length).toBeGreaterThan(0);
      expect(result.isBackendConnected).toBe(false); // Declared honestly as mock boundary
    });

    it('infers new destination candidate from Faroe URL', async () => {
      const result = await analyzeVideoUrl(
        'https://www.instagram.com/reel/FaroeIslandsCliff',
        'instagram'
      );
      expect(result.detectedDestination).toContain('Faroe Islands');
      expect(result.matchStatus).toBe('candidate_new');
    });
  });

  describe('Zero-Tolerance Content Safety & Moderation Filtering', () => {
    it('never includes pending submissions in destination approved list', () => {
      const approvedReels = filterApprovedDestinationReels('Paris, France');
      const hasPending = approvedReels.some((item) => item.status === 'pending');
      expect(hasPending).toBe(false);
    });

    it('never includes rejected submissions in destination approved list', () => {
      const approvedReels = filterApprovedDestinationReels('Paris, France');
      const hasRejected = approvedReels.some((item) => item.status === 'rejected');
      expect(hasRejected).toBe(false);
    });

    it('only returns items with status === "approved"', () => {
      const allApproved = filterApprovedDestinationReels();
      expect(allApproved.length).toBeGreaterThan(0);
      allApproved.forEach((item) => {
        expect(item.status).toBe('approved');
      });
    });

    it('submitting a new reel stores it as pending and excludes it from public view', async () => {
      const countApprovedBefore = filterApprovedDestinationReels('Paris, France').length;

      const submission = await submitReelCandidate({
        url: 'https://www.instagram.com/reel/NewTestReelParis',
        platform: 'instagram',
        title: 'New Hidden Gem in Montmartre',
        creatorHandle: '@test_creator',
        thumbnailUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
        destination: 'Paris, France',
        destinationId: 'dest-paris',
        isNewDestinationCandidate: false,
      });

      expect(submission.success).toBe(true);
      expect(submission.status).toBe('pending');
      expect(submission.submissionId).toBeDefined();

      // Zero-tolerance verification: The new reel must NOT appear in approved list
      const countApprovedAfter = filterApprovedDestinationReels('Paris, France').length;
      expect(countApprovedAfter).toBe(countApprovedBefore);
    });
  });
});
