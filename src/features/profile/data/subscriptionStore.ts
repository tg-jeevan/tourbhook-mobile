import { useState, useEffect } from 'react';

export type SubscriptionPlan = 'free' | 'premium';

export const FREE_ITINERARY_LIMIT = 3;

class SubscriptionStore {
  private currentPlan: SubscriptionPlan = 'free';
  private listeners: Set<() => void> = new Set();

  getPlan(): SubscriptionPlan {
    return this.currentPlan;
  }

  isPremium(): boolean {
    return this.currentPlan === 'premium';
  }

  setPlan(plan: SubscriptionPlan): void {
    this.currentPlan = plan;
    this.notify();
  }

  upgradeToPremium(): void {
    this.currentPlan = 'premium';
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch {
        // Ignored
      }
    });
  }

  reset(): void {
    this.currentPlan = 'free';
    this.notify();
  }
}

export const subscriptionStore = new SubscriptionStore();

export function useSubscription() {
  const [plan, setPlan] = useState<SubscriptionPlan>(() => subscriptionStore.getPlan());

  useEffect(() => {
    setPlan(subscriptionStore.getPlan());
    const unsubscribe = subscriptionStore.subscribe(() => {
      setPlan(subscriptionStore.getPlan());
    });
    return unsubscribe;
  }, []);

  return {
    plan,
    isPremium: plan === 'premium',
    upgradeToPremium: () => subscriptionStore.upgradeToPremium(),
    setPlan: (newPlan: SubscriptionPlan) => subscriptionStore.setPlan(newPlan),
  };
}
