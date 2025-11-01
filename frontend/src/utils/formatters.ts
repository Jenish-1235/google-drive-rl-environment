import { format, formatDistanceToNow, isToday, isYesterday, isThisYear } from 'date-fns';

/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format date in Google Drive style
 * - "Today at 2:30 PM"
 * - "Yesterday at 2:30 PM"
 * - "Jan 15" (this year)
 * - "Jan 15, 2023" (other years)
 */
export const formatDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }

  if (isThisYear(date)) {
    return format(date, 'MMM d');
  }

  return format(date, 'MMM d, yyyy');
};

/**
 * Format date for detailed view
 */
export const formatDetailedDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy \'at\' h:mm a');
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Get initials from name (for avatar)
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Format storage percentage
 */
export const formatStoragePercentage = (used: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
};

/**
 * Format count with suffix (e.g., 1.5K, 2.3M)
 */
export const formatCount = (count: number): string => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
  return (count / 1000000).toFixed(1) + 'M';
};

/**
 * Pluralize word based on count
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) return singular;
  return plural || singular + 's';
};

/**
 * Format list of names (e.g., "John, Jane, and 2 others")
 */
export const formatNameList = (names: string[], maxDisplay: number = 2): string => {
  if (names.length === 0) return '';
  if (names.length <= maxDisplay) return names.join(', ');

  const displayed = names.slice(0, maxDisplay).join(', ');
  const remaining = names.length - maxDisplay;
  return `${displayed}, and ${remaining} ${pluralize(remaining, 'other')}`;
};
