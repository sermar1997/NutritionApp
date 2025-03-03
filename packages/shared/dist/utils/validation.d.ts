/**
 * Validation utility functions
 */
/**
 * Validate an email address
 * @param email Email to validate
 * @returns True if email is valid
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validate a password strength
 * @param password Password to validate
 * @param minLength Minimum password length (default: 8)
 * @param requireSpecialChar Require at least one special character (default: true)
 * @param requireNumber Require at least one number (default: true)
 * @returns Object with validation result and message
 */
export declare function validatePassword(password: string, minLength?: number, requireSpecialChar?: boolean, requireNumber?: boolean): {
    isValid: boolean;
    message: string;
};
/**
 * Validates if a value is a positive number
 * @param value Value to validate
 * @returns True if value is a positive number
 */
export declare function isPositiveNumber(value: any): boolean;
/**
 * Validates if a value is a non-negative number
 * @param value Value to validate
 * @returns True if value is a non-negative number
 */
export declare function isNonNegativeNumber(value: any): boolean;
/**
 * Validates if a string contains only letters and spaces
 * @param value String to validate
 * @returns True if string contains only letters and spaces
 */
export declare function isAlphaString(value: string): boolean;
/**
 * Validates if a value is within a range
 * @param value Value to validate
 * @param min Minimum value
 * @param max Maximum value
 * @returns True if value is within range
 */
export declare function isInRange(value: number, min: number, max: number): boolean;
/**
 * Validates if an array has a minimum length
 * @param array Array to validate
 * @param minLength Minimum length
 * @returns True if array has at least minLength elements
 */
export declare function hasMinLength(array: any[], minLength: number): boolean;
/**
 * Validates if a string has a valid URL format
 * @param url URL to validate
 * @returns True if URL is valid
 */
export declare function isValidUrl(url: string): boolean;
