import { getEventsForDestination, MOCK_EVENTS } from './mockEventsData';

describe('Events Feed & Filtering Logic', () => {
  it('should return all events when no destination is provided', () => {
    const events = getEventsForDestination();
    expect(events.length).toBe(MOCK_EVENTS.length);
  });

  it('should filter events specifically for Paris', () => {
    const parisEvents = getEventsForDestination('paris');
    expect(parisEvents.length).toBeGreaterThan(0);
    parisEvents.forEach((evt) => {
      expect(evt.destinationId.toLowerCase()).toContain('paris');
    });
  });

  it('should filter events specifically for Tokyo', () => {
    const tokyoEvents = getEventsForDestination('tokyo');
    expect(tokyoEvents.length).toBeGreaterThan(0);
    tokyoEvents.forEach((evt) => {
      expect(evt.destinationId.toLowerCase()).toContain('tokyo');
    });
  });

  it('should filter events specifically for Bali', () => {
    const baliEvents = getEventsForDestination('bali');
    expect(baliEvents.length).toBeGreaterThan(0);
    baliEvents.forEach((evt) => {
      expect(evt.destinationId.toLowerCase()).toContain('bali');
    });
  });

  it('should return empty list for destination with no scheduled events', () => {
    const emptyEvents = getEventsForDestination('kyoto');
    expect(emptyEvents).toEqual([]);
  });

  it('each event should have necessary fields for UI rendering', () => {
    MOCK_EVENTS.forEach((evt) => {
      expect(evt.id).toBeDefined();
      expect(evt.title).toBeDefined();
      expect(evt.destination).toBeDefined();
      expect(evt.location).toBeDefined();
      expect(evt.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(evt.time).toBeDefined();
      expect(evt.category).toBeDefined();
      expect(evt.shortDescription).toBeDefined();
      expect(evt.imageUrl).toBeDefined();
    });
  });
});
