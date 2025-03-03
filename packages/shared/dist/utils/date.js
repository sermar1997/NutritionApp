/**
 * Date utility functions
 */
import { format, addDays, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';
/**
 * Format a date to a string
 * @param date Date to format
 * @param formatString Format string (date-fns format)
 * @returns Formatted date string
 */
export function formatDate(date, formatString = 'yyyy-MM-dd') {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
}
/**
 * Check if a date is expired
 * @param date Date to check
 * @returns True if date is before current date
 */
export function isExpired(date) {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isBefore(dateObj, new Date());
}
/**
 * Calculate days until expiration
 * @param date Expiration date
 * @returns Number of days until expiry, negative if expired
 */
export function daysUntilExpiry(date) {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return differenceInDays(dateObj, new Date());
}
/**
 * Get expiration status
 * @param date Expiration date
 * @returns Expiration status
 */
export function getExpiryStatus(date) {
    const days = daysUntilExpiry(date);
    if (days < 0) {
        return 'expired';
    }
    if (days <= 3) {
        return 'expiring-soon';
    }
    return 'valid';
}
/**
 * Get a date in the future
 * @param days Number of days to add
 * @returns Future date
 */
export function getFutureDate(days) {
    return addDays(new Date(), days);
}
/**
 * Check if a date is between two other dates
 * @param date Date to check
 * @param startDate Start date
 * @param endDate End date
 * @returns True if date is between start and end
 */
export function isDateBetween(date, startDate, endDate) {
    return (isAfter(date, startDate) || date.getTime() === startDate.getTime()) &&
        (isBefore(date, endDate) || date.getTime() === endDate.getTime());
}
