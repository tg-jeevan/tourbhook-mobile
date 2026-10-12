import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';
import {
  LocalDate,
  getTodayLocalDate,
  getMaxAllowedDate,
  formatLocalDateToDisplay,
  parseDateStringToLocalDate,
  generateMonthCalendar,
  isBeforeDay,
  isAfterDay,
  isSameDay,
} from '../utils/tripDateUtils';
import { MONTH_NAMES } from '../utils/itineraryFormatting';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export interface TripDatePickerModalProps {
  visible: boolean;
  mode: 'start' | 'end';
  currentValue?: string;
  referenceStartDate?: string; // used when mode === 'end'
  onSelectDate: (formattedDate: string) => void;
  onClose: () => void;
}

export function TripDatePickerModal({
  visible,
  mode,
  currentValue,
  referenceStartDate,
  onSelectDate,
  onClose,
}: TripDatePickerModalProps) {
  const today = useMemo(() => getTodayLocalDate(), []);
  const maxAllowed = useMemo(() => getMaxAllowedDate(today), [today]);

  // Determine minDate
  const minDate = useMemo(() => {
    if (mode === 'end' && referenceStartDate) {
      const parsedRef = parseDateStringToLocalDate(referenceStartDate);
      if (parsedRef && !isBeforeDay(parsedRef, today)) {
        return parsedRef;
      }
    }
    return today;
  }, [mode, referenceStartDate, today]);

  // Parse initial selected date or default to minDate
  const initialDate = useMemo(() => {
    if (currentValue) {
      const parsed = parseDateStringToLocalDate(currentValue);
      if (parsed && !isBeforeDay(parsed, minDate) && !isAfterDay(parsed, maxAllowed)) {
        return parsed;
      }
    }
    return minDate;
  }, [currentValue, minDate, maxAllowed]);

  const [viewYear, setViewYear] = useState<number>(initialDate.year);
  const [viewMonth, setViewMonth] = useState<number>(initialDate.month);
  const [selectedDate, setSelectedDate] = useState<LocalDate>(initialDate);

  // Sync state when modal opens
  useEffect(() => {
    if (visible) {
      const validInitial = currentValue
        ? parseDateStringToLocalDate(currentValue) || minDate
        : minDate;
      const effective = isBeforeDay(validInitial, minDate) ? minDate : validInitial;
      setSelectedDate(effective);
      setViewYear(effective.year);
      setViewMonth(effective.month);
    }
  }, [visible, currentValue, minDate]);

  // Month navigation bounds
  const canGoPrev = useMemo(() => {
    const prevMonth = viewMonth === 1 ? 12 : viewMonth - 1;
    const prevYear = viewMonth === 1 ? viewYear - 1 : viewYear;
    const lastDayOfPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
    const endOfPrev: LocalDate = { year: prevYear, month: prevMonth, day: lastDayOfPrevMonth };
    return !isBeforeDay(endOfPrev, minDate);
  }, [viewMonth, viewYear, minDate]);

  const canGoNext = useMemo(() => {
    const nextMonth = viewMonth === 12 ? 1 : viewMonth + 1;
    const nextYear = viewMonth === 12 ? viewYear + 1 : viewYear;
    const firstDayOfNext: LocalDate = { year: nextYear, month: nextMonth, day: 1 };
    return !isAfterDay(firstDayOfNext, maxAllowed);
  }, [viewMonth, viewYear, maxAllowed]);

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (!canGoNext) return;
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (date: LocalDate) => {
    setSelectedDate(date);
    const formatted = formatLocalDateToDisplay(date);
    onSelectDate(formatted);
    onClose();
  };

  const refStart = useMemo(() => {
    return referenceStartDate ? parseDateStringToLocalDate(referenceStartDate) : null;
  }, [referenceStartDate]);

  const cells = useMemo(() => {
    return generateMonthCalendar(viewYear, viewMonth, {
      minDate,
      maxDate: maxAllowed,
      selectedDate,
      referenceStartDate: refStart,
      today,
    });
  }, [viewYear, viewMonth, minDate, maxAllowed, selectedDate, refStart, today]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* ── HEADER ─────────────────────────────────────────────── */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <CalendarIcon size={18} color={AppColors.primary} />
              </View>
              <View>
                <Text style={styles.titleText}>
                  {mode === 'start' ? 'Select Start Date' : 'Select End Date'}
                </Text>
                <Text style={styles.subtitleText}>
                  {mode === 'start'
                    ? 'When does your journey begin?'
                    : 'When does your journey conclude?'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
              accessibilityLabel="Close date picker"
              accessibilityRole="button"
            >
              <X size={18} color={AppColors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* ── MONTH SELECTOR ─────────────────────────────────────── */}
          <View style={styles.monthNavRow}>
            <TouchableOpacity
              style={[styles.navBtn, !canGoPrev && styles.navBtnDisabled]}
              onPress={handlePrevMonth}
              disabled={!canGoPrev}
              activeOpacity={0.7}
              accessibilityLabel="Previous month"
            >
              <ChevronLeft
                size={18}
                color={canGoPrev ? AppColors.textPrimary : '#CBD5E1'}
              />
            </TouchableOpacity>

            <Text style={styles.monthTitleText}>
              {MONTH_NAMES[viewMonth - 1]} {viewYear}
            </Text>

            <TouchableOpacity
              style={[styles.navBtn, !canGoNext && styles.navBtnDisabled]}
              onPress={handleNextMonth}
              disabled={!canGoNext}
              activeOpacity={0.7}
              accessibilityLabel="Next month"
            >
              <ChevronRight
                size={18}
                color={canGoNext ? AppColors.textPrimary : '#CBD5E1'}
              />
            </TouchableOpacity>
          </View>

          {/* ── DAY OF WEEK HEADERS ─────────────────────────────────── */}
          <View style={styles.weekdaysRow}>
            {WEEKDAYS.map((w, idx) => (
              <Text
                key={w}
                style={[
                  styles.weekdayText,
                  (idx === 0 || idx === 6) && styles.weekendText,
                ]}
              >
                {w}
              </Text>
            ))}
          </View>

          {/* ── CALENDAR DAYS GRID ──────────────────────────────────── */}
          <View style={styles.grid}>
            {cells.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <View key={`empty-${idx}`} style={styles.dayCell}>
                    <Text style={styles.dayTextEmpty}>{cell.dayNumber}</Text>
                  </View>
                );
              }

              const isStartReference = refStart && isSameDay(cell.date, refStart);

              return (
                <TouchableOpacity
                  key={`day-${cell.dayNumber}`}
                  style={[
                    styles.dayCell,
                    cell.isSelected && styles.dayCellSelected,
                    cell.isInRange && styles.dayCellInRange,
                    isStartReference && !cell.isSelected && styles.dayCellStartRef,
                  ]}
                  disabled={cell.isDisabled}
                  onPress={() => handleSelectDay(cell.date)}
                  activeOpacity={0.7}
                  accessibilityLabel={`${MONTH_NAMES[cell.date.month - 1]} ${cell.date.day}, ${cell.date.year}`}
                >
                  <Text
                    style={[
                      styles.dayText,
                      cell.isDisabled && styles.dayTextDisabled,
                      cell.isSelected && styles.dayTextSelected,
                      cell.isToday && !cell.isSelected && styles.dayTextToday,
                    ]}
                  >
                    {cell.dayNumber}
                  </Text>
                  {cell.isToday && !cell.isSelected && <View style={styles.todayDot} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── FOOTER HINT & SHORTCUTS ────────────────────────────── */}
          <View style={styles.footerRow}>
            {mode === 'start' && (
              <TouchableOpacity
                style={styles.todayShortcutBtn}
                onPress={() => handleSelectDay(today)}
                activeOpacity={0.7}
              >
                <Text style={styles.todayShortcutText}>Select Today</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16, 36, 63, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3EFE8',
    marginBottom: 12,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  monthTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  weekdayText: {
    width: 40,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textMuted,
  },
  weekendText: {
    color: '#94A3B8',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    position: 'relative',
  },
  dayCellSelected: {
    backgroundColor: AppColors.primary,
  },
  dayCellInRange: {
    backgroundColor: '#E0F2FE',
    borderRadius: 0,
  },
  dayCellStartRef: {
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  dayTextEmpty: {
    fontSize: 13,
    color: '#E2E8F0',
  },
  dayTextDisabled: {
    color: '#CBD5E1',
  },
  dayTextSelected: {
    color: AppColors.white,
    fontWeight: '900',
  },
  dayTextToday: {
    color: AppColors.primary,
    fontWeight: '900',
  },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.primary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F3EFE8',
  },
  todayShortcutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
  },
  todayShortcutText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.primary,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textMuted,
  },
});
