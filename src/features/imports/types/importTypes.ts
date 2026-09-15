export type ImportSourceId = 'google_maps' | 'tripit' | 'csv';

export interface ImportSourceOption {
  id: ImportSourceId;
  title: string;
  description: string;
  iconEmoji: string;
  iconBackgroundColor: string;
}

export const IMPORT_SOURCES: ImportSourceOption[] = [
  {
    id: 'google_maps',
    title: 'Google Maps',
    description: 'Import saved places and routes',
    iconEmoji: '📍',
    iconBackgroundColor: '#FFFFFF',
  },
  {
    id: 'tripit',
    title: 'Tripit',
    description: 'Import your travel itineraries',
    iconEmoji: '✈️',
    iconBackgroundColor: '#FDECE3',
  },
  {
    id: 'csv',
    title: 'CSV File',
    description: 'Import your travel data (CSV)',
    iconEmoji: '📄',
    iconBackgroundColor: '#E8ECF2',
  },
];

export interface DraftPlace {
  id: string;
  name: string;
}

export interface ImportedTripDraft {
  source: ImportSourceId;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  places: DraftPlace[];
}

export function buildDraftFromSource(
  source: ImportSourceId,
  csvText?: string,
): ImportedTripDraft {
  if (source === 'google_maps') {
    return {
      source,
      destination: 'Rome, Italy',
      startDate: 'Oct 3, 2026',
      endDate: 'Oct 8, 2026',
      travelers: 2,
      places: [
        { id: 'gm-1', name: 'Colosseum' },
        { id: 'gm-2', name: 'Trevi Fountain' },
        { id: 'gm-3', name: 'Vatican Museums' },
      ],
    };
  }

  if (source === 'tripit') {
    return {
      source,
      destination: 'New York, USA',
      startDate: 'Nov 14, 2026',
      endDate: 'Nov 18, 2026',
      travelers: 1,
      places: [
        { id: 'tr-1', name: 'Flight: JFK Arrival' },
        { id: 'tr-2', name: 'Hotel Check-in' },
        { id: 'tr-3', name: 'Central Park Walk' },
      ],
    };
  }

  // CSV: naive line-based parse of pasted content.
  const lines = (csvText ?? '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const destination = lines[0] ?? 'Unnamed Trip';
  const places: DraftPlace[] = lines.slice(1).map((line, index) => ({
    id: `csv-${index}`,
    name: line.replace(/^[-,*]\s*/, ''),
  }));

  return {
    source,
    destination,
    startDate: 'TBD',
    endDate: 'TBD',
    travelers: 1,
    places: places.length > 0 ? places : [{ id: 'csv-0', name: 'Add a place' }],
  };
}