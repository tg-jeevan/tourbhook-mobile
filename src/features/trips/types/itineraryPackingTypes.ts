import {
  parseDateStringToLocalDate,
  addDaysToLocalDate,
  getDaysBetween,
  formatLocalDateToDayTabLabel,
} from '../utils/tripDateUtils';

export type TimelineItemType = 'activity' | 'break';

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  time: string;
  title: string;
  subtitle: string;
  /** Emoji used as a stand-in thumbnail when images are not loaded. */
  thumbnailEmoji?: string;
  /** Only present for breaks. */
  durationMinutes?: number;
  /** High-resolution activity photo */
  imageUri?: string;
  /** Location/Address string */
  location?: string;
  /** Duration description (e.g. '2 Hours') */
  duration?: string;
  /** Activity category badge */
  category?: string;
  /** Geographic latitude */
  latitude?: number;
  /** Geographic longitude */
  longitude?: number;
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
          subtitle: 'Explore the sacred sanctuary temples and playful macaques',
          thumbnailEmoji: '🐒',
          location: 'Padangtegal, Ubud, Bali',
          duration: '2 Hours',
          category: 'Nature & Wildlife',
          latitude: -8.5188,
          longitude: 115.2585,
          imageUri:
            'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'd1-2',
          type: 'activity',
          time: '12:00 PM',
          title: 'Local Balinese Lunch',
          subtitle: 'Authentic crispy duck and nasi campur at traditional warung',
          thumbnailEmoji: '🍛',
          location: 'Jalan Raya Ubud, Bali',
          duration: '1 Hour',
          category: 'Food & Dining',
          latitude: -8.5085,
          longitude: 115.2635,
          imageUri:
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'd1-break',
          type: 'break',
          time: '01:00 PM',
          title: 'Rest & Travel Break',
          subtitle: 'Scenic drive to central Gianyar valley',
          thumbnailEmoji: '⏸',
          durationMinutes: 45,
          duration: '45 mins',
          category: 'Rest & Transit',
        },
        {
          id: 'd1-3',
          type: 'activity',
          time: '02:00 PM',
          title: 'Tegallalang Rice Terrace',
          subtitle: 'Iconic stepped emerald valley views, swings & jungle walks',
          thumbnailEmoji: '🌾',
          location: 'Tegallalang, Gianyar, Bali',
          duration: '2.5 Hours',
          category: 'Sightseeing',
          latitude: -8.4344,
          longitude: 115.2778,
          imageUri:
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'd1-4',
          type: 'activity',
          time: '06:00 PM',
          title: 'Sunset at Tanah Lot',
          subtitle: 'Ancient coastal sea temple perched on dramatic offshore rock',
          thumbnailEmoji: '🌅',
          location: 'Beraban, Tabanan, Bali',
          duration: '1.5 Hours',
          category: 'Cultural Landmark',
          latitude: -8.6212,
          longitude: 115.0868,
          imageUri:
            'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&auto=format&fit=crop&q=80',
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
          subtitle: 'Guided volcanic hike to crater viewpoint with breakfast',
          thumbnailEmoji: '⛰️',
          location: 'Kintamani, Bangli, Bali',
          duration: '3.5 Hours',
          category: 'Adventure & Hike',
          latitude: -8.2422,
          longitude: 115.3753,
          imageUri:
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'd2-break',
          type: 'break',
          time: '11:00 AM',
          title: 'Rest & Travel Break',
          subtitle: 'Cool down and transit to hillside plantation',
          thumbnailEmoji: '⏸',
          durationMinutes: 30,
          duration: '30 mins',
          category: 'Rest & Transit',
        },
        {
          id: 'd2-2',
          type: 'activity',
          time: '01:00 PM',
          title: 'Coffee Plantation Tour',
          subtitle: 'Sample local Luwak coffee and spices overlooking lush terraces',
          thumbnailEmoji: '☕',
          location: 'Sebatu, Tegallalang, Bali',
          duration: '1.5 Hours',
          category: 'Food & Culture',
          latitude: -8.4357,
          longitude: 115.2801,
          imageUri:
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80',
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
          subtitle: 'Clifftop pagoda views 70 meters over the Indian Ocean',
          thumbnailEmoji: '🛕',
          location: 'Pecatu, South Kuta, Bali',
          duration: '2 Hours',
          category: 'Cultural Landmark',
          latitude: -8.8291,
          longitude: 115.0849,
          imageUri:
            'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'd3-break',
          type: 'break',
          time: '12:30 PM',
          title: 'Rest & Travel Break',
          subtitle: 'Clifftop lunch and afternoon relaxation',
          thumbnailEmoji: '⏸',
          durationMinutes: 45,
          duration: '45 mins',
          category: 'Rest & Transit',
        },
        {
          id: 'd3-2',
          type: 'activity',
          time: '03:00 PM',
          title: 'Kecak Fire Dance',
          subtitle: 'Traditional evening Ramayana performance at amphitheater',
          thumbnailEmoji: '🔥',
          location: 'Uluwatu Amphitheatre, Bali',
          duration: '1.5 Hours',
          category: 'Cultural Arts',
          latitude: -8.8298,
          longitude: 115.0841,
          imageUri:
            'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80',
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
          title: 'Seminyak Beach & Surf',
          subtitle: 'Golden sands, gentle surf breaks, and coastal cafes',
          thumbnailEmoji: '🏖️',
          location: 'Seminyak, Kuta, Bali',
          duration: '2.5 Hours',
          category: 'Beach & Coastal',
          latitude: -8.6913,
          longitude: 115.1554,
          imageUri:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
        },
      ],
    },
  ];
}

/**
 * Dynamically generates itinerary days for a trip based on authoritative start and end dates.
 * Preserves custom items if existing days are provided.
 */
export function generateItineraryDaysForDates(
  startDateStr?: string,
  endDateStr?: string,
  existingDays?: ItineraryDay[]
): ItineraryDay[] {
  const start = parseDateStringToLocalDate(startDateStr);
  const end = parseDateStringToLocalDate(endDateStr);

  if (!start || !end) {
    return getMockItineraryDays();
  }

  const dayCount = Math.max(1, Math.min(getDaysBetween(start, end), 60));
  const templateDays = getMockItineraryDays();
  const generated: ItineraryDay[] = [];

  for (let i = 0; i < dayCount; i++) {
    const dayDate = addDaysToLocalDate(start, i);
    const dayLabel = `Day ${i + 1}`;
    const dateLabel = formatLocalDateToDayTabLabel(dayDate);
    const dayId = `day-${i + 1}`;

    let items: TimelineItem[];
    if (existingDays && existingDays[i] && existingDays[i].items && existingDays[i].items.length > 0) {
      items = existingDays[i].items;
    } else {
      const template = templateDays[i % templateDays.length];
      if (i < templateDays.length) {
        items = template.items.map((item) => ({ ...item }));
      } else {
        items = template.items.map((item) => ({
          ...item,
          id: `${item.id}-d${i + 1}`,
        }));
      }
    }

    generated.push({
      id: dayId,
      dayLabel,
      dateLabel,
      items,
    });
  }

  return generated;
}
