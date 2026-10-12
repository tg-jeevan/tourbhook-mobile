import { MONTH_NAMES, parseDateComponents } from './itineraryFormatting';

export interface LocalDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

/**
 * Returns the current local device date as LocalDate without timezone drift.
 */
export function getTodayLocalDate(): LocalDate {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

/**
 * Adds specified number of days to a LocalDate without timezone or DST drift.
 */
export function addDaysToLocalDate(date: LocalDate, days: number): LocalDate {
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/**
 * Calculates inclusive number of days between two LocalDates (d1 to d2).
 * e.g., Oct 5 to Oct 12 returns 8.
 */
export function getDaysBetween(d1: LocalDate, d2: LocalDate): number {
  const utc1 = Date.UTC(d1.year, d1.month - 1, d1.day);
  const utc2 = Date.UTC(d2.year, d2.month - 1, d2.day);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / MS_PER_DAY) + 1;
}

/**
 * Formats a LocalDate into canonical day tab date label: "Oct 5"
 */
export function formatLocalDateToDayTabLabel(date: LocalDate): string {
  const mName = MONTH_NAMES[date.month - 1] || 'Jan';
  return `${mName} ${date.day}`;
}

/**
 * Returns the maximum allowed trip date (today + 365 days).
 */
export function getMaxAllowedDate(today: LocalDate = getTodayLocalDate()): LocalDate {
  return addDaysToLocalDate(today, 365);
}

/**
 * Compares two LocalDates.
 * Returns negative if d1 < d2, 0 if equal, positive if d1 > d2.
 */
export function compareLocalDates(d1: LocalDate, d2: LocalDate): number {
  if (d1.year !== d2.year) return d1.year - d2.year;
  if (d1.month !== d2.month) return d1.month - d2.month;
  return d1.day - d2.day;
}

export function isSameDay(d1: LocalDate, d2: LocalDate): boolean {
  return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
}

export function isBeforeDay(d1: LocalDate, d2: LocalDate): boolean {
  return compareLocalDates(d1, d2) < 0;
}

export function isAfterDay(d1: LocalDate, d2: LocalDate): boolean {
  return compareLocalDates(d1, d2) > 0;
}

/**
 * Formats a LocalDate into canonical display string: "Aug 5, 2027"
 */
export function formatLocalDateToDisplay(date: LocalDate): string {
  const mName = MONTH_NAMES[date.month - 1] || 'Jan';
  return `${mName} ${date.day}, ${date.year}`;
}

/**
 * Parses any supported date string into a LocalDate.
 */
export function parseDateStringToLocalDate(str?: string): LocalDate | null {
  if (!str) return null;
  const parsed = parseDateComponents(str);
  if (!parsed) return null;
  return {
    year: parsed.year,
    month: parsed.month,
    day: parsed.day,
  };
}

/**
 * Calendar day cell descriptor.
 */
export interface CalendarDayCell {
  date: LocalDate;
  dayNumber: number;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange?: boolean;
}

/**
 * Generates the full 35-42 days grid for a month calendar view.
 */
export function generateMonthCalendar(
  year: number,
  month: number, // 1-12
  options: {
    minDate: LocalDate;
    maxDate: LocalDate;
    selectedDate?: LocalDate | null;
    referenceStartDate?: LocalDate | null;
    today?: LocalDate;
  }
): CalendarDayCell[] {
  const today = options.today || getTodayLocalDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Sun
  const daysInCurrentMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const cells: CalendarDayCell[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const d: LocalDate = { year: prevYear, month: prevMonth, day };
    cells.push({
      date: d,
      dayNumber: day,
      isCurrentMonth: false,
      isDisabled: true,
      isToday: isSameDay(d, today),
      isSelected: options.selectedDate ? isSameDay(d, options.selectedDate) : false,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const d: LocalDate = { year, month, day };
    const isDisabled = isBeforeDay(d, options.minDate) || isAfterDay(d, options.maxDate);
    const isSelected = options.selectedDate ? isSameDay(d, options.selectedDate) : false;

    // In range if between referenceStartDate and selectedDate
    let isInRange = false;
    if (options.referenceStartDate && options.selectedDate) {
      if (isAfterDay(d, options.referenceStartDate) && isBeforeDay(d, options.selectedDate)) {
        isInRange = true;
      }
    }

    cells.push({
      date: d,
      dayNumber: day,
      isCurrentMonth: true,
      isDisabled,
      isToday: isSameDay(d, today),
      isSelected,
      isInRange,
    });
  }

  // Next month leading days to complete row (up to multiple of 7)
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remaining; day++) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const d: LocalDate = { year: nextYear, month: nextMonth, day };
    cells.push({
      date: d,
      dayNumber: day,
      isCurrentMonth: false,
      isDisabled: true,
      isToday: isSameDay(d, today),
      isSelected: options.selectedDate ? isSameDay(d, options.selectedDate) : false,
    });
  }

  return cells;
}

export interface DateValidationResult {
  isValid: boolean;
  errorMessage?: string;
  field?: 'startDate' | 'endDate' | 'range';
}

export interface TripDateValidationOptions {
  today?: LocalDate;
  isEditMode?: boolean;
  originalStartDate?: string;
}

/**
 * Validates travel date selection strictly against all business rules:
 * - Start date and End date present
 * - Start date not in past (preserved for original start date in edit mode)
 * - End date >= Start date
 * - Start date <= today + 365
 * - End date <= today + 365
 */
export function validateTripDateRange(
  startDateStr?: string,
  endDateStr?: string,
  todayOrOptions?: LocalDate | TripDateValidationOptions,
  options?: TripDateValidationOptions
): DateValidationResult {
  let today = getTodayLocalDate();
  let isEditMode = false;
  let originalStartDate: string | undefined;

  if (todayOrOptions) {
    if ('year' in todayOrOptions && typeof todayOrOptions.year === 'number') {
      today = todayOrOptions as LocalDate;
    } else {
      const opts = todayOrOptions as TripDateValidationOptions;
      if (opts.today) today = opts.today;
      if (opts.isEditMode !== undefined) isEditMode = opts.isEditMode;
      if (opts.originalStartDate !== undefined) originalStartDate = opts.originalStartDate;
    }
  }

  if (options) {
    if (options.today) today = options.today;
    if (options.isEditMode !== undefined) isEditMode = options.isEditMode;
    if (options.originalStartDate !== undefined) originalStartDate = options.originalStartDate;
  }

  if (!startDateStr || !startDateStr.trim()) {
    return { isValid: false, errorMessage: 'Start date is required', field: 'startDate' };
  }
  if (!endDateStr || !endDateStr.trim()) {
    return { isValid: false, errorMessage: 'End date is required', field: 'endDate' };
  }

  const start = parseDateStringToLocalDate(startDateStr);
  if (!start) {
    return { isValid: false, errorMessage: 'Invalid start date format', field: 'startDate' };
  }

  const end = parseDateStringToLocalDate(endDateStr);
  if (!end) {
    return { isValid: false, errorMessage: 'Invalid end date format', field: 'endDate' };
  }

  // 1. Past dates forbidden:
  // For new trips, start date cannot be in the past.
  // For editing existing trips: if the user kept the original saved start date, allow it.
  const isOriginalStart =
    isEditMode &&
    originalStartDate &&
    startDateStr.trim().toLowerCase() === originalStartDate.trim().toLowerCase();

  if (!isOriginalStart && isBeforeDay(start, today)) {
    return {
      isValid: false,
      errorMessage: 'Start date cannot be in the past',
      field: 'startDate',
    };
  }

  // 2. End date before start date forbidden
  if (isBeforeDay(end, start)) {
    return {
      isValid: false,
      errorMessage: 'End date must be on or after start date',
      field: 'range',
    };
  }

  // 3. 365 days window enforced
  const maxAllowed = getMaxAllowedDate(today);
  if (isAfterDay(start, maxAllowed)) {
    return {
      isValid: false,
      errorMessage: 'Start date must be within 365 days from today',
      field: 'startDate',
    };
  }

  if (isAfterDay(end, maxAllowed)) {
    return {
      isValid: false,
      errorMessage: 'End date must be within 365 days from today',
      field: 'endDate',
    };
  }

  return { isValid: true };
}
