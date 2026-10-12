import { getMockItineraryDays } from './itineraryPackingTypes';

describe('getMockItineraryDays', () => {
  it('generates an inclusive same-month date range', () => {
    const days = getMockItineraryDays('2026-10-11', '2026-10-13');

    expect(days.map(day => [day.dayLabel, day.dateLabel])).toEqual([
      ['Day 1', 'Oct 11'],
      ['Day 2', 'Oct 12'],
      ['Day 3', 'Oct 13'],
    ]);
  });

  it('retains the matching mock activity templates for shorter trips', () => {
    const days = getMockItineraryDays('2026-10-11', '2026-10-12');

    expect(days).toHaveLength(2);
    expect(days[0].items[0].id).toBe('d1-1');
    expect(days[1].items[0].id).toBe('d2-1');
  });

  it('generates dates across month boundaries', () => {
    const days = getMockItineraryDays('2026-09-30', '2026-10-02');

    expect(days.map(day => day.dateLabel)).toEqual([
      'Sep 30',
      'Oct 1',
      'Oct 2',
    ]);
  });

  it('generates dates across year boundaries', () => {
    const days = getMockItineraryDays('2026-12-31', '2027-01-02');

    expect(days.map(day => day.dateLabel)).toEqual([
      'Dec 31',
      'Jan 1',
      'Jan 2',
    ]);
  });

  it.each([
    [undefined, undefined],
    ['not-a-date', '2026-10-13'],
    ['2026-10-13', '2026-10-11'],
    ['2026-01-01', '2062-01-01'],
  ])('falls back safely for an invalid range', (startDate, endDate) => {
    const days = getMockItineraryDays(startDate, endDate);

    expect(days).toHaveLength(4);
    expect(days[0].dateLabel).toBe('Sep 12');
    expect(days[3].dateLabel).toBe('Sep 15');
  });

  it('creates empty days when a trip exceeds the available mock templates', () => {
    const days = getMockItineraryDays('2026-09-12', '2026-09-17');

    expect(days).toHaveLength(6);
    expect(days[3].items).not.toHaveLength(0);
    expect(days[4].items).toEqual([]);
    expect(days[5].items).toEqual([]);
  });
});
