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
export function formatDate(date: Date | string, formatString: string = 'yyyy-MM-dd'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
}

/**
 * Check if a date is expired
 * @param date Date to check
 * @returns True if date is before current date
 */
export function isExpired(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(dateObj, new Date());
}

/**
 * Calculate days until expiration
 * @param date Expiration date
 * @returns Number of days until expiry, negative if expired
 */
export function daysUntilExpiry(date: Date | string): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(dateObj, new Date());
}

/**
 * Get expiration status
 * @param date Expiration date
 * @returns Expiration status
 */
export function getExpiryStatus(date: Date | string): 'expired' | 'expiring-soon' | 'valid' {
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
export function getFutureDate(days: number): Date {
  return addDays(new Date(), days);
}

/**
 * Check if a date is between two other dates
 * @param date Date to check
 * @param startDate Start date
 * @param endDate End date
 * @returns True if date is between start and end
 */
export function isDateBetween(date: Date, startDate: Date, endDate: Date): boolean {
  return (isAfter(date, startDate) || date.getTime() === startDate.getTime()) && 
         (isBefore(date, endDate) || date.getTime() === endDate.getTime());
}
