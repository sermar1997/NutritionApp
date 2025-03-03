/**
 * Date utility functions
 */
/**
 * Format a date to a string
 * @param date Date to format
 * @param formatString Format string (date-fns format)
 * @returns Formatted date string
 */
export declare function formatDate(date: Date | string, formatString?: string): string;
/**
 * Check if a date is expired
 * @param date Date to check
 * @returns True if date is before current date
 */
export declare function isExpired(date: Date | string): boolean;
/**
 * Calculate days until expiration
 * @param date Expiration date
 * @returns Number of days until expiry, negative if expired
 */
export declare function daysUntilExpiry(date: Date | string): number;
/**
 * Get expiration status
 * @param date Expiration date
 * @returns Expiration status
 */
export declare function getExpiryStatus(date: Date | string): 'expired' | 'expiring-soon' | 'valid';
/**
 * Get a date in the future
 * @param days Number of days to add
 * @returns Future date
 */
export declare function getFutureDate(days: number): Date;
/**
 * Check if a date is between two other dates
 * @param date Date to check
 * @param startDate Start date
 * @param endDate End date
 * @returns True if date is between start and end
 */
export declare function isDateBetween(date: Date, startDate: Date, endDate: Date): boolean;
