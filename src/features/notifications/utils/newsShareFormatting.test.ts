import {
  buildTravelNewsShareMessage,
  TRAVEL_NEWS_DOWNLOAD_CTA,
} from './newsShareFormatting';

describe('newsShareFormatting', () => {
  const sampleNews = {
    headline: 'Temporary Navigation Route Adjustments on the Seine River',
    fullArticle:
      'The Department of Paris Waterways has issued a brief advisory regarding standard maintenance work on Pont Alexandre III piers. River cruise departures from Pont Neuf will operate on normal timetables with a scenic detour through the southern channel.\n\nPassengers will enjoy unrestricted views of Grand Palais and the Eiffel Tower. No cancellations are expected for scheduled sightseeing cruises.',
  };

  it('builds share message containing headline, article, attribution, and download CTA', () => {
    const message = buildTravelNewsShareMessage(sampleNews);

    expect(message).toContain(sampleNews.headline);
    expect(message).toContain(sampleNews.fullArticle);
    expect(message).toContain('Via Tourbhook Travel Notifications');
    expect(message).toContain(
      'Download the Tour Bhook app for more travel updates!\n\nApp download link coming soon.'
    );
  });

  it('appends download CTA separated by a blank line after travel notification attribution', () => {
    const message = buildTravelNewsShareMessage(sampleNews);

    const expectedSuffix =
      'Via Tourbhook Travel Notifications\n\nDownload the Tour Bhook app for more travel updates!\n\nApp download link coming soon.';
    expect(message.endsWith(expectedSuffix)).toBe(true);
  });

  it('appends the download CTA exactly once', () => {
    const message = buildTravelNewsShareMessage(sampleNews);

    const occurrences = message.split(
      'Download the Tour Bhook app for more travel updates!'
    ).length - 1;
    expect(occurrences).toBe(1);

    const linkOccurrences = message.split(
      'App download link coming soon.'
    ).length - 1;
    expect(linkOccurrences).toBe(1);
  });

  it('works across different travel news items', () => {
    const anotherNews = {
      headline: 'Tokyo Metro Spring Schedule Updates',
      fullArticle:
        'JR East and Tokyo Metro have announced extended weekend train schedules for cherry blossom season across Ueno and Shinjuku stations.',
    };

    const message = buildTravelNewsShareMessage(anotherNews);
    expect(message.startsWith(anotherNews.headline)).toBe(true);
    expect(message).toContain(anotherNews.fullArticle);
    expect(message).toContain('Via Tourbhook Travel Notifications');
    expect(message).toContain(TRAVEL_NEWS_DOWNLOAD_CTA);
  });

  it('does not contain any fake or placeholder URLs', () => {
    const message = buildTravelNewsShareMessage(sampleNews);
    expect(message).not.toMatch(/https?:\/\//i);
    expect(message).not.toMatch(/play\.google\.com/i);
    expect(message).not.toMatch(/apps\.apple\.com/i);
  });
});
