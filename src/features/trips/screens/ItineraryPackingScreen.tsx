import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Plus,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Briefcase,
  Shirt,
  Camera,
  Layers,
  Heart,
  FileText,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { SkeletonBlock } from '../../../core/components/SkeletonBlock';
import { EmptyState } from '../../../core/components/EmptyState';
import { ErrorState } from '../../../core/components/ErrorState';
import { ConfirmationModal } from '../../../core/components/ConfirmationModal';
import { TimelineItem } from '../types/itineraryPackingTypes';
import { useItineraryDays } from '../hooks/useItineraryDays';
import { AppColors } from '../../../core/theme/colors';
import {
  ItineraryPackingHeader,
  ItineraryPackingTab,
} from '../components/ItineraryPackingHeader';
import {
  PackingCategoryCard,
  CategoryIconType,
} from '../components/PackingCategoryCard';
import { PackingProgressBanner } from '../components/PackingProgressBanner';
import { PackingHeroIllustration } from '../components/PackingHeroIllustration';
import { ItineraryDaySelector } from '../components/ItineraryDaySelector';
import { ItineraryTimelineItem } from '../components/ItineraryTimelineItem';
import { ItineraryDayRouteMap } from '../components/ItineraryDayRouteMap';
import {
  usePackingState,
  itineraryStore,
  PackingCategoryRecord,
  PackingItemRecord,
} from '../data/itineraryStore';
import { formatDateRange } from '../utils/itineraryFormatting';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function SkeletonTimelineItem() {
  return (
    <View style={styles.skeletonRow}>
      <SkeletonBlock style={styles.skeletonDot} />
      <View style={styles.skeletonTextBlock}>
        <SkeletonBlock style={styles.skeletonTime} />
        <SkeletonBlock style={styles.skeletonTitle} />
        <SkeletonBlock style={styles.skeletonSubtitle} />
      </View>
    </View>
  );
}

