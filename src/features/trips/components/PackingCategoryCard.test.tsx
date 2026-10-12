import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PackingCategoryCard } from './PackingCategoryCard';
import { PackingCategoryRecord, PackingItemRecord } from '../data/itineraryStore';

const mockCategory: PackingCategoryRecord = {
  id: 'cat-essentials',
  itineraryId: 'trip-1',
  name: 'Essentials',
  subtitle: 'Must-have items for your trip',
  iconType: 'essentials',
  origin: 'default',
};

const mockItems: PackingItemRecord[] = [
  { id: 'item-1', itineraryId: 'trip-1', categoryId: 'cat-essentials', name: 'Passport', checked: true, source: 'ai' },
  { id: 'item-2', itineraryId: 'trip-1', categoryId: 'cat-essentials', name: 'Travel documents', checked: false, source: 'custom' },
];

describe('PackingCategoryCard Inline Add & Keyboard Scrolling', () => {
  test('renders category header and packing items', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <PackingCategoryCard
          category={mockCategory}
          items={mockItems}
          onToggleItem={jest.fn()}
          onAddItem={jest.fn()}
        />,
      );
    });

    const root = renderer!.root;
    expect(root.findAllByProps({ children: 'Essentials' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Passport' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Travel documents' }).length).toBeGreaterThan(0);
    expect(root.findByProps({ testID: 'add-item-btn-cat-essentials' })).toBeDefined();
  });

  test('tapping + Add Item reveals inline input row and notifies parent with onFocusInput', () => {
    const mockFocusInput = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <PackingCategoryCard
          category={mockCategory}
          items={mockItems}
          onToggleItem={jest.fn()}
          onAddItem={jest.fn()}
          onFocusInput={mockFocusInput}
        />,
      );
    });

    const root = renderer!.root;
    const addItemBtn = root.findByProps({ testID: 'add-item-btn-cat-essentials' });

    // Tap + Add Item
    ReactTestRenderer.act(() => {
      addItemBtn.props.onPress();
    });

    // Inline input row should now be visible
    expect(root.findByProps({ testID: 'inline-add-row-cat-essentials' })).toBeDefined();
    expect(root.findByProps({ testID: 'inline-add-input-cat-essentials' })).toBeDefined();
    expect(mockFocusInput).toHaveBeenCalledWith('cat-essentials', expect.anything());
  });

  test('typing item name and pressing save calls onSaveNewItem and exits inline mode', () => {
    const mockSaveNewItem = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <PackingCategoryCard
          category={mockCategory}
          items={mockItems}
          onToggleItem={jest.fn()}
          onSaveNewItem={mockSaveNewItem}
        />,
      );
    });

    const root = renderer!.root;
    const addItemBtn = root.findByProps({ testID: 'add-item-btn-cat-essentials' });

    // Open inline input
    ReactTestRenderer.act(() => {
      addItemBtn.props.onPress();
    });

    const textInput = root.findByProps({ testID: 'inline-add-input-cat-essentials' });
    ReactTestRenderer.act(() => {
      textInput.props.onChangeText('Universal adapter');
    });

    const saveBtn = root.findByProps({ testID: 'inline-add-save-cat-essentials' });
    ReactTestRenderer.act(() => {
      saveBtn.props.onPress();
    });

    expect(mockSaveNewItem).toHaveBeenCalledWith('cat-essentials', 'Universal adapter');
    // Inline row is closed and + Add Item button reappears
    expect(root.findByProps({ testID: 'add-item-btn-cat-essentials' })).toBeDefined();
  });

  test('tapping cancel button clears input and restores + Add Item row', () => {
    const mockBlurInput = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <PackingCategoryCard
          category={mockCategory}
          items={mockItems}
          onToggleItem={jest.fn()}
          onAddItem={jest.fn()}
          onBlurInput={mockBlurInput}
        />,
      );
    });

    const root = renderer!.root;
    // Open inline input
    ReactTestRenderer.act(() => {
      root.findByProps({ testID: 'add-item-btn-cat-essentials' }).props.onPress();
    });

    // Tap cancel
    const cancelBtn = root.findByProps({ testID: 'inline-add-cancel-cat-essentials' });
    ReactTestRenderer.act(() => {
      cancelBtn.props.onPress();
    });

    expect(root.findAll((node) => node.props.testID === 'inline-add-row-cat-essentials').length).toBe(0);
    expect(root.findByProps({ testID: 'add-item-btn-cat-essentials' })).toBeDefined();
    expect(mockBlurInput).toHaveBeenCalled();
  });

  test('header + Add button also activates inline add mode', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <PackingCategoryCard
          category={mockCategory}
          items={mockItems}
          onToggleItem={jest.fn()}
          onAddItem={jest.fn()}
        />,
      );
    });

    const root = renderer!.root;
    const headerAddBtn = root.findByProps({ testID: 'header-add-btn-cat-essentials' });
    ReactTestRenderer.act(() => {
      headerAddBtn.props.onPress({ stopPropagation: jest.fn() });
    });

    expect(root.findByProps({ testID: 'inline-add-row-cat-essentials' })).toBeDefined();
  });
});
