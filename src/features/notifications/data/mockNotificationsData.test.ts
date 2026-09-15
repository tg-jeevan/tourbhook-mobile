import {
  RAW_MOCK_NOTIFICATIONS,
  getActiveNotifications,
} from './mockNotificationsData';

describe('Notifications & Travel News (SCRUM-34)', () => {
  it('should include notifications with age <= 365 days', () => {
    const active = getActiveNotifications();
    const recentNotif = active.find((n) => n.id === 'notif-1');
    expect(recentNotif).toBeDefined();
    expect(recentNotif?.newsContent?.headline).toContain('Louvre');
  });

  it('should enforce 365-day retention rule and EXCLUDE items older than 365 days', () => {
    // RAW data contains an expired notification (> 400 days old)
    const expiredInRaw = RAW_MOCK_NOTIFICATIONS.find(
      (n) => n.id === 'notif-expired-1'
    );
    expect(expiredInRaw).toBeDefined();

    // Active notifications must NOT contain expired notification
    const active = getActiveNotifications();
    const expiredInActive = active.find((n) => n.id === 'notif-expired-1');
    expect(expiredInActive).toBeUndefined();

    // Verify all active items are within 365 days
    const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    active.forEach((n) => {
      const ageMs = now - new Date(n.timestamp).getTime();
      expect(ageMs).toBeLessThanOrEqual(ONE_YEAR_MS);
    });
  });

  it('travel news notifications should have readable news content structure', () => {
    const active = getActiveNotifications();
    const travelNewsItems = active.filter((n) => n.type === 'travel_news');
    expect(travelNewsItems.length).toBeGreaterThan(0);

    travelNewsItems.forEach((n) => {
      if (n.newsContent) {
        expect(n.newsContent.headline).toBeTruthy();
        expect(n.newsContent.fullArticle).toBeTruthy();
        expect(n.newsContent.source).toBeTruthy();
        expect(n.newsContent.publishedAt).toBeTruthy();
      }
    });
  });
});
