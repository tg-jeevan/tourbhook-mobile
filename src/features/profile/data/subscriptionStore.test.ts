import {
  subscriptionStore,
  FREE_ITINERARY_LIMIT,
} from './subscriptionStore';

describe('Subscription Store & 3-Itinerary Limit', () => {
  beforeEach(() => {
    subscriptionStore.reset();
  });

  it('default plan should be free with limit of 3', () => {
    expect(subscriptionStore.getPlan()).toBe('free');
    expect(subscriptionStore.isPremium()).toBe(false);
    expect(FREE_ITINERARY_LIMIT).toBe(3);
  });

  it('upgradeToPremium should activate premium state', () => {
    subscriptionStore.upgradeToPremium();
    expect(subscriptionStore.getPlan()).toBe('premium');
    expect(subscriptionStore.isPremium()).toBe(true);
  });

  it('subscribers should be notified on plan changes', () => {
    const listener = jest.fn();
    const unsubscribe = subscriptionStore.subscribe(listener);

    subscriptionStore.setPlan('premium');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(subscriptionStore.isPremium()).toBe(true);

    unsubscribe();
    subscriptionStore.setPlan('free');
    expect(listener).toHaveBeenCalledTimes(1); // not called after unsubscribe
  });
});
