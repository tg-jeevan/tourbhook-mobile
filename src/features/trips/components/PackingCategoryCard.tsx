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
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react-native';
import { PackingItem } from '../hooks/usePackingRecommendations';
import { AppColors } from '../../../core/theme/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type CategoryIconType = 'essentials' | 'clothing' | 'gadgets' | 'general';

interface PackingCategoryCardProps {
  title: string;
  subtitle: string;
  iconType: CategoryIconType;
  items: PackingItem[];
  onToggleItem: (id: string) => void;
  defaultExpanded?: boolean;
}

export const PackingCategoryCard: React.FC<PackingCategoryCardProps> = ({
  title,
  subtitle,
  iconType,
  items,
  onToggleItem,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const completedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const getCategoryIcon = () => {
    switch (iconType) {
      case 'essentials':
        return <Briefcase size={22} color={AppColors.primary} strokeWidth={2.2} />;
      case 'clothing':
        return <Shirt size={22} color={AppColors.primary} strokeWidth={2.2} />;
      case 'gadgets':
        return <Camera size={22} color={AppColors.primary} strokeWidth={2.2} />;
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
        <View style={styles.iconCircle}>{getCategoryIcon()}</View>

        {/* Middle: Title & Subtitle */}
        <View style={styles.headerTextWrap}>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Text style={styles.categorySubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        {/* Right: Counter & Expand Arrow */}
        <View style={styles.counterWrap}>
          <Text style={styles.counterText}>
            {completedCount}/{totalCount}
          </Text>
          {expanded ? (
            <ChevronUp size={20} color={AppColors.textSecondary} strokeWidth={2.5} />
          ) : (
            <ChevronDown size={20} color={AppColors.textSecondary} strokeWidth={2.5} />
          )}
        </View>
      </TouchableOpacity>

      {/* ── EXPANDABLE ITEMS LIST ──────────────────────────────────── */}
      {expanded && items.length > 0 && (
        <View style={styles.itemsListContainer}>
          {items.map((item) => {
            const isChecked = item.checked;
            const emoji = getItemEmoji(item.name);

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemRow, isChecked && styles.itemRowChecked]}
                onPress={() => onToggleItem(item.id)}
                activeOpacity={0.7}
              >
                {/* Checkbox */}
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && (
                    <Check size={14} color={AppColors.white} strokeWidth={3} />
                  )}
                </View>

                {/* Emoji Graphic */}
                <Text style={styles.itemEmoji}>{emoji}</Text>

                {/* Item Name */}
                <Text
                  style={[styles.itemName, isChecked && styles.itemNameChecked]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>

                {/* AI Badge (if suggested by AI) */}
                {item.source === 'ai' && (
                  <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>AI</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
    paddingRight: 8,
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
  counterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },

  /* Items */
  itemsListContainer: {
    marginTop: 14,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  itemNameChecked: {
    color: AppColors.textMuted,
    textDecorationLine: 'line-through',
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
});
