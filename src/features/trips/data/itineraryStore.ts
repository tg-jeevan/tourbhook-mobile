import { useState, useEffect } from 'react';

export interface ItineraryTrip {
  id: string;
  title: string;
  customName?: string;
  destination: string;
  location: string;
  dates: string;
  startDate?: string;
  endDate?: string;
  status: 'upcoming' | 'past' | 'saved';
  placesCount: number;
  activitiesCount: number;
  travelersCount: number;
  imageUri: string;
  theme: 'sky' | 'peach' | 'mint';
}

export const INITIAL_ITINERARIES: ItineraryTrip[] = [
  {
    id: '1',
    title: 'Paris Adventure',
    destination: 'Paris, France',
    location: 'Paris, France',
    dates: 'Sep 12 – Sep 17, 2026',
    startDate: '2026-09-12',
    endDate: '2026-09-17',
    status: 'upcoming',
    placesCount: 5,
    activitiesCount: 12,
    travelersCount: 2,
    imageUri:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    theme: 'sky',
  },
  {
    id: '2',
    title: 'Tokyo Explorer',
    destination: 'Tokyo, Japan',
    location: 'Tokyo, Japan',
    dates: 'Oct 5 – Oct 12, 2026',
    startDate: '2026-10-05',
    endDate: '2026-10-12',
    status: 'upcoming',
    placesCount: 6,
    activitiesCount: 14,
    travelersCount: 3,
    imageUri:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    theme: 'peach',
  },
  {
    id: '3',
    title: 'Kerala Weekend',
    destination: 'Kerala, India',
    location: 'Kerala, India',
    dates: 'Nov 20 – Nov 23, 2026',
    startDate: '2026-11-20',
    endDate: '2026-11-23',
    status: 'past',
    placesCount: 4,
    activitiesCount: 8,
    travelersCount: 4,
    imageUri:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80',
    theme: 'mint',
  },
];

class ItineraryStore {
  private itineraries: ItineraryTrip[] = [...INITIAL_ITINERARIES];
  private listeners: Set<() => void> = new Set();

  getItineraries(): ItineraryTrip[] {
    return [...this.itineraries];
  }

  getItineraryById(id: string): ItineraryTrip | undefined {
    return this.itineraries.find((i: ItineraryTrip) => i.id === id);
  }

  async deleteItinerary(id: string): Promise<boolean> {
    try {
      const exists = this.itineraries.some((i: ItineraryTrip) => i.id === id);
      if (!exists) {
        return false;
      }
      this.itineraries = this.itineraries.filter((i: ItineraryTrip) => i.id !== id);
      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  toggleSaveItinerary(id: string): void {
    this.itineraries = this.itineraries.map((i: ItineraryTrip) => {
      if (i.id === id) {
        return {
          ...i,
          status: i.status === 'saved' ? 'upcoming' : 'saved',
        };
      }
      return i;
    });
    this.notify();
  }

  addItinerary(item: ItineraryTrip): void {
    this.itineraries = [item, ...this.itineraries];
    this.notify();
  }

  getCounts(): {
    all: number;
    upcoming: number;
    past: number;
    saved: number;
  } {
    return {
      all: this.itineraries.length,
      upcoming: this.itineraries.filter((i: ItineraryTrip) => i.status === 'upcoming').length,
      past: this.itineraries.filter((i: ItineraryTrip) => i.status === 'past').length,
      saved: this.itineraries.filter((i: ItineraryTrip) => i.status === 'saved').length,
    };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch {
        // Ignored
      }
    });
  }

  resetToInitial(): void {
    this.itineraries = [...INITIAL_ITINERARIES];
    this.notify();
  }
}

export const itineraryStore = new ItineraryStore();

export function useItineraryState() {
  const [itineraries, setItineraries] = useState<ItineraryTrip[]>(() =>
    itineraryStore.getItineraries()
  );

  useEffect(() => {
    setItineraries(itineraryStore.getItineraries());

    const unsubscribe = itineraryStore.subscribe(() => {
      setItineraries(itineraryStore.getItineraries());
    });
    return unsubscribe;
  }, []);

  const counts = {
    all: itineraries.length,
    upcoming: itineraries.filter((i: ItineraryTrip) => i.status === 'upcoming').length,
    past: itineraries.filter((i: ItineraryTrip) => i.status === 'past').length,
    saved: itineraries.filter((i: ItineraryTrip) => i.status === 'saved').length,
  };

  return {
    itineraries,
    counts,
    deleteItinerary: (id: string) => itineraryStore.deleteItinerary(id),
    toggleSaveItinerary: (id: string) => itineraryStore.toggleSaveItinerary(id),
    addItinerary: (item: ItineraryTrip) => itineraryStore.addItinerary(item),
    getItineraryById: (id: string) => itineraryStore.getItineraryById(id),
    resetToInitial: () => itineraryStore.resetToInitial(),
  };
}
