import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import CreateGroupScreen, {
  getInitialSelectedCategories,
  GROUP_CATEGORIES,
} from './CreateGroupScreen';
import EditGroupScreen from './EditGroupScreen';
import { groupStore } from '../data/groupStore';
import { subscriptionStore } from '../../profile/data/subscriptionStore';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
let mockRouteParams: any = {};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
  }),
  useRoute: () => ({
    params: mockRouteParams,
  }),
}));

jest.mock('../../profile/data/subscriptionStore', () => ({
  useSubscription: () => ({ plan: 'free', isPremium: false }),
  subscriptionStore: { reset: jest.fn() },
}));

describe('EditGroupScreen / CreateGroupScreen Multi-Category Selection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    groupStore.reset();
    subscriptionStore.reset();
    mockRouteParams = {};
  });

  describe('getInitialSelectedCategories helper', () => {
    it('defaults to ["Adventure"] when no existing group is provided', () => {
      expect(getInitialSelectedCategories(undefined)).toEqual(['Adventure']);
    });

    it('preselects all saved categories for a group with multiple categories', () => {
      const existingGroup = {
        categories: ['adventure', 'culture', 'food'],
        tags: ['Adventure', 'Culture', 'Food'],
        categoryLabel: 'ADVENTURE',
      };
      const preselected = getInitialSelectedCategories(existingGroup);
      expect(preselected).toEqual(['Adventure', 'Culture', 'Food']);
    });

    it('preselects newly supported categories like Hiking and Photography', () => {
      const existingGroup = {
        categories: ['hiking', 'photography', 'nature'],
        tags: ['Hiking', 'Photography', 'Nature'],
      };
      const preselected = getInitialSelectedCategories(existingGroup);
      expect(preselected).toEqual(['Nature', 'Hiking', 'Photography']);
    });
  });

  describe('Component UI & Multi-select Interactions', () => {
    it('renders all 9 category options in the Edit Group screen', () => {
      mockRouteParams = { groupId: 'group-paris' };
      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<EditGroupScreen />);
      });

      const root = renderer!.root;
      GROUP_CATEGORIES.forEach(({ name }) => {
        const testId = `category-chip-${name.toLowerCase().replace(/\s+/g, '-')}`;
        const chip = root.findByProps({ testID: testId });
        expect(chip).toBeDefined();
      });
    });

    it('preselects existing group categories when editing', () => {
      // group-paris has categories: ['adventure', 'culture', 'food']
      mockRouteParams = { groupId: 'group-paris' };
      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<CreateGroupScreen />);
      });

      const root = renderer!.root;

      // Adventure, Culture, and Food should be checked
      const adventureChip = root.findByProps({ testID: 'category-chip-adventure' });
      const cultureChip = root.findByProps({ testID: 'category-chip-culture' });
      const foodChip = root.findByProps({ testID: 'category-chip-food' });
      const beachChip = root.findByProps({ testID: 'category-chip-beach' });

      expect(adventureChip.props.accessibilityState.checked).toBe(true);
      expect(cultureChip.props.accessibilityState.checked).toBe(true);
      expect(foodChip.props.accessibilityState.checked).toBe(true);
      expect(beachChip.props.accessibilityState.checked).toBe(false);
    });

    it('toggles category on and off without clearing other selections', () => {
      mockRouteParams = { groupId: 'group-paris' };
      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<CreateGroupScreen />);
      });

      const root = renderer!.root;
      const beachChip = root.findByProps({ testID: 'category-chip-beach' });
      const adventureChip = root.findByProps({ testID: 'category-chip-adventure' });

      // Tap beach -> should be added, adventure should remain selected
      ReactTestRenderer.act(() => {
        beachChip.props.onPress();
      });

      expect(root.findByProps({ testID: 'category-chip-beach' }).props.accessibilityState.checked).toBe(true);
      expect(root.findByProps({ testID: 'category-chip-adventure' }).props.accessibilityState.checked).toBe(true);

      // Tap adventure -> should be deselected, beach remains selected
      ReactTestRenderer.act(() => {
        adventureChip.props.onPress();
      });

      expect(root.findByProps({ testID: 'category-chip-adventure' }).props.accessibilityState.checked).toBe(false);
      expect(root.findByProps({ testID: 'category-chip-beach' }).props.accessibilityState.checked).toBe(true);
    });

    it('validates and rejects save when no categories are selected', () => {
      mockRouteParams = { groupId: 'group-paris' };
      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<CreateGroupScreen />);
      });

      const root = renderer!.root;

      // Deselect all 3 preselected categories
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'category-chip-adventure' }).props.onPress();
        root.findByProps({ testID: 'category-chip-culture' }).props.onPress();
        root.findByProps({ testID: 'category-chip-food' }).props.onPress();
      });

      // Press save
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'group-save-btn' }).props.onPress();
      });

      // Validation error must be visible
      const errorText = root.findByProps({ testID: 'category-error-text' });
      expect(errorText.props.children).toBe('Please select at least one category');
      expect(mockGoBack).not.toHaveBeenCalled();
    });

    it('clears category error once a category is tapped', () => {
      mockRouteParams = { groupId: 'group-paris' };
      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<CreateGroupScreen />);
      });

      const root = renderer!.root;

      // Deselect all 3
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'category-chip-adventure' }).props.onPress();
        root.findByProps({ testID: 'category-chip-culture' }).props.onPress();
        root.findByProps({ testID: 'category-chip-food' }).props.onPress();
      });

      // Trigger validation error
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'group-save-btn' }).props.onPress();
      });

      expect(root.findByProps({ testID: 'category-error-text' })).toBeDefined();

      // Tap Hiking
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'category-chip-hiking' }).props.onPress();
      });

      // Error should now be gone
      expect(root.findAllByProps({ testID: 'category-error-text' }).length).toBe(0);
    });

    it('saves updated categories and fields to store and navigates back', () => {
      mockRouteParams = { groupId: 'group-paris' };
      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<CreateGroupScreen />);
      });

      const root = renderer!.root;

      // Add Hiking and Photography
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'category-chip-hiking' }).props.onPress();
        root.findByProps({ testID: 'category-chip-photography' }).props.onPress();
      });

      // Press save
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'group-save-btn' }).props.onPress();
      });

      expect(mockGoBack).toHaveBeenCalledTimes(1);

      // Verify groupStore has updated categories
      const paris = groupStore.getGroupById('group-paris');
      expect(paris?.categories).toContain('hiking');
      expect(paris?.categories).toContain('photography');
      expect(paris?.categories).toContain('adventure');
      expect(paris?.tags).toContain('Hiking');
      expect(paris?.tags).toContain('Photography');
    });

    it('edits group visibility and KYC requirement', () => {
      mockRouteParams = { groupId: 'group-paris' };
      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<CreateGroupScreen />);
      });

      const root = renderer!.root;
      expect(
        root.findByProps({ testID: 'visibility-public' }).props.accessibilityState
          .selected,
      ).toBe(true);
      expect(root.findByProps({ testID: 'requires-kyc-switch' }).props.value).toBe(
        true,
      );

      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'visibility-private' }).props.onPress();
        root.findByProps({ testID: 'requires-kyc-switch' }).props.onValueChange(false);
      });
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'group-save-btn' }).props.onPress();
      });

      const paris = groupStore.getGroupById('group-paris');
      expect(paris?.visibility).toBe('private');
      expect(paris?.requiresKyc).toBe(false);
    });

    it('shows the upgrade prompt when a free user reaches the create limit', () => {
      groupStore.createGroup({ name: 'Created Group One' });
      groupStore.createGroup({ name: 'Created Group Two' });
      mockRouteParams = {};

      let renderer: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(<CreateGroupScreen />);
      });

      const root = renderer!.root;
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'group-name-input' }).props.onChangeText(
          'Blocked Third Group',
        );
      });
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'group-save-btn' }).props.onPress();
      });

      expect(
        root.findAllByProps({ children: 'Group creation limit reached' }).length,
      ).toBeGreaterThan(0);
      expect(groupStore.getCreatedGroupCount()).toBe(2);
      expect(mockGoBack).not.toHaveBeenCalled();
    });
  });
});
