export type TimelineItemType = 'activity' | 'break';

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  time: string;
  title: string;
  subtitle: string;
  /** Emoji used as a stand-in thumbnail — see note in the screen file about real place photos. */
  thumbnailEmoji: string;
  /** Only present for breaks. */
  durationMinutes?: number;
}

export interface ItineraryDay {
  id: string;
  dayLabel: string;
  dateLabel: string;
  items: TimelineItem[];
}

export function getMockItineraryDays(): ItineraryDay[] {
  return [
    {
      id: 'day-1',
      dayLabel: 'Day 1',
      dateLabel: 'Sep 12',
      items: [
        {
          id: 'd1-1',
          type: 'activity',
          time: '09:00 AM',
          title: 'Ubud Monkey Forest',
          subtitle: 'Explore the sacred forest',
          thumbnailEmoji: '🐒',
        },
        {
          id: 'd1-2',
          type: 'activity',
          time: '12:00 PM',
          title: 'Local Lunch',
          subtitle: 'Try authentic Balinese cuisine',
          thumbnailEmoji: '🍛',
        },
        {
          id: 'd1-break',
          type: 'break',
          time: '01:00 PM',
          title: 'Rest & Travel Break',
          subtitle: 'Recharge before the next stop',
          thumbnailEmoji: '⏸',
          durationMinutes: 45,
        },
        {
          id: 'd1-3',
          type: 'activity',
          time: '02:00 PM',
          title: 'Tegallalang Rice Terrace',
          subtitle: 'Stunning views and photo spots',
          thumbnailEmoji: '🌾',
        },
        {
          id: 'd1-4',
          type: 'activity',
          time: '06:00 PM',
          title: 'Sunset at Tanah Lot',
          subtitle: "Don't miss the sunset!",
          thumbnailEmoji: '🌅',
        },
      ],
    },
    {
      id: 'day-2',
      dayLabel: 'Day 2',
      dateLabel: 'Sep 13',
      items: [
        {
          id: 'd2-1',
          type: 'activity',
          time: '08:30 AM',
          title: 'Mount Batur Sunrise Trek',
          subtitle: 'Guided hike to the summit',
          thumbnailEmoji: '⛰️',
        },
        {
          id: 'd2-break',
          type: 'break',
          time: '11:00 AM',
          title: 'Rest & Travel Break',
          subtitle: 'Recharge before the next stop',
          thumbnailEmoji: '⏸',
          durationMinutes: 30,
        },
        {
          id: 'd2-2',
          type: 'activity',
          time: '01:00 PM',
          title: 'Coffee Plantation Tour',
          subtitle: 'Sample local Luwak coffee',
          thumbnailEmoji: '☕',
        },
      ],
    },
    {
      id: 'day-3',
      dayLabel: 'Day 3',
      dateLabel: 'Sep 14',
      items: [
        {
          id: 'd3-1',
          type: 'activity',
          time: '10:00 AM',
          title: 'Uluwatu Temple',
          subtitle: 'Clifftop views over the ocean',
          thumbnailEmoji: '🛕',
        },
        {
          id: 'd3-break',
          type: 'break',
          time: '12:30 PM',
          title: 'Rest & Travel Break',
          subtitle: 'Recharge before the next stop',
          thumbnailEmoji: '⏸',
          durationMinutes: 45,
        },
        {
          id: 'd3-2',
          type: 'activity',
          time: '03:00 PM',
          title: 'Kecak Fire Dance',
          subtitle: 'Traditional evening performance',
          thumbnailEmoji: '🔥',
        },
      ],
    },
    {
      id: 'day-4',
      dayLabel: 'Day 4',
      dateLabel: 'Sep 15',
      items: [
        {
          id: 'd4-1',
          type: 'activity',
          time: '09:30 AM',
          title: 'Seminyak Beach',
          subtitle: 'Relax before departure',
          thumbnailEmoji: '🏖️',
        },
      ],
    },
  ];
}