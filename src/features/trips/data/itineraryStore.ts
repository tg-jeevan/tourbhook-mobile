import { useState, useEffect } from 'react';
import {
  TravelerType,
  TravelPurpose,
  TravelStyle,
  TravelMode,
} from '../../../core/navigation/types';
import {
  ItineraryDay,
  getMockItineraryDays,
  generateItineraryDaysForDates,
} from '../types/itineraryPackingTypes';
import { extractStartAndEndDatesFromRange } from '../utils/itineraryFormatting';

export interface ItineraryTrip {
  id: string;
  title: string;
  customName?: string;
  destination: string;
  location: string;
  dates: string;
  status: 'upcoming' | 'past' | 'saved';
  placesCount: number;
  activitiesCount: number;
  travelersCount: number;
  imageUri: string;
  theme: 'sky' | 'peach' | 'mint';
  // Detailed planning metadata
  startDate?: string;
  endDate?: string;
  travelerType?: TravelerType;
  adults?: number;
  kids?: number;
  purpose?: TravelPurpose;
  destinationMetadata?: any;
  primaryAge?: number;
  medicalInfo?: string;
  travelStyle?: TravelStyle;
  selectedPlaceIds?: string[];
  travelModes?: TravelMode[];
}

export type CategoryOrigin = 'default' | 'custom';
export type CategoryIconType =
  | 'essentials'
  | 'clothing'
  | 'gadgets'
  | 'general'
  | 'medicines'
  | 'documents';

export interface PackingItemRecord {
  id: string;
  name: string;
  notes?: string;
  checked: boolean;
  categoryId: string;
  itineraryId: string;
  source?: 'base' | 'ai' | 'custom';
}

export interface PackingCategoryRecord {
  id: string;
  name: string;
  subtitle?: string;
  origin: CategoryOrigin;
  iconType: CategoryIconType;
  itineraryId: string;
}

export interface PackingProgress {
  totalItems: number;
  packedItems: number;
  percentage: number;
  motivationalMessage: string;
}

export function getMotivationalMessage(percentage: number, totalItems: number): string {
  if (totalItems === 0) {
    return 'Add your first packing item to get started';
  }
  if (percentage === 0) {
    return "Let's get packing! Your adventure awaits.";
  }
  if (percentage <= 29) {
    return "Great start! You're getting ready for your trip.";
  }
  if (percentage <= 59) {
    return "Hurray! You're making progress. Keep going!";
  }
  if (percentage <= 99) {
    return "Almost there! Your trip essentials are coming together.";
  }
  return "Amazing! Your packing list is complete. You're ready to go!";
}

export const INITIAL_ITINERARIES: ItineraryTrip[] = [
  {
    id: '1',
    title: 'Paris Adventure',
    destination: 'Paris, France',
    location: 'Paris, France',
    dates: 'Sep 12 – Sep 17, 2026',
    status: 'upcoming',
    placesCount: 5,
    activitiesCount: 12,
    travelersCount: 2,
    imageUri:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    theme: 'sky',
    startDate: 'Sep 12, 2026',
    endDate: 'Sep 17, 2026',
    travelerType: 'couple',
    adults: 2,
    kids: 0,
    purpose: 'Leisure',
    primaryAge: 28,
    travelStyle: 'Explore Everything',
    destinationMetadata: {
      id: 'dest-paris',
      city: 'Paris',
      country: 'France',
      formatted: 'Paris, France',
      coordinates: { latitude: 48.8566, longitude: 2.3522 },
    },
  },
  {
    id: '2',
    title: 'Tokyo Explorer',
    destination: 'Tokyo, Japan',
    location: 'Tokyo, Japan',
    dates: 'Oct 5 – Oct 12, 2026',
    status: 'upcoming',
    placesCount: 6,
    activitiesCount: 14,
    travelersCount: 3,
    imageUri:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    theme: 'peach',
    startDate: 'Oct 5, 2026',
    endDate: 'Oct 12, 2026',
    travelerType: 'family',
    adults: 2,
    kids: 1,
    purpose: 'Leisure',
    primaryAge: 32,
    travelStyle: 'Fast Travel',
    destinationMetadata: {
      id: 'dest-tokyo',
      city: 'Tokyo',
      country: 'Japan',
      formatted: 'Tokyo, Japan',
      coordinates: { latitude: 35.6762, longitude: 139.6503 },
    },
  },
  {
    id: '3',
    title: 'Kerala Weekend',
    destination: 'Kerala, India',
    location: 'Kerala, India',
    dates: 'Nov 20 – Nov 23, 2026',
    status: 'past',
    placesCount: 4,
    activitiesCount: 8,
    travelersCount: 4,
    imageUri:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80',
    theme: 'mint',
    startDate: 'Nov 20, 2026',
    endDate: 'Nov 23, 2026',
    travelerType: 'group',
    adults: 4,
    kids: 0,
    purpose: 'Leisure',
    primaryAge: 26,
    travelStyle: 'Relaxed Vacation',
    destinationMetadata: {
      id: 'dest-kerala',
      city: 'Kerala',
      country: 'India',
      formatted: 'Kerala, India',
      coordinates: { latitude: 10.8505, longitude: 76.2711 },
    },
  },
];

function createDefaultPackingData(itineraryId: string): {
  categories: PackingCategoryRecord[];
  items: PackingItemRecord[];
} {
  const catEssentialsId = `cat-${itineraryId}-essentials`;
  const catClothingId = `cat-${itineraryId}-clothing`;
  const catGadgetsId = `cat-${itineraryId}-gadgets`;

  const categories: PackingCategoryRecord[] = [
    {
      id: catEssentialsId,
      name: 'Essentials',
      subtitle: 'Must-have items for your trip',
      origin: 'default',
      iconType: 'essentials',
      itineraryId,
    },
    {
      id: catClothingId,
      name: 'Clothing',
      subtitle: 'Based on weather and activities',
      origin: 'default',
      iconType: 'clothing',
      itineraryId,
    },
    {
      id: catGadgetsId,
      name: 'Gadgets & Accessories',
      subtitle: 'Capture and stay connected',
      origin: 'default',
      iconType: 'gadgets',
      itineraryId,
    },
  ];

  const items: PackingItemRecord[] = [
    {
      id: `item-${itineraryId}-1`,
      name: 'Passport',
      checked: true,
      categoryId: catEssentialsId,
      itineraryId,
      source: 'base',
    },
    {
      id: `item-${itineraryId}-2`,
      name: 'Travel documents',
      checked: true,
      categoryId: catEssentialsId,
      itineraryId,
      source: 'base',
    },
    {
      id: `item-${itineraryId}-3`,
      name: 'Swimwear',
      checked: false,
      categoryId: catClothingId,
      itineraryId,
      source: 'base',
    },
    {
      id: `item-${itineraryId}-4`,
      name: 'Comfortable sandals',
      checked: false,
      categoryId: catClothingId,
      itineraryId,
      source: 'base',
    },
    {
      id: `item-${itineraryId}-5`,
      name: 'Light rain jacket',
      checked: false,
      categoryId: catClothingId,
      itineraryId,
      source: 'base',
    },
    {
      id: `item-${itineraryId}-6`,
      name: 'Sarong for temples',
      checked: false,
      categoryId: catClothingId,
      itineraryId,
      source: 'ai',
    },
    {
      id: `item-${itineraryId}-7`,
      name: 'Camera',
      checked: false,
      categoryId: catGadgetsId,
      itineraryId,
      source: 'base',
    },
    {
      id: `item-${itineraryId}-8`,
      name: 'Reef-safe sunscreen',
      checked: false,
      categoryId: catGadgetsId,
      itineraryId,
      source: 'ai',
    },
    {
      id: `item-${itineraryId}-9`,
      name: 'Insect repellent',
      checked: false,
      categoryId: catGadgetsId,
      itineraryId,
      source: 'ai',
    },
    {
      id: `item-${itineraryId}-10`,
      name: 'Power adapter',
      checked: false,
      categoryId: catGadgetsId,
      itineraryId,
      source: 'ai',
    },
  ];

  return { categories, items };
}

