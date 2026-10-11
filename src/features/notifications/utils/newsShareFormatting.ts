/**
 * Helper utilities for formatting shared Travel News & Updates messages.
 */

export const TRAVEL_NEWS_DOWNLOAD_CTA =
  'Download the Tour Bhook app for more travel updates!\n\nApp download link coming soon.';

export interface TravelNewsShareInput {
  headline: string;
  fullArticle: string;
}

/**
 * Builds the complete shareable text message for a travel news item.
 * Preserves the headline, full article content, and attribution,
 * and appends the app download call to action separated by a blank line.
 */
export function buildTravelNewsShareMessage(news: TravelNewsShareInput): string {
  return `${news.headline}\n\n${news.fullArticle}\n\nVia Tourbhook Travel Notifications\n\n${TRAVEL_NEWS_DOWNLOAD_CTA}`;
}
