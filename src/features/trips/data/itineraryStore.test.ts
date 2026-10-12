import { itineraryStore, INITIAL_ITINERARIES } from './itineraryStore';

describe('itineraryStore', () => {
  beforeEach(() => {
    itineraryStore.resetToInitial();
  });

  test('initializes with default itineraries', () => {
    const list = itineraryStore.getItineraries();
    expect(list.length).toBe(INITIAL_ITINERARIES.length);
    expect(list[0].title).toBe('Paris Adventure');
  });

  test('getItineraryById returns correct trip', () => {
    const trip = itineraryStore.getItineraryById('1');
    expect(trip).toBeDefined();
    expect(trip?.title).toBe('Paris Adventure');
  });

  test('toggleSaveItinerary toggles status between saved and upcoming', () => {
    const tripBefore = itineraryStore.getItineraryById('1');
    expect(tripBefore?.status).toBe('upcoming');

    itineraryStore.toggleSaveItinerary('1');
    const tripAfter = itineraryStore.getItineraryById('1');
    expect(tripAfter?.status).toBe('saved');

    itineraryStore.toggleSaveItinerary('1');
    const tripRestored = itineraryStore.getItineraryById('1');
    expect(tripRestored?.status).toBe('upcoming');
  });

  test('deleteItinerary removes itinerary from store and updates counts', async () => {
    const countsBefore = itineraryStore.getCounts();
    expect(countsBefore.all).toBe(3);
    expect(countsBefore.upcoming).toBe(2);

    const result = await itineraryStore.deleteItinerary('1');
    expect(result).toBe(true);

    const listAfter = itineraryStore.getItineraries();
    expect(listAfter.length).toBe(2);
    expect(listAfter.find((i) => i.id === '1')).toBeUndefined();

    const countsAfter = itineraryStore.getCounts();
    expect(countsAfter.all).toBe(2);
    expect(countsAfter.upcoming).toBe(1);
  });

  test('deleteItinerary returns false for non-existent id', async () => {
    const result = await itineraryStore.deleteItinerary('non-existent');
    expect(result).toBe(false);
  });

  test('notifies subscribers on mutation', async () => {
    const listener = jest.fn();
    const unsubscribe = itineraryStore.subscribe(listener);

    await itineraryStore.deleteItinerary('2');
    expect(listener).toHaveBeenCalledTimes(1);

    itineraryStore.toggleSaveItinerary('3');
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    await itineraryStore.deleteItinerary('3');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  test('addItinerary adds a new trip with customName and correct statistics', () => {
    const customTrip = {
      id: 'trip-custom-1',
      title: 'Bangalore Weekend Getaway',
      customName: 'Bangalore Weekend Getaway',
      destination: 'Bangalore, India',
      location: 'Bangalore, India',
      dates: 'Aug 5 – Aug 7, 2027',
      status: 'upcoming' as const,
      placesCount: 2,
      activitiesCount: 0,
      travelersCount: 1,
      imageUri: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80',
      theme: 'sky' as const,
    };

    itineraryStore.addItinerary(customTrip);
    const retrieved = itineraryStore.getItineraryById('trip-custom-1');
    expect(retrieved).toBeDefined();
    expect(retrieved?.title).toBe('Bangalore Weekend Getaway');
    expect(retrieved?.customName).toBe('Bangalore Weekend Getaway');
    expect(retrieved?.placesCount).toBe(2);
    expect(retrieved?.activitiesCount).toBe(0);
    expect(retrieved?.travelersCount).toBe(1);
    expect(retrieved?.location).toBe('Bangalore, India');
    expect(retrieved?.dates).toBe('Aug 5 – Aug 7, 2027');
  });

  test('updateItinerary preserves immutable name, destination, and primaryAge', () => {
    const trip = itineraryStore.getItineraryById('1');
    expect(trip?.title).toBe('Paris Adventure');
    expect(trip?.destination).toBe('Paris, France');

    itineraryStore.updateItinerary('1', {
      title: 'Rome Adventure',
      destination: 'Rome, Italy',
      location: 'Rome, Italy',
      primaryAge: 45,
    });

    const updated = itineraryStore.getItineraryById('1');
    expect(updated?.id).toBe('1');
    expect(updated?.title).toBe('Paris Adventure');
    expect(updated?.destination).toBe('Paris, France');
    expect(updated?.location).toBe('Paris, France');
  });

  test('updateItinerary preserves immutable name when dates and travelers change', () => {
    const trip = itineraryStore.getItineraryById('2');
    expect(trip?.title).toBe('Tokyo Explorer');

    itineraryStore.updateItinerary('2', {
      title: 'New Tokyo Name',
      dates: 'Oct 10 – Oct 20, 2026',
      travelersCount: 5,
    });

    const updated = itineraryStore.getItineraryById('2');
    expect(updated?.title).toBe('Tokyo Explorer');
    expect(updated?.dates).toBe('Oct 10 – Oct 20, 2026');
    expect(updated?.travelersCount).toBe(5);
  });

  test('updateItinerary preserves customName when re-generating or refreshing details', () => {
    itineraryStore.addItinerary({
      id: 'trip-custom-bangalore',
      title: 'Bangalore Family Trip',
      customName: 'Bangalore Family Trip',
      destination: 'Bangalore, India',
      location: 'Bangalore, India',
      dates: 'Dec 1 – Dec 5, 2026',
      status: 'upcoming',
      placesCount: 4,
      activitiesCount: 8,
      travelersCount: 3,
      imageUri: 'https://example.com/img.jpg',
      theme: 'peach',
    });

    // Attempting to overwrite name during detail regeneration
    itineraryStore.updateItinerary('trip-custom-bangalore', {
      title: 'Bangalore Adventure',
      customName: 'Bangalore Adventure',
      placesCount: 10,
      activitiesCount: 20,
    });

    const refreshed = itineraryStore.getItineraryById('trip-custom-bangalore');
    expect(refreshed?.title).toBe('Bangalore Family Trip');
    expect(refreshed?.customName).toBe('Bangalore Family Trip');
    expect(refreshed?.placesCount).toBe(10);
    expect(refreshed?.activitiesCount).toBe(20);
  });
});
