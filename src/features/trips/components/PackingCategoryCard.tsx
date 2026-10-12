import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {
  Briefcase,
  Shirt,
  Camera,
  Layers,
  Heart,
  FileText,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  MoreVertical,
} from 'lucide-react-native';
import {
  PackingCategoryRecord,
  PackingItemRecord,
  CategoryIconType,
} from '../data/itineraryStore';
import { AppColors } from '../../../core/theme/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type { CategoryIconType };

export interface PackingCategoryCardProps {
  category?: PackingCategoryRecord;
  title?: string;
  subtitle?: string;
  iconType?: CategoryIconType;
  items: PackingItemRecord[];
  onToggleItem: (id: string) => void;
  onAddItem?: (categoryId: string) => void;
  onItemMenuPress?: (item: PackingItemRecord) => void;
  onCategoryMenuPress?: (category: PackingCategoryRecord) => void;
  defaultExpanded?: boolean;
}

export const PackingCategoryCard: React.FC<PackingCategoryCardProps> = ({
  category,
  title,
  subtitle,
  iconType,
  items,
  onToggleItem,
  onAddItem,
  onItemMenuPress,
  onCategoryMenuPress,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const effectiveTitle = category ? category.name : title || 'Category';
  const effectiveSubtitle = category ? category.subtitle || '' : subtitle || '';
  const effectiveIconType: CategoryIconType = category ? category.iconType : iconType || 'general';
  const categoryId = category ? category.id : 'default-cat';
  const isCustom = category?.origin === 'custom';

  const completedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const getCategoryIcon = (type: CategoryIconType) => {
    switch (type) {
      case 'essentials':
        return <Briefcase size={22} color={AppColors.primary} strokeWidth={2.2} />;
      case 'clothing':
        return <Shirt size={22} color={AppColors.primary} strokeWidth={2.2} />;
      case 'gadgets':
        return <Camera size={22} color={AppColors.primary} strokeWidth={2.2} />;
      case 'medicines':
        return <Heart size={22} color={AppColors.primary} strokeWidth={2.2} />;
      case 'documents':
        return <FileText size={22} color={AppColors.primary} strokeWidth={2.2} />;
      default:
        return <Layers size={22} color={AppColors.primary} strokeWidth={2.2} />;
    }
  };

  const getItemEmoji = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('passport')) return '🛂';
    if (lower.includes('document') || lower.includes('ticket')) return '📄';
    if (lower.includes('swimwear') || lower.includes('swim')) return '🩱';
    if (lower.includes('sandal') || lower.includes('shoe')) return '🩴';
    if (lower.includes('jacket') || lower.includes('rain')) return '🧥';
    if (lower.includes('camera') || lower.includes('photo')) return '📷';
    if (lower.includes('sunscreen') || lower.includes('lotion')) return '🧴';
    if (lower.includes('sarong') || lower.includes('temple')) return '🧣';
    if (lower.includes('insect') || lower.includes('repellent')) return '🦟';
    if (lower.includes('adapter') || lower.includes('power') || lower.includes('charger'))
      return '🔌';
    if (lower.includes('medicine') || lower.includes('pill') || lower.includes('first aid'))
      return '💊';
    return '🎒';
  };

  return (
    <View style={styles.cardContainer}>
      {/* ── CATEGORY HEADER ────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={toggleExpand}
        activeOpacity={0.75}
      >
        {/* Left Icon */}
        <View style={styles.iconCircle}>{getCategoryIcon(effectiveIconType)}</View>

        {/* Middle: Title & Subtitle */}
        <View style={styles.headerTextWrap}>
          <Text style={styles.categoryTitle}>{effectiveTitle}</Text>
          {!!effectiveSubtitle && (
            <Text style={styles.categorySubtitle} numberOfLines={1}>
              {effectiveSubtitle}
            </Text>
          )}
        </View>

        {/* Right Actions: Header Add, Counter, Custom Menu, Chevron */}
        <View style={styles.headerRightWrap}>
          {onAddItem && (
            <TouchableOpacity
              style={styles.headerAddBtn}
              onPress={(e) => {
                e.stopPropagation();
                onAddItem(categoryId);
              }}
              activeOpacity={0.75}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Plus size={13} color={AppColors.primary} strokeWidth={2.6} />
              <Text style={styles.headerAddBtnText}>Add</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.counterText}>
            {completedCount}/{totalCount}
          </Text>

          {isCustom && onCategoryMenuPress && (
            <TouchableOpacity
              style={styles.categoryMenuBtn}
              onPress={(e) => {
                e.stopPropagation();
                if (category) onCategoryMenuPress(category);
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MoreVertical size={18} color={AppColors.textSecondary} />
            </TouchableOpacity>
          )}

          {expanded ? (
            <ChevronUp size={20} color={AppColors.textSecondary} strokeWidth={2.5} />
          ) : (
            <ChevronDown size={20} color={AppColors.textSecondary} strokeWidth={2.5} />
          )}
        </View>
      </TouchableOpacity>

      {/* ── EXPANDABLE ITEMS LIST ──────────────────────────────────── */}
      {expanded && (
        <View style={styles.itemsListContainer}>
          {items.map((item) => {
            const isChecked = item.checked;
            const emoji = getItemEmoji(item.name);

            return (
              <View
                key={item.id}
                style={[styles.itemRow, isChecked && styles.itemRowChecked]}
              >
                {/* Left Tap Target: Checkbox, Emoji, Name & Notes */}
                <TouchableOpacity
                  style={styles.itemToggleArea}
                  onPress={() => onToggleItem(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                    {isChecked && (
                      <Check size={14} color={AppColors.white} strokeWidth={3} />
                    )}
                  </View>

                  <Text style={styles.itemEmoji}>{emoji}</Text>

                  <View style={styles.itemNameCol}>
                    <Text
                      style={[styles.itemName, isChecked && styles.itemNameChecked]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    {!!item.notes && (
                      <Text
                        style={[styles.itemNotes, isChecked && styles.itemNotesChecked]}
                        numberOfLines={1}
                      >
                        {item.notes}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Right Actions: AI Badge & Item Menu */}
                <View style={styles.itemRightActions}>
                  {item.source === 'ai' && (
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>AI</Text>
                    </View>
                  )}

                  {onItemMenuPress && (
                    <TouchableOpacity
                      style={styles.itemMenuBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        onItemMenuPress(item);
                      }}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MoreVertical size={16} color={AppColors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {items.length === 0 && (
            <View style={styles.emptyItemsNotice}>
              <Text style={styles.emptyItemsNoticeText}>
                No items yet in this category.
              </Text>
            </View>
          )}

          {/* + Add Item Row */}
          {onAddItem && (
            <TouchableOpacity
              style={styles.addItemRow}
              onPress={() => onAddItem(categoryId)}
              activeOpacity={0.75}
            >
              <Plus size={15} color={AppColors.primary} strokeWidth={2.5} />
              <Text style={styles.addItemRowText}>+ Add Item</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 16,
    marginBottom: 14,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 6,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 12,
    color: AppColors.textMuted,
  },
  headerRightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  headerAddBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.primary,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  categoryMenuBtn: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Items */
  itemsListContainer: {
    marginTop: 14,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF7F2',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F1ECE4',
  },
  itemRowChecked: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  itemToggleArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  itemEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  itemNameCol: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  itemNameChecked: {
    color: AppColors.textMuted,
    textDecorationLine: 'line-through',
  },
  itemNotes: {
    fontSize: 11,
    color: AppColors.textSecondary,
    marginTop: 1,
  },
  itemNotesChecked: {
    color: AppColors.textMuted,
    textDecorationLine: 'line-through',
  },
  itemRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemMenuBtn: {
    padding: 4,
  },
  aiBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: AppColors.primary,
  },

  /* Empty category state inside card */
  emptyItemsNotice: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  emptyItemsNoticeText: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontStyle: 'italic',
  },

  /* Add item row */
  addItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    marginTop: 2,
  },
  addItemRowText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primary,
  },
});
