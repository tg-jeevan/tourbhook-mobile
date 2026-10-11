import {
  RAW_MOCK_NOTIFICATIONS,
  getActiveNotifications,
} from './mockNotificationsData';
import { notificationStore } from './notificationStore';

describe('Notifications & Travel News (SCRUM-34)', () => {
  beforeEach(() => {
    notificationStore.resetToInitial();
  });

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

  it('markAllAsRead should mark all items as read and reset unreadCount to 0 while keeping history', () => {
    // Initial unread items exist
    expect(notificationStore.getUnreadCount()).toBeGreaterThan(0);
    const initialCount = notificationStore.getNotifications().length;

    // Trigger Mark All as Read
    notificationStore.markAllAsRead();

    // Unread count is now 0
    expect(notificationStore.getUnreadCount()).toBe(0);

    // All notifications still exist in 365-day history
    const after = notificationStore.getNotifications();
    expect(after.length).toBe(initialCount);
    after.forEach((item) => {
      expect(item.isRead).toBe(true);
    });
  });

  it('adding a new notification increases unread count accordingly without affecting existing read items', () => {
    notificationStore.markAllAsRead();
    expect(notificationStore.getUnreadCount()).toBe(0);

    notificationStore.addNotification({
      id: 'notif-new-1',
      title: 'New Flight Deal to Rome',
      message: 'Exclusive 20% discount on flights departing next month.',
      timestamp: new Date().toISOString(),
      type: 'travel_news',
      destination: 'Rome, Italy',
      isRead: false,
    });

    expect(notificationStore.getUnreadCount()).toBe(1);
    const notifs = notificationStore.getNotifications();
    const newNotif = notifs.find((n) => n.id === 'notif-new-1');
    expect(newNotif?.isRead).toBe(false);
  });

  it('travel tips notifications should have valid title, message, and destination', () => {
    const active = getActiveNotifications();
    const travelTips = active.filter((n) => n.type === 'travel_tip');
    expect(travelTips.length).toBeGreaterThan(0);

    const packSmartTip = travelTips.find((n) => n.title.includes('Pack Smart'));
    expect(packSmartTip).toBeDefined();
    expect(packSmartTip?.type).toBe('travel_tip');
    expect(packSmartTip?.destination).toBe('Paris, France');
    expect(packSmartTip?.message).toContain('walking shoes');
  });

  it('category filtering should isolate travel_tips, itinerary, and travel_news properly', () => {
    const active = getActiveNotifications();

    // Travel Tips filter returns only travel_tip
    const travelTipsOnly = active.filter((item) => item.type === 'travel_tip');
    expect(travelTipsOnly.length).toBeGreaterThan(0);
    travelTipsOnly.forEach((item) => {
      expect(item.type).toBe('travel_tip');
      expect(item.type).not.toBe('itinerary_update');
      expect(item.type).not.toBe('travel_news');
      expect(item.type).not.toBe('destination_alert');
    });

    // Itinerary filter returns only itinerary_update and excludes travel_tip
    const itineraryOnly = active.filter((item) => item.type === 'itinerary_update');
    expect(itineraryOnly.length).toBeGreaterThan(0);
    itineraryOnly.forEach((item) => {
      expect(item.type).toBe('itinerary_update');
      expect(item.type).not.toBe('travel_tip');
    });

    // All filter includes all categories
    const allCount = active.length;
    expect(allCount).toBe(
      travelTipsOnly.length +
        itineraryOnly.length +
        active.filter((i) => i.type === 'travel_news' || i.type === 'destination_alert').length
    );
  });
});