export default function ItineraryPackingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'ItineraryView'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'ItineraryView' | 'PackingList'>>();
  const tripId = route.params?.tripId || '1';

  const [activeTab, setActiveTab] = useState<ItineraryPackingTab>(
    route.name === 'PackingList' ? 'packing' : 'itinerary',
  );

  const {
    days,
    isLoading: isDaysLoading,
    isError: isDaysError,
    retry: retryDays,
    deleteActivity,
    duplicateActivity,
    updateActivity,
  } = useItineraryDays(tripId);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const safeDayIndex = Math.min(selectedDayIndex, Math.max(0, days.length - 1));
  const selectedDay = days[safeDayIndex];

  const trip = itineraryStore.getItineraryById(tripId);
  const tripDates =
    trip?.startDate && trip?.endDate
      ? formatDateRange(trip.startDate, trip.endDate)
      : trip?.dates
      ? formatDateRange(trip.dates)
      : undefined;
  const tripTitle = trip?.customName || trip?.title || 'My Itinerary';

  // Selected stop/activity on map & timeline synchronization
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // Timeline Activity Menu & Edit/Delete State
  const [menuActivity, setMenuActivity] = useState<TimelineItem | null>(null);
  const [editingActivity, setEditingActivity] = useState<TimelineItem | null>(null);
  const [editActivityTitle, setEditActivityTitle] = useState('');
  const [editActivityTime, setEditActivityTime] = useState('');
  const [editActivitySubtitle, setEditActivitySubtitle] = useState('');
  const [editActivityLocation, setEditActivityLocation] = useState('');
  const [editActivityDuration, setEditActivityDuration] = useState('');
  const [activityToDelete, setActivityToDelete] = useState<TimelineItem | null>(null);

  /* ── ITINERARY STORE (PACKING STATE) ───────────────────────────────── */
  const {
    categories,
    items,
    progress,
    togglePackingItem,
    addPackingItem,
    updatePackingItem,
    deletePackingItem,
    addPackingCategory,
    renamePackingCategory,
    deletePackingCategory,
  } = usePackingState(tripId);

  /* ── MODALS STATE (ITEMS) ───────────────────────────────────────────── */
  // 1. Add Item Modal
  const [addItemCategory, setAddItemCategory] = useState<PackingCategoryRecord | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [itemFormError, setItemFormError] = useState<string | null>(null);
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);

  // 2. Item Actions Menu
  const [selectedItemForMenu, setSelectedItemForMenu] = useState<PackingItemRecord | null>(null);

  // 3. Edit Item Modal
  const [editingItem, setEditingItem] = useState<PackingItemRecord | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemNotes, setEditItemNotes] = useState('');
  const [editItemError, setEditItemError] = useState<string | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // 4. Delete Item Confirmation
  const [itemToDelete, setItemToDelete] = useState<PackingItemRecord | null>(null);

  /* ── MODALS STATE (CATEGORIES) ──────────────────────────────────────── */
  // 1. Add Category Modal
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState<CategoryIconType>('general');
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  // 2. Category Actions Menu (Custom Categories)
  const [selectedCategoryForMenu, setSelectedCategoryForMenu] = useState<PackingCategoryRecord | null>(null);

  // 3. Rename Category Modal
  const [renamingCategory, setRenamingCategory] = useState<PackingCategoryRecord | null>(null);
  const [renameCategoryName, setRenameCategoryName] = useState('');
  const [renameCategoryError, setRenameCategoryError] = useState<string | null>(null);
  const [isSubmittingRename, setIsSubmittingRename] = useState(false);

  // 4. Delete Category Confirmation
  const [categoryToDelete, setCategoryToDelete] = useState<PackingCategoryRecord | null>(null);

  const switchTab = (tab: ItineraryPackingTab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  /* ── TIMELINE ACTIVITY ACTIONS ──────────────────────────────────────── */
  const handleActivityPress = (item: TimelineItem) => {
    if (item.type === 'activity') {
      navigation.navigate('PlaceDetails', {
        placeId: item.id,
        placeName: item.title,
      });
    }
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete' | 'duplicate') => {
    if (!menuActivity) return;
    const current = menuActivity;
    setMenuActivity(null);

    if (action === 'view') {
      navigation.navigate('PlaceDetails', {
        placeId: current.id,
        placeName: current.title,
      });
    } else if (action === 'edit') {
      setEditingActivity(current);
      setEditActivityTitle(current.title);
      setEditActivityTime(current.time);
      setEditActivitySubtitle(current.subtitle);
      setEditActivityLocation(current.location || '');
      setEditActivityDuration(current.duration || '');
    } else if (action === 'duplicate') {
      duplicateActivity(selectedDayIndex, current);
    } else if (action === 'delete') {
      setActivityToDelete(current);
    }
  };

  const handleSaveEditActivity = () => {
    if (!editingActivity || !editActivityTitle.trim()) return;
    updateActivity(selectedDayIndex, {
      ...editingActivity,
      title: editActivityTitle.trim(),
      time: editActivityTime.trim() || editingActivity.time,
      subtitle: editActivitySubtitle.trim() || editingActivity.subtitle,
      location: editActivityLocation.trim() || undefined,
      duration: editActivityDuration.trim() || undefined,
    });
    setEditingActivity(null);
  };

  /* ── ITEM HANDLERS ─────────────────────────────────────────────────── */
  const handleOpenAddItem = (categoryId: string) => {
    const targetCat = categories.find((c) => c.id === categoryId) || null;
    setAddItemCategory(targetCat);
    setNewItemName('');
    setNewItemNotes('');
    setItemFormError(null);
  };

  const handleSaveNewItem = () => {
    if (!addItemCategory || isSubmittingItem) return;

    const trimmed = newItemName.trim();
    if (!trimmed) {
      setItemFormError('Please enter an item name');
      return;
    }

    setIsSubmittingItem(true);
    addPackingItem(addItemCategory.id, trimmed, newItemNotes.trim() || undefined);
    setIsSubmittingItem(false);
    setAddItemCategory(null);
  };

  const handleOpenEditItem = (item: PackingItemRecord) => {
    setSelectedItemForMenu(null);
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemNotes(item.notes || '');
    setEditItemError(null);
  };

  const handleSaveEditItem = () => {
    if (!editingItem || isSubmittingEdit) return;

    const trimmed = editItemName.trim();
    if (!trimmed) {
      setEditItemError('Item name cannot be empty');
      return;
    }

    setIsSubmittingEdit(true);
    updatePackingItem(editingItem.id, {
      name: trimmed,
      notes: editItemNotes.trim() || undefined,
    });
    setIsSubmittingEdit(false);
    setEditingItem(null);
  };

  /* ── CATEGORY HANDLERS ─────────────────────────────────────────────── */
  const handleSaveNewCategory = () => {
    if (isSubmittingCategory) return;

    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryFormError('Please enter a category name');
      return;
    }

    const isDuplicate = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      setCategoryFormError('A category with this name already exists');
      return;
    }

    setIsSubmittingCategory(true);
    addPackingCategory(trimmed, newCategoryIcon);
    setIsSubmittingCategory(false);
    setIsAddCategoryVisible(false);
    setNewCategoryName('');
    setCategoryFormError(null);
  };

  const handleOpenRenameCategory = (category: PackingCategoryRecord) => {
    setSelectedCategoryForMenu(null);
    setRenamingCategory(category);
    setRenameCategoryName(category.name);
    setRenameCategoryError(null);
  };

  const handleSaveRenameCategory = () => {
    if (!renamingCategory || isSubmittingRename) return;

    const trimmed = renameCategoryName.trim();
    if (!trimmed) {
      setRenameCategoryError('Category name cannot be empty');
      return;
    }

    const isDuplicate = categories.some(
      (c) =>
        c.id !== renamingCategory.id &&
        c.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      setRenameCategoryError('A category with this name already exists');
      return;
    }

    setIsSubmittingRename(true);
    renamePackingCategory(renamingCategory.id, trimmed);
    setIsSubmittingRename(false);
    setRenamingCategory(null);
  };

  const itemsInCategoryToDelete = categoryToDelete
    ? items.filter((i) => i.categoryId === categoryToDelete.id).length
    : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ── HEADER WITH TABS ──────────────────────────────────────── */}
      <ItineraryPackingHeader
        activeTab={activeTab}
        onSelectTab={switchTab}
        onClose={() => navigation.goBack()}
        title={tripTitle}
        subtitle={tripDates}
      />

      {/* ── TAB 1: ITINERARY (DAY-WISE VIEW) ──────────────────────── */}
      {activeTab === 'itinerary' && (
        <View style={styles.flexOne}>
          {isDaysError ? (
            <ErrorState
              message="We couldn't load your itinerary. Try again."
              onRetry={retryDays}
            />
          ) : isDaysLoading ? (
            <ScrollView contentContainerStyle={styles.timelineContent}>
              <SkeletonTimelineItem />
              <SkeletonTimelineItem />
              <SkeletonTimelineItem />
            </ScrollView>
          ) : days.length === 0 ? (
            <EmptyState
              icon="🗺️"
              message="Your itinerary is empty. Start planning your trip."
            />
          ) : (
            <>
              {/* Day Selector */}
              <ItineraryDaySelector
                days={days}
                selectedIndex={safeDayIndex}
                onSelectIndex={(index) => {
                  setSelectedDayIndex(index);
                  setSelectedActivityId(null);
                }}
              />

              {/* Day Route Map & Timeline Content */}
              <ScrollView
                contentContainerStyle={styles.timelineContent}
                showsVerticalScrollIndicator={false}
              >
                {/* ── DEDICATED DAY ROUTE MAP ── */}
                <ItineraryDayRouteMap
                  dayNumber={safeDayIndex + 1}
                  dayLabel={selectedDay?.dayLabel || `Day ${safeDayIndex + 1}`}
                  items={selectedDay?.items || []}
                  selectedStopId={selectedActivityId}
                  onSelectStop={(stopId) => setSelectedActivityId(stopId)}
                  onExpandMap={() =>
                    navigation.navigate('ItineraryMap', {
                      tripId,
                      day: safeDayIndex + 1,
                    } as any)
                  }
                />

                {/* ── DAILY TIMELINE SECTION HEADER ── */}
                <View style={styles.timelineSectionHeader}>
                  <Text style={styles.timelineSectionTitle}>
                    Daily Timeline & Stops
                  </Text>
                  <Text style={styles.timelineSectionSubtitle}>
                    {selectedDay?.dateLabel ? `${selectedDay.dateLabel} · ` : ''}
                    {selectedDay?.items?.filter((i) => i.type === 'activity')
                      .length || 0}{' '}
                    activities scheduled
                  </Text>
                </View>

                {/* ── ACTIVITY TIMELINE ── */}
                {!selectedDay || selectedDay.items.length === 0 ? (
                  <EmptyState
                    icon="🗺️"
                    message="No activities scheduled for this day."
                  />
                ) : (
                  (() => {
                    let seq = 1;
                    const geocodedSequenceMap = new Map<string, number>();
                    selectedDay.items.forEach((item) => {
                      if (
                        item.type === 'activity' &&
                        typeof item.latitude === 'number' &&
                        typeof item.longitude === 'number'
                      ) {
                        geocodedSequenceMap.set(item.id, seq++);
                      }
                    });

                    return selectedDay.items.map((item, index) => (
                      <ItineraryTimelineItem
                        key={item.id}
                        item={item}
                        sequenceNumber={geocodedSequenceMap.get(item.id)}
                        isSelected={selectedActivityId === item.id}
                        isLast={index === selectedDay.items.length - 1}
                        onPress={() => {
                          setSelectedActivityId(item.id);
                          handleActivityPress(item);
                        }}
                        onMenuPress={() => setMenuActivity(item)}
                      />
                    ));
                  })()
                )}

                {/* Inline Add Activity Button at list footer */}
                <TouchableOpacity
                  style={styles.inlineAddBtn}
                  onPress={() =>
                    navigation.navigate('AddPlaces', {
                      destination: 'Your Trip',
                      startDate: '',
                      endDate: '',
                      travelerType: 'couple',
                      adults: 2,
                      kids: 0,
                      purpose: 'Leisure',
                      primaryAge: 25,
                      travelStyle: 'Explore Everything',
                      tripId,
                    })
                  }
                  activeOpacity={0.8}
                  testID="inline-add-activity-btn"
                >
                  <Plus size={16} color={AppColors.primary} strokeWidth={2.5} />
                  <Text style={styles.inlineAddBtnText}>
                    + Add Activity to{' '}
                    {selectedDay?.dayLabel || `Day ${selectedDayIndex + 1}`}
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Bottom Floating Add Activity Button */}
              <TouchableOpacity
                style={styles.floatingAddBtn}
                onPress={() =>
                  navigation.navigate('AddPlaces', {
                    destination: 'Your Trip',
                    startDate: '',
                    endDate: '',
                    travelerType: 'couple',
                    adults: 2,
                    kids: 0,
                    purpose: 'Leisure',
                    primaryAge: 25,
                    travelStyle: 'Explore Everything',
                    tripId,
                  })
                }
                activeOpacity={0.88}
              >
                <Plus size={18} color={AppColors.white} strokeWidth={2.5} />
                <Text style={styles.floatingAddBtnText}>Add Activity</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* ── TAB 2: PACKING LIST ────────────────────────────────────── */}
      {activeTab === 'packing' && (
        <ScrollView
          contentContainerStyle={styles.packingScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Packing Hero Banner */}
          <View style={styles.packingHero}>
            <View style={styles.packingHeroTextCol}>
              <Text style={styles.packingHeroTitle}>Packing List</Text>
              <Text style={styles.packingHeroSubtitle}>
                Get ready for a hassle-free trip with{'\n'}customizable checklists & tracking.
              </Text>
            </View>
            <PackingHeroIllustration />
          </View>

          {/* ── COMPLETION & PROGRESS BANNER (REPLACES OLD AI BANNER) ── */}
          <PackingProgressBanner
            totalItems={progress.totalItems}
            packedItems={progress.packedItems}
            percentage={progress.percentage}
            motivationalMessage={progress.motivationalMessage}
          />

          {/* ── CATEGORY CARDS ───────────────────────────────────────── */}
          {categories.map((category) => {
            const categoryItems = items.filter((i) => i.categoryId === category.id);
            return (
              <PackingCategoryCard
                key={category.id}
                category={category}
                items={categoryItems}
                onToggleItem={togglePackingItem}
                onAddItem={handleOpenAddItem}
                onItemMenuPress={(item) => setSelectedItemForMenu(item)}
                onCategoryMenuPress={(cat) => setSelectedCategoryForMenu(cat)}
              />
            );
          })}

          {/* ── ADD CUSTOM CATEGORY BUTTON ───────────────────────────── */}
          <TouchableOpacity
            style={styles.addCategoryCardBtn}
            onPress={() => {
              setNewCategoryName('');
              setNewCategoryIcon('general');
              setCategoryFormError(null);
              setIsAddCategoryVisible(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.addCategoryIconCircle}>
              <Plus size={18} color={AppColors.primary} strokeWidth={2.5} />
            </View>
            <View style={styles.addCategoryTextCol}>
              <Text style={styles.addCategoryTitle}>+ Add Custom Category</Text>
              <Text style={styles.addCategorySubtitle}>
                Medicines, Baby Essentials, Hiking Gear, Documents...
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ── MODAL 1: ADD ITEM MODAL ─────────────────────────────────── */}
      <Modal
        visible={!!addItemCategory}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddItemCategory(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheetCard}>
            <Text style={styles.modalSheetTitle}>
              Add Item to {addItemCategory?.name}
            </Text>
            <Text style={styles.modalSheetSubtitle}>
              Create a custom checklist item for your trip
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Item Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Hiking boots, Power bank"
                placeholderTextColor={AppColors.textMuted}
                value={newItemName}
                onChangeText={(text) => {
                  setNewItemName(text);
                  if (itemFormError) setItemFormError(null);
                }}
                autoFocus={true}
              />
              {!!itemFormError && (
                <Text style={styles.errorText}>{itemFormError}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Pack in carry-on, 2 pairs"
                placeholderTextColor={AppColors.textMuted}
                value={newItemNotes}
                onChangeText={setNewItemNotes}
              />
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setAddItemCategory(null)}
              >
                <Text style={styles.modalSecondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalPrimaryBtn, isSubmittingItem && styles.btnDisabled]}
                onPress={handleSaveNewItem}
                disabled={isSubmittingItem}
              >
                <Text style={styles.modalPrimaryBtnText}>Save Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── MODAL 2: ITEM MENU (EDIT / REMOVE) ───────────────────────── */}
      <Modal
        visible={!!selectedItemForMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedItemForMenu(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedItemForMenu(null)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalHeader} numberOfLines={1}>
              {selectedItemForMenu?.name}
            </Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                if (selectedItemForMenu) handleOpenEditItem(selectedItemForMenu);
              }}
            >
              <Edit3 size={18} color={AppColors.textPrimary} />
              <Text style={styles.modalOptionText}>Edit Item Name & Notes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                const item = selectedItemForMenu;
                setSelectedItemForMenu(null);
                setItemToDelete(item);
              }}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.modalOptionText, { color: '#EF4444' }]}>
                Remove Item
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setSelectedItemForMenu(null)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── MODAL 3: EDIT ITEM MODAL ─────────────────────────────────── */}
      <Modal
        visible={!!editingItem}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditingItem(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheetCard}>
            <Text style={styles.modalSheetTitle}>Edit Packing Item</Text>
            <Text style={styles.modalSheetSubtitle}>
              Update item description and notes
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Item Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Sunglasses"
                placeholderTextColor={AppColors.textMuted}
                value={editItemName}
                onChangeText={(text) => {
                  setEditItemName(text);
                  if (editItemError) setEditItemError(null);
                }}
              />
              {!!editItemError && (
                <Text style={styles.errorText}>{editItemError}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Polarized pair in bag"
                placeholderTextColor={AppColors.textMuted}
                value={editItemNotes}
                onChangeText={setEditItemNotes}
              />
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setEditingItem(null)}
              >
                <Text style={styles.modalSecondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalPrimaryBtn, isSubmittingEdit && styles.btnDisabled]}
                onPress={handleSaveEditItem}
                disabled={isSubmittingEdit}
              >
                <Text style={styles.modalPrimaryBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── MODAL 4: DELETE ITEM CONFIRMATION ────────────────────────── */}
      <ConfirmationModal
        visible={!!itemToDelete}
        title="Delete Packing Item"
        message={`Are you sure you want to remove "${itemToDelete?.name}" from your checklist?`}
        confirmText="Delete"
        cancelText="Keep Item"
        isDestructive={true}
        onConfirm={() => {
          if (itemToDelete) {
            deletePackingItem(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
        onClose={() => setItemToDelete(null)}
      />

      {/* ── MODAL 5: ADD CATEGORY MODAL ──────────────────────────────── */}
      <Modal
        visible={isAddCategoryVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddCategoryVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheetCard}>
            <Text style={styles.modalSheetTitle}>New Packing Category</Text>
            <Text style={styles.modalSheetSubtitle}>
              Organize your checklist with a custom category
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Medicines, Photography, Baby Items"
                placeholderTextColor={AppColors.textMuted}
                value={newCategoryName}
                onChangeText={(text) => {
                  setNewCategoryName(text);
                  if (categoryFormError) setCategoryFormError(null);
                }}
                autoFocus={true}
              />
              {!!categoryFormError && (
                <Text style={styles.errorText}>{categoryFormError}</Text>
              )}
            </View>

            {/* Icon Picker Chips */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Icon</Text>
              <View style={styles.iconChipsRow}>
                {[
                  { type: 'medicines' as CategoryIconType, label: 'Health', Icon: Heart },
                  { type: 'documents' as CategoryIconType, label: 'Docs', Icon: FileText },
                  { type: 'essentials' as CategoryIconType, label: 'Essentials', Icon: Briefcase },
                  { type: 'clothing' as CategoryIconType, label: 'Clothing', Icon: Shirt },
                  { type: 'gadgets' as CategoryIconType, label: 'Gadgets', Icon: Camera },
                  { type: 'general' as CategoryIconType, label: 'General', Icon: Layers },
                ].map(({ type, label, Icon }) => {
                  const isSelected = newCategoryIcon === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.iconChip,
                        isSelected && styles.iconChipSelected,
                      ]}
                      onPress={() => setNewCategoryIcon(type)}
                      activeOpacity={0.7}
                    >
                      <Icon
                        size={16}
                        color={isSelected ? AppColors.white : AppColors.textPrimary}
                      />
                      <Text
                        style={[
                          styles.iconChipText,
                          isSelected && styles.iconChipTextSelected,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setIsAddCategoryVisible(false)}
              >
                <Text style={styles.modalSecondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalPrimaryBtn,
                  isSubmittingCategory && styles.btnDisabled,
                ]}
                onPress={handleSaveNewCategory}
                disabled={isSubmittingCategory}
              >
                <Text style={styles.modalPrimaryBtnText}>Create Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── MODAL 6: CUSTOM CATEGORY ACTIONS MENU ────────────────────── */}
      <Modal
        visible={!!selectedCategoryForMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedCategoryForMenu(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedCategoryForMenu(null)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalHeader} numberOfLines={1}>
              {selectedCategoryForMenu?.name} (Custom Category)
            </Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                if (selectedCategoryForMenu) {
                  handleOpenRenameCategory(selectedCategoryForMenu);
                }
              }}
            >
              <Edit3 size={18} color={AppColors.textPrimary} />
              <Text style={styles.modalOptionText}>Rename Category</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                const cat = selectedCategoryForMenu;
                setSelectedCategoryForMenu(null);
                setCategoryToDelete(cat);
              }}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.modalOptionText, { color: '#EF4444' }]}>
                Delete Category
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setSelectedCategoryForMenu(null)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── MODAL 7: RENAME CATEGORY MODAL ───────────────────────────── */}
      <Modal
        visible={!!renamingCategory}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRenamingCategory(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheetCard}>
            <Text style={styles.modalSheetTitle}>Rename Category</Text>
            <Text style={styles.modalSheetSubtitle}>
              All items inside will remain safely intact
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Category name"
                placeholderTextColor={AppColors.textMuted}
                value={renameCategoryName}
                onChangeText={(text) => {
                  setRenameCategoryName(text);
                  if (renameCategoryError) setRenameCategoryError(null);
                }}
                autoFocus={true}
              />
              {!!renameCategoryError && (
                <Text style={styles.errorText}>{renameCategoryError}</Text>
              )}
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setRenamingCategory(null)}
              >
                <Text style={styles.modalSecondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalPrimaryBtn,
                  isSubmittingRename && styles.btnDisabled,
                ]}
                onPress={handleSaveRenameCategory}
                disabled={isSubmittingRename}
              >
                <Text style={styles.modalPrimaryBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── MODAL 8: DELETE CATEGORY CONFIRMATION ────────────────────── */}
      <ConfirmationModal
        visible={!!categoryToDelete}
        title="Delete Category?"
        message={
          itemsInCategoryToDelete > 0
            ? `This will remove "${categoryToDelete?.name}" and all ${itemsInCategoryToDelete} packing item(s) inside it.`
            : `Are you sure you want to remove "${categoryToDelete?.name}"?`
        }
        confirmText="Delete Category"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (categoryToDelete) {
            deletePackingCategory(categoryToDelete.id);
            setCategoryToDelete(null);
          }
        }}
        onClose={() => setCategoryToDelete(null)}
      />

      {/* ── TIMELINE ACTIVITY MENU MODAL ────────────────────────────── */}
      <Modal
        visible={!!menuActivity}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuActivity(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuActivity(null)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalHeader} numberOfLines={1}>
              {menuActivity?.title}
            </Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMenuAction('view')}
            >
              <Eye size={18} color={AppColors.primary} />
              <Text style={styles.modalOptionText}>View Place Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMenuAction('edit')}
            >
              <Edit3 size={18} color={AppColors.textPrimary} />
              <Text style={styles.modalOptionText}>Edit Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMenuAction('duplicate')}
            >
              <Copy size={18} color={AppColors.textPrimary} />
              <Text style={styles.modalOptionText}>Duplicate Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMenuAction('delete')}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.modalOptionText, { color: '#EF4444' }]}>
                Delete Activity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setMenuActivity(null)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── EDIT ACTIVITY MODAL ────────────────────────────── */}
      <Modal
        visible={!!editingActivity}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditingActivity(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheetCard}>
            <Text style={styles.modalSheetTitle}>Edit Activity</Text>
            <Text style={styles.modalSheetSubtitle}>
              Update schedule and details for this activity
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Activity Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Sacred Monkey Forest"
                placeholderTextColor={AppColors.textMuted}
                value={editActivityTitle}
                onChangeText={setEditActivityTitle}
                autoFocus={true}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Scheduled Time</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 09:00 AM"
                placeholderTextColor={AppColors.textMuted}
                value={editActivityTime}
                onChangeText={setEditActivityTime}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description / Notes</Text>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                placeholder="Short description or notes"
                placeholderTextColor={AppColors.textMuted}
                value={editActivitySubtitle}
                onChangeText={setEditActivitySubtitle}
                multiline={true}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Ubud, Bali"
                placeholderTextColor={AppColors.textMuted}
                value={editActivityLocation}
                onChangeText={setEditActivityLocation}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duration</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 2 hrs"
                placeholderTextColor={AppColors.textMuted}
                value={editActivityDuration}
                onChangeText={setEditActivityDuration}
              />
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setEditingActivity(null)}
              >
                <Text style={styles.modalSecondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalPrimaryBtn,
                  !editActivityTitle.trim() && styles.btnDisabled,
                ]}
                onPress={handleSaveEditActivity}
                disabled={!editActivityTitle.trim()}
              >
                <Text style={styles.modalPrimaryBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── DELETE ACTIVITY CONFIRMATION ────────────────────────────── */}
      <ConfirmationModal
        visible={!!activityToDelete}
        title="Delete Activity?"
        message={`Are you sure you want to remove "${activityToDelete?.title}" from Day ${selectedDayIndex + 1}?`}
        confirmText="Delete Activity"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (activityToDelete) {
            deleteActivity(selectedDayIndex, activityToDelete.id);
            setActivityToDelete(null);
            if (selectedActivityId === activityToDelete.id) {
              setSelectedActivityId(null);
            }
          }
        }}
        onClose={() => setActivityToDelete(null)}
      />

      {/* Bottom Nav Bar */}
      <BottomNavBar active="trips" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  flexOne: {
    flex: 1,
  },

  /* ── Itinerary Timeline ── */
  timelineContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  timelineSectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  timelineSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  timelineSectionSubtitle: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  inlineAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 20,
  },
  inlineAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primary,
  },
  notesInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  floatingAddBtn: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 28,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingAddBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.white,
  },

  /* ── Packing List ── */
  packingScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  packingHero: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 84,
    marginBottom: 16,
  },
  packingHeroTextCol: {
    flex: 1,
    paddingRight: 100,
  },
  packingHeroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  packingHeroSubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 18,
  },

  /* Add Custom Category Card Button */
  addCategoryCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    padding: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  addCategoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCategoryTextCol: {
    flex: 1,
  },
  addCategoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.primary,
  },
  addCategorySubtitle: {
    fontSize: 11,
    color: AppColors.textSecondary,
    marginTop: 2,
  },

  /* ── Form Modals (Bottom Sheets) ── */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  modalSheetSubtitle: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FAF7F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.accent,
    marginTop: 4,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalSecondaryBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F1ECE4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  modalPrimaryBtn: {
    flex: 1.5,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.white,
  },
  btnDisabled: {
    opacity: 0.6,
  },

  /* Icon selection chips */
  iconChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  iconChipSelected: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  iconChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  iconChipTextSelected: {
    color: AppColors.white,
  },

  /* ── Skeletons ── */
  skeletonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  skeletonDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
    marginTop: 6,
  },
  skeletonTextBlock: {
    flex: 1,
  },
  skeletonTime: {
    width: 60,
    height: 12,
    marginBottom: 6,
    borderRadius: 4,
  },
  skeletonTitle: {
    width: '75%',
    height: 16,
    marginBottom: 6,
    borderRadius: 4,
  },
  skeletonSubtitle: {
    width: '50%',
    height: 12,
    borderRadius: 4,
  },

  /* ── Action Menu Modals ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textMuted,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  modalCancelBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
});