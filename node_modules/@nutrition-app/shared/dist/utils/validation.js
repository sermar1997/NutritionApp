/**
 * Validation utility functions
 */
/**
 * Validate an email address
 * @param email Email to validate
 * @returns True if email is valid
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validate a password strength
 * @param password Password to validate
 * @param minLength Minimum password length (default: 8)
 * @param requireSpecialChar Require at least one special character (default: true)
 * @param requireNumber Require at least one number (default: true)
 * @returns Object with validation result and message
 */
export function validatePassword(password, minLength = 8, requireSpecialChar = true, requireNumber = true) {
    if (password.length < minLength) {
        return {
            isValid: false,
            message: `Password should be at least ${minLength} characters long`,
        };
    }
    if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return {
            isValid: false,
            message: 'Password should contain at least one special character',
        };
    }
    if (requireNumber && !/\d/.test(password)) {
        return {
            isValid: false,
            message: 'Password should contain at least one number',
        };
    }
    return {
        isValid: true,
        message: 'Password meets requirements',
    };
}
/**
 * Validates if a value is a positive number
 * @param value Value to validate
 * @returns True if value is a positive number
 */
export function isPositiveNumber(value) {
    const num = Number(value);
    return !isNaN(num) && num > 0;
}
/**
 * Validates if a value is a non-negative number
 * @param value Value to validate
 * @returns True if value is a non-negative number
 */
export function isNonNegativeNumber(value) {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
}
/**
 * Validates if a string contains only letters and spaces
 * @param value String to validate
 * @returns True if string contains only letters and spaces
 */
export function isAlphaString(value) {
    return /^[A-Za-z\s]+$/.test(value);
}
/**
 * Validates if a value is within a range
 * @param value Value to validate
 * @param min Minimum value
 * @param max Maximum value
 * @returns True if value is within range
 */
export function isInRange(value, min, max) {
    return value >= min && value <= max;
}
/**
 * Validates if an array has a minimum length
 * @param array Array to validate
 * @param minLength Minimum length
 * @returns True if array has at least minLength elements
 */
export function hasMinLength(array, minLength) {
    return Array.isArray(array) && array.length >= minLength;
}
/**
 * Validates if a string has a valid URL format
 * @param url URL to validate
 * @returns True if URL is valid
 */
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch (e) {
        return false;
    }
}
