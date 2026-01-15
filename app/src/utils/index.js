/** Format a date to YYYY-MM-DD.
 * @param {string} isoDateString - The ISO date string
 * @returns {string} - The formatted date
 * @example
 * formatDateToYYYYMMDD('2021-01-01T00:00:00.000Z') // '2021-01-01'
 */
export function formatDateToYYYYMMDD(isoDateString) {
  const date = new Date(isoDateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const formattedMonth = month < 10 ? `0${month}` : month
  const formattedDay = day < 10 ? `0${day}` : day
  return `${year}-${formattedMonth}-${formattedDay}`
}

/**
 * Safely parses a date string, ensuring it's treated as UTC if it doesn't have timezone info.
 * This fixes the issue where dates from the API might be interpreted as local time instead of UTC.
 * @param {string|Date} dateInput - The date string or Date object
 * @returns {Date} - A properly parsed Date object
 */
function parseDateSafely(dateInput) {
  if (!dateInput) return null
  if (dateInput instanceof Date) return dateInput
  
  const dateStr = String(dateInput).trim()
  
  // If it's already an ISO string with timezone info (ends with Z or has +/- offset), use it directly
  if (dateStr.includes('Z') || dateStr.match(/[+-]\d{2}:?\d{2}$/)) {
    return new Date(dateStr)
  }
  
  // If no timezone info, assume it's UTC (common for API responses stored in MongoDB)
  // MongoDB stores dates as UTC, so we append 'Z' to indicate UTC
  // This ensures the date is parsed correctly regardless of the user's timezone
  return new Date(dateStr + 'Z')
}

/**
 * Formats a date in the user's local timezone.
 * Properly handles dates from the API (stored in UTC) and displays them in the user's timezone.
 * @param {string|Date} dateInput - The date string or Date object
 * @param {object} options - Intl.DateTimeFormatOptions
 * @returns {string} - The formatted date string
 */
export function formatDateLocal(dateInput, options = {}) {
  const date = parseDateSafely(dateInput)
  if (!date || isNaN(date.getTime())) return 'Invalid Date'
  
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  })
}

/**
 * Formats a time in the user's local timezone with timezone abbreviation.
 * Properly handles dates from the API (stored in UTC) and displays them in the user's timezone.
 * @param {string|Date} dateInput - The date string or Date object
 * @param {object} options - Intl.DateTimeFormatOptions
 * @returns {string} - The formatted time string with timezone
 */
export function formatTimeLocal(dateInput, options = {}) {
  const date = parseDateSafely(dateInput)
  if (!date || isNaN(date.getTime())) return 'Invalid Time'
  
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    ...options
  })
}

/**
 * Formats a date and time together in the user's local timezone.
 * @param {string|Date} dateInput - The date string or Date object
 * @param {object} dateOptions - Options for date formatting
 * @param {object} timeOptions - Options for time formatting
 * @returns {string} - The formatted date and time string
 */
export function formatDateTimeLocal(dateInput, dateOptions = {}, timeOptions = {}) {
  const date = parseDateSafely(dateInput)
  if (!date || isNaN(date.getTime())) return 'Invalid Date'
  
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...dateOptions
  })
  
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    ...timeOptions
  })
  
  return `${dateStr} at ${timeStr}`
}