class ItineraryStore {
  private itineraries: ItineraryTrip[] = [...INITIAL_ITINERARIES];
  private packingData: Record<
    string,
    { categories: PackingCategoryRecord[]; items: PackingItemRecord[] }
  > = {};
  private itineraryDaysByTrip: Record<string, ItineraryDay[]> = {};
  private listeners: Set<() => void> = new Set();

  getItineraries(): ItineraryTrip[] {
    return [...this.itineraries];
  }

  getItineraryById(id: string): ItineraryTrip | undefined {
    return this.itineraries.find((i: ItineraryTrip) => i.id === id);
  }

  getItineraryDays(tripId: string): ItineraryDay[] {
    const existing = this.itineraryDaysByTrip[tripId];
    if (existing && existing.length > 0) {
      return existing;
    }

    const trip = this.getItineraryById(tripId);
    if (trip) {
      const dates =
        trip.startDate && trip.endDate
          ? { startDate: trip.startDate, endDate: trip.endDate }
          : extractStartAndEndDatesFromRange(trip.dates);
      const days = generateItineraryDaysForDates(dates.startDate, dates.endDate);
      this.itineraryDaysByTrip[tripId] = days;
      return days;
    }

    return getMockItineraryDays();
  }

  setItineraryDays(tripId: string, days: ItineraryDay[]): void {
    this.itineraryDaysByTrip[tripId] = days;
    this.notify();
  }

  async deleteItinerary(id: string): Promise<boolean> {
    try {
      const exists = this.itineraries.some((i: ItineraryTrip) => i.id === id);
      if (!exists) {
        return false;
      }
      this.itineraries = this.itineraries.filter((i: ItineraryTrip) => i.id !== id);
      delete this.packingData[id];
      delete this.itineraryDaysByTrip[id];
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
    const finalCustomName = (item.customName || item.title || '').trim();
    const normalizedItem: ItineraryTrip = {
      ...item,
      title: finalCustomName || item.title,
      customName: item.customName ? item.customName.trim() : (finalCustomName || undefined),
    };
    this.itineraries = [normalizedItem, ...this.itineraries];

    // Authoritative day generation from saved trip dates
    const dates =
      normalizedItem.startDate && normalizedItem.endDate
        ? { startDate: normalizedItem.startDate, endDate: normalizedItem.endDate }
        : extractStartAndEndDatesFromRange(normalizedItem.dates);
    if (dates.startDate && dates.endDate) {
      this.itineraryDaysByTrip[normalizedItem.id] = generateItineraryDaysForDates(
        dates.startDate,
        dates.endDate
      );
    }

    this.notify();
  }

  updateItinerary(id: string, updates: Partial<ItineraryTrip>): boolean {
    const index = this.itineraries.findIndex((i: ItineraryTrip) => i.id === id);
    if (index === -1) {
      return false;
    }
    const current = this.itineraries[index];
    // IMMUTABILITY ENFORCEMENT:
    // Once an itinerary is created, the following fields are permanently immutable:
    // 1. Itinerary name (title and customName)
    // 2. Destination (destination, location, and destinationMetadata)
    // 3. Traveller's age (primaryAge)
    // 4. Itinerary ID (id)
    // Ensure edit operations cannot overwrite the original values under any circumstance.
    const {
      id: _ignoredId,
      title: _ignoredTitle,
      customName: _ignoredCustomName,
      destination: _ignoredDestination,
      location: _ignoredLocation,
      destinationMetadata: _ignoredDestinationMetadata,
      primaryAge: _ignoredPrimaryAge,
      ...allowedUpdates
    } = updates;

    const updatedTrip: ItineraryTrip = {
      ...current,
      ...allowedUpdates,
      id: current.id,
      title: current.title,
      customName: current.customName,
      destination: current.destination,
      location: current.location,
      destinationMetadata: current.destinationMetadata,
      primaryAge: current.primaryAge,
    };

    // If dates were changed during editing, synchronize itinerary days
    const oldDates =
      current.startDate && current.endDate
        ? { startDate: current.startDate, endDate: current.endDate }
        : extractStartAndEndDatesFromRange(current.dates);
    const newDates =
      updatedTrip.startDate && updatedTrip.endDate
        ? { startDate: updatedTrip.startDate, endDate: updatedTrip.endDate }
        : extractStartAndEndDatesFromRange(updatedTrip.dates);

    if (
      newDates.startDate &&
      newDates.endDate &&
      (newDates.startDate !== oldDates.startDate || newDates.endDate !== oldDates.endDate)
    ) {
      const existingDays = this.itineraryDaysByTrip[id];
      this.itineraryDaysByTrip[id] = generateItineraryDaysForDates(
        newDates.startDate,
        newDates.endDate,
        existingDays
      );
    }

    this.itineraries[index] = updatedTrip;
    this.itineraries = [...this.itineraries];
    this.notify();
    return true;
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

  /* ── PACKING LIST MANAGEMENT ─────────────────────────────────────────── */

  getPackingData(itineraryId: string): {
    categories: PackingCategoryRecord[];
    items: PackingItemRecord[];
  } {
    if (!this.packingData[itineraryId]) {
      this.packingData[itineraryId] = createDefaultPackingData(itineraryId);
    }
    return {
      categories: [...this.packingData[itineraryId].categories],
      items: [...this.packingData[itineraryId].items],
    };
  }

  togglePackingItem(itineraryId: string, itemId: string): void {
    const data = this.getPackingData(itineraryId);
    this.packingData[itineraryId].items = data.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    this.notify();
  }

  addPackingItem(
    itineraryId: string,
    categoryId: string,
    name: string,
    notes?: string
  ): PackingItemRecord | null {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const data = this.getPackingData(itineraryId);
    const categoryExists = data.categories.some((c) => c.id === categoryId);
    if (!categoryExists) return null;

    const newItem: PackingItemRecord = {
      id: `item-${itineraryId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: trimmed,
      notes: notes?.trim() || undefined,
      checked: false,
      categoryId,
      itineraryId,
      source: 'custom',
    };

    this.packingData[itineraryId].items = [...data.items, newItem];
    this.notify();
    return newItem;
  }

  updatePackingItem(
    itineraryId: string,
    itemId: string,
    updates: { name: string; notes?: string }
  ): boolean {
    const trimmed = updates.name.trim();
    if (!trimmed) return false;

    const data = this.getPackingData(itineraryId);
    const itemExists = data.items.some((i) => i.id === itemId);
    if (!itemExists) return false;

    this.packingData[itineraryId].items = data.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          name: trimmed,
          notes: updates.notes !== undefined ? updates.notes.trim() || undefined : item.notes,
        };
      }
      return item;
    });
    this.notify();
    return true;
  }

  deletePackingItem(itineraryId: string, itemId: string): boolean {
    const data = this.getPackingData(itineraryId);
    const initialLen = data.items.length;
    this.packingData[itineraryId].items = data.items.filter((i) => i.id !== itemId);
    if (this.packingData[itineraryId].items.length !== initialLen) {
      this.notify();
      return true;
    }
    return false;
  }

  addPackingCategory(
    itineraryId: string,
    name: string,
    iconType?: CategoryIconType
  ): PackingCategoryRecord | null {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const data = this.getPackingData(itineraryId);
    const isDuplicate = data.categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) return null;

    const newCategory: PackingCategoryRecord = {
      id: `cat-${itineraryId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: trimmed,
      subtitle: 'Custom category',
      origin: 'custom',
      iconType: iconType || 'general',
      itineraryId,
    };

    this.packingData[itineraryId].categories = [...data.categories, newCategory];
    this.notify();
    return newCategory;
  }

  renamePackingCategory(
    itineraryId: string,
    categoryId: string,
    newName: string
  ): boolean {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    const data = this.getPackingData(itineraryId);
    const category = data.categories.find((c) => c.id === categoryId);
    if (!category || category.origin !== 'custom') return false;

    const isDuplicate = data.categories.some(
      (c) => c.id !== categoryId && c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) return false;

    this.packingData[itineraryId].categories = data.categories.map((c) =>
      c.id === categoryId ? { ...c, name: trimmed } : c
    );
    this.notify();
    return true;
  }

  deletePackingCategory(itineraryId: string, categoryId: string): boolean {
    const data = this.getPackingData(itineraryId);
    const category = data.categories.find((c) => c.id === categoryId);
    if (!category || category.origin !== 'custom') return false;

    this.packingData[itineraryId].categories = data.categories.filter(
      (c) => c.id !== categoryId
    );
    this.packingData[itineraryId].items = data.items.filter(
      (item) => item.categoryId !== categoryId
    );
    this.notify();
    return true;
  }

  getPackingProgress(itineraryId: string): PackingProgress {
    const data = this.getPackingData(itineraryId);
    const totalItems = data.items.length;
    const packedItems = data.items.filter((i) => i.checked).length;
    const percentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
    const motivationalMessage = getMotivationalMessage(percentage, totalItems);

    return {
      totalItems,
      packedItems,
      percentage,
      motivationalMessage,
    };
  }

  /* ── SUBSCRIPTIONS & RESET ───────────────────────────────────────────── */

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
    this.packingData = {};
    this.itineraryDaysByTrip = {};
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
    updateItinerary: (id: string, updates: Partial<ItineraryTrip>) =>
      itineraryStore.updateItinerary(id, updates),
    getItineraryById: (id: string) => itineraryStore.getItineraryById(id),
    resetToInitial: () => itineraryStore.resetToInitial(),
  };
}

export function usePackingState(itineraryId: string) {
  const [data, setData] = useState(() => itineraryStore.getPackingData(itineraryId));
  const [progress, setProgress] = useState(() =>
    itineraryStore.getPackingProgress(itineraryId)
  );

  useEffect(() => {
    setData(itineraryStore.getPackingData(itineraryId));
    setProgress(itineraryStore.getPackingProgress(itineraryId));

    const unsubscribe = itineraryStore.subscribe(() => {
      setData(itineraryStore.getPackingData(itineraryId));
      setProgress(itineraryStore.getPackingProgress(itineraryId));
    });
    return unsubscribe;
  }, [itineraryId]);

  return {
    categories: data.categories,
    items: data.items,
    progress,
    togglePackingItem: (itemId: string) =>
      itineraryStore.togglePackingItem(itineraryId, itemId),
    addPackingItem: (categoryId: string, name: string, notes?: string) =>
      itineraryStore.addPackingItem(itineraryId, categoryId, name, notes),
    updatePackingItem: (itemId: string, updates: { name: string; notes?: string }) =>
      itineraryStore.updatePackingItem(itineraryId, itemId, updates),
    deletePackingItem: (itemId: string) =>
      itineraryStore.deletePackingItem(itineraryId, itemId),
    addPackingCategory: (name: string, iconType?: CategoryIconType) =>
      itineraryStore.addPackingCategory(itineraryId, name, iconType),
    renamePackingCategory: (categoryId: string, newName: string) =>
      itineraryStore.renamePackingCategory(itineraryId, categoryId, newName),
    deletePackingCategory: (categoryId: string) =>
      itineraryStore.deletePackingCategory(itineraryId, categoryId),
  };
}
