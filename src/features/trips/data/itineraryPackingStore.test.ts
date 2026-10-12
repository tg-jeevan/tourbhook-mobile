import {
  itineraryStore,
  getMotivationalMessage,
  PackingItemRecord,
} from './itineraryStore';

describe('itineraryStore — Packing List Feature', () => {
  beforeEach(() => {
    itineraryStore.resetToInitial();
  });

  describe('Default Initialization & Progress Calculation', () => {
    test('initializes default categories and items for an itinerary', () => {
      const data = itineraryStore.getPackingData('trip-1');
      expect(data.categories.length).toBe(3);
      expect(data.categories.map((c) => c.name)).toEqual([
        'Essentials',
        'Clothing',
        'Gadgets & Accessories',
      ]);
      expect(data.categories.every((c) => c.origin === 'default')).toBe(true);

      expect(data.items.length).toBe(10);
      const checkedCount = data.items.filter((i) => i.checked).length;
      expect(checkedCount).toBe(2); // Passport and Travel documents
    });

    test('calculates correct initial progress percentage and motivational message', () => {
      const progress = itineraryStore.getPackingProgress('trip-1');
      expect(progress.totalItems).toBe(10);
      expect(progress.packedItems).toBe(2);
      expect(progress.percentage).toBe(20);
      expect(progress.motivationalMessage).toBe(
        "Great start! You're getting ready for your trip."
      );
    });

    test('getMotivationalMessage returns proper text across all completion thresholds', () => {
      // Empty checklist
      expect(getMotivationalMessage(0, 0)).toBe(
        'Add your first packing item to get started'
      );

      // 0%
      expect(getMotivationalMessage(0, 10)).toBe(
        "Let's get packing! Your adventure awaits."
      );

      // 1-29%
      expect(getMotivationalMessage(15, 10)).toBe(
        "Great start! You're getting ready for your trip."
      );

      // 30-59%
      expect(getMotivationalMessage(30, 10)).toBe(
        "Hurray! You're making progress. Keep going!"
      );
      expect(getMotivationalMessage(55, 10)).toBe(
        "Hurray! You're making progress. Keep going!"
      );

      // 60-99%
      expect(getMotivationalMessage(60, 10)).toBe(
        "Almost there! Your trip essentials are coming together."
      );
      expect(getMotivationalMessage(95, 10)).toBe(
        "Almost there! Your trip essentials are coming together."
      );

      // 100%
      expect(getMotivationalMessage(100, 10)).toBe(
        "Amazing! Your packing list is complete. You're ready to go!"
      );
    });

    test('handles empty packing list without division-by-zero errors', () => {
      // Create empty category and remove all items
      const data = itineraryStore.getPackingData('empty-trip');
      data.items.forEach((item) => {
        itineraryStore.deletePackingItem('empty-trip', item.id);
      });

      const progress = itineraryStore.getPackingProgress('empty-trip');
      expect(progress.totalItems).toBe(0);
      expect(progress.packedItems).toBe(0);
      expect(progress.percentage).toBe(0);
      expect(progress.motivationalMessage).toBe(
        'Add your first packing item to get started'
      );
      expect(isNaN(progress.percentage)).toBe(false);
    });
  });

  describe('Item Operations (Toggle, Add, Edit, Delete)', () => {
    test('toggling an item updates checked state and recalculates progress', () => {
      const dataBefore = itineraryStore.getPackingData('trip-1');
      const itemToToggle = dataBefore.items.find((i) => !i.checked)!;

      itineraryStore.togglePackingItem('trip-1', itemToToggle.id);

      const progress = itineraryStore.getPackingProgress('trip-1');
      expect(progress.packedItems).toBe(3);
      expect(progress.percentage).toBe(30);
      expect(progress.motivationalMessage).toBe(
        "Hurray! You're making progress. Keep going!"
      );

      // Toggle back off
      itineraryStore.togglePackingItem('trip-1', itemToToggle.id);
      const progressAfter = itineraryStore.getPackingProgress('trip-1');
      expect(progressAfter.packedItems).toBe(2);
      expect(progressAfter.percentage).toBe(20);
    });

    test('adding custom item attaches to category, starts unchecked, and updates total', () => {
      const data = itineraryStore.getPackingData('trip-1');
      const essentialsCat = data.categories[0];

      const newItem = itineraryStore.addPackingItem(
        'trip-1',
        essentialsCat.id,
        'Driver License',
        'Physical card required for car rental'
      );

      expect(newItem).not.toBeNull();
      expect(newItem?.name).toBe('Driver License');
      expect(newItem?.notes).toBe('Physical card required for car rental');
      expect(newItem?.checked).toBe(false);
      expect(newItem?.categoryId).toBe(essentialsCat.id);
      expect(newItem?.source).toBe('custom');

      const progress = itineraryStore.getPackingProgress('trip-1');
      expect(progress.totalItems).toBe(11);
      expect(progress.packedItems).toBe(2);
      expect(progress.percentage).toBe(18); // 2/11 = 18%
    });

    test('rejects empty or whitespace-only item names', () => {
      const data = itineraryStore.getPackingData('trip-1');
      const catId = data.categories[0].id;

      expect(itineraryStore.addPackingItem('trip-1', catId, '')).toBeNull();
      expect(itineraryStore.addPackingItem('trip-1', catId, '   ')).toBeNull();
    });

    test('editing item name and notes preserves checked state', () => {
      const data = itineraryStore.getPackingData('trip-1');
      const checkedItem = data.items.find((i) => i.checked)!;

      const success = itineraryStore.updatePackingItem('trip-1', checkedItem.id, {
        name: 'Passport (Valid until 2030)',
        notes: 'Kept in neck wallet',
      });

      expect(success).toBe(true);

      const updatedData = itineraryStore.getPackingData('trip-1');
      const updatedItem = updatedData.items.find((i) => i.id === checkedItem.id)!;
      expect(updatedItem.name).toBe('Passport (Valid until 2030)');
      expect(updatedItem.notes).toBe('Kept in neck wallet');
      // Checked state must be preserved!
      expect(updatedItem.checked).toBe(true);
    });

    test('deleting an item immediately updates count and completion percentage', () => {
      const data = itineraryStore.getPackingData('trip-1');
      const checkedItem = data.items.find((i) => i.checked)!;

      const deleted = itineraryStore.deletePackingItem('trip-1', checkedItem.id);
      expect(deleted).toBe(true);

      const progress = itineraryStore.getPackingProgress('trip-1');
      expect(progress.totalItems).toBe(9);
      expect(progress.packedItems).toBe(1);
      expect(progress.percentage).toBe(11); // 1/9 = 11%
    });
  });

  describe('Custom Category Operations (Add, Rename, Delete)', () => {
    test('adding custom category creates empty category and does not alter item count', () => {
      const newCat = itineraryStore.addPackingCategory(
        'trip-1',
        'Medicines & First Aid',
        'medicines'
      );

      expect(newCat).not.toBeNull();
      expect(newCat?.name).toBe('Medicines & First Aid');
      expect(newCat?.origin).toBe('custom');
      expect(newCat?.iconType).toBe('medicines');

      const data = itineraryStore.getPackingData('trip-1');
      expect(data.categories.length).toBe(4);

      // Empty custom category must not change item denominator
      const progress = itineraryStore.getPackingProgress('trip-1');
      expect(progress.totalItems).toBe(10);
      expect(progress.percentage).toBe(20);
    });

    test('rejects duplicate category names (case-insensitive)', () => {
      const duplicate1 = itineraryStore.addPackingCategory('trip-1', 'essentials');
      expect(duplicate1).toBeNull();

      const duplicate2 = itineraryStore.addPackingCategory('trip-1', '  Clothing  ');
      expect(duplicate2).toBeNull();
    });

    test('renaming custom category updates name and preserves all items and checked states', () => {
      const customCat = itineraryStore.addPackingCategory(
        'trip-1',
        'Baby Gear',
        'general'
      )!;

      itineraryStore.addPackingItem('trip-1', customCat.id, 'Stroller');
      const item2 = itineraryStore.addPackingItem('trip-1', customCat.id, 'Baby wipes')!;
      itineraryStore.togglePackingItem('trip-1', item2.id); // check wipes

      const renamed = itineraryStore.renamePackingCategory(
        'trip-1',
        customCat.id,
        'Toddler Essentials'
      );
      expect(renamed).toBe(true);

      const data = itineraryStore.getPackingData('trip-1');
      const foundCat = data.categories.find((c) => c.id === customCat.id);
      expect(foundCat?.name).toBe('Toddler Essentials');

      // Verify items inside are fully intact
      const catItems = data.items.filter((i) => i.categoryId === customCat.id);
      expect(catItems.length).toBe(2);
      expect(catItems.find((i) => i.name === 'Baby wipes')?.checked).toBe(true);
      expect(catItems.find((i) => i.name === 'Stroller')?.checked).toBe(false);
    });

    test('prevents renaming or deleting default categories', () => {
      const data = itineraryStore.getPackingData('trip-1');
      const defaultCat = data.categories.find((c) => c.origin === 'default')!;

      expect(
        itineraryStore.renamePackingCategory('trip-1', defaultCat.id, 'New Name')
      ).toBe(false);
      expect(
        itineraryStore.deletePackingCategory('trip-1', defaultCat.id)
      ).toBe(false);
    });

    test('deleting custom category removes category and all associated items', () => {
      const customCat = itineraryStore.addPackingCategory('trip-1', 'Camera Gear', 'gadgets')!;
      itineraryStore.addPackingItem('trip-1', customCat.id, 'Tripod');
      itineraryStore.addPackingItem('trip-1', customCat.id, 'Extra lens');

      const progressBefore = itineraryStore.getPackingProgress('trip-1');
      expect(progressBefore.totalItems).toBe(12);

      const deleted = itineraryStore.deletePackingCategory('trip-1', customCat.id);
      expect(deleted).toBe(true);

      const dataAfter = itineraryStore.getPackingData('trip-1');
      expect(dataAfter.categories.find((c) => c.id === customCat.id)).toBeUndefined();
      expect(dataAfter.items.some((i) => i.categoryId === customCat.id)).toBe(false);

      const progressAfter = itineraryStore.getPackingProgress('trip-1');
      expect(progressAfter.totalItems).toBe(10);
    });
  });

  describe('Per-Itinerary Isolation', () => {
    test('editing trip-1 packing list does not affect trip-2', () => {
      // Modify trip-1
      const trip1Data = itineraryStore.getPackingData('trip-1');
      itineraryStore.togglePackingItem('trip-1', trip1Data.items[2].id);
      itineraryStore.addPackingCategory('trip-1', 'Scuba Gear', 'general');
      itineraryStore.addPackingItem('trip-1', trip1Data.categories[0].id, 'Trip 1 Custom Item');

      // Check trip-2
      const trip2Data = itineraryStore.getPackingData('trip-2');
      expect(trip2Data.categories.length).toBe(3);
      expect(trip2Data.categories.some((c) => c.name === 'Scuba Gear')).toBe(false);
      expect(trip2Data.items.some((i) => i.name === 'Trip 1 Custom Item')).toBe(false);

      const trip2Progress = itineraryStore.getPackingProgress('trip-2');
      expect(trip2Progress.totalItems).toBe(10);
      expect(trip2Progress.packedItems).toBe(2);
      expect(trip2Progress.percentage).toBe(20);
    });
  });
});
