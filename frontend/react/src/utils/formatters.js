/**
 * EventHub Reusable Formatting & Helper Utilities
 */

/**
 * Format ISO date string to human-readable date (e.g. 'Oct 25, 2026')
 * @param {string|Date} dateString
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string}
 */
export const formatDate = (dateString, options) => {
  if (!dateString) return '';
  try {
    const defaultOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options || defaultOptions);
  } catch {
    return String(dateString);
  }
};

/**
 * Format time string (e.g. '14:30:00' or '14:30') to 12-hour AM/PM format (e.g. '02:30 PM')
 * @param {string} timeString
 * @returns {string}
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  try {
    const [hours, minutes] = timeString.split(':');
    const d = new Date();
    d.setHours(Number(hours));
    d.setMinutes(Number(minutes));
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(timeString);
  }
};

/**
 * Combine date and time into a single formatted string
 * @param {string} dateString
 * @param {string} timeString
 * @returns {string}
 */
export const formatDateTime = (dateString, timeString) => {
  const d = formatDate(dateString);
  const t = formatTime(timeString);
  if (d && t) return `${d} at ${t}`;
  return d || t || '';
};

/**
 * Format amount into currency format or 'Free'
 * @param {number|string} amount
 * @param {string} currencySymbol
 * @returns {string}
 */
export const formatCurrency = (amount, currencySymbol = '$') => {
  if (amount === undefined || amount === null || Number(amount) === 0) return 'Free';
  const num = parseFloat(amount);
  if (isNaN(num)) return 'Free';
  return `${currencySymbol}${num.toFixed(2)}`;
};

/**
 * Truncate long text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Capitalize first letter of string
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Extract uppercase initials from full name (e.g. 'John Doe' -> 'JD')
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Check if event is sold out based on availableSeats
 * @param {number} availableSeats
 * @returns {boolean}
 */
export const isEventSoldOut = (availableSeats) => {
  return typeof availableSeats === 'number' && availableSeats <= 0;
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatCurrency,
  truncateText,
  capitalize,
  getInitials,
  isEventSoldOut,
};
