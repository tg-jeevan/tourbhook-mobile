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
});
