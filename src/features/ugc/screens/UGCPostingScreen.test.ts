import { validateUGCLink } from './UGCPostingScreen';

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

  it('rejects invalid or non-supported platform URLs', () => {
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
    });
  });
});
