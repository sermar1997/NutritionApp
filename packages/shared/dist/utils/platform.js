/**
 * Platform detection and capability utilities
 */
/**
 * Platform types
 */
export var Platform;
(function (Platform) {
    Platform["WEB"] = "web";
    Platform["IOS"] = "ios";
    Platform["ANDROID"] = "android";
    Platform["UNKNOWN"] = "unknown";
})(Platform || (Platform = {}));
/**
 * Get the current platform
 * @returns The current platform
 */
export function getPlatform() {
    if (typeof window === 'undefined') {
        return Platform.UNKNOWN;
    }
    // React Native specific
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        // This would be more nuanced in a real implementation
        return Platform.ANDROID; // Default to Android for this example
    }
    // Web browser
    return Platform.WEB;
}
/**
 * Check if running on the web platform
 * @returns True if running on web
 */
export function isWeb() {
    return getPlatform() === Platform.WEB;
}
/**
 * Check if running on a mobile platform
 * @returns True if running on mobile
 */
export function isMobile() {
    const platform = getPlatform();
    return platform === Platform.IOS || platform === Platform.ANDROID;
}
/**
 * Check if device has camera capabilities
 * @returns True if camera is available
 */
export function hasCamera() {
    if (isMobile()) {
        return true; // Mobile devices typically have cameras
    }
    // Web browser camera check
    return typeof navigator !== 'undefined' &&
        typeof navigator.mediaDevices !== 'undefined' &&
        typeof navigator.mediaDevices.getUserMedia !== 'undefined';
}
/**
 * Check if device has offline capabilities
 * @returns True if offline storage is available
 */
export function hasOfflineCapabilities() {
    if (typeof window === 'undefined') {
        return false;
    }
    // Check for IndexedDB or localStorage on web
    if (isWeb()) {
        return typeof indexedDB !== 'undefined' || typeof localStorage !== 'undefined';
    }
    // Mobile platforms have offline capabilities
    return true;
}
/**
 * Check if the app is currently offline
 * @returns True if offline
 */
export function isOffline() {
    return typeof navigator !== 'undefined' && !navigator.onLine;
}
/**
 * Get available storage methods
 * @returns Array of available storage methods
 */
export function getAvailableStorageMethods() {
    const methods = [];
    if (typeof window === 'undefined') {
        return methods;
    }
    if (typeof indexedDB !== 'undefined') {
        methods.push('indexedDB');
    }
    if (typeof localStorage !== 'undefined') {
        methods.push('localStorage');
    }
    if (typeof sessionStorage !== 'undefined') {
        methods.push('sessionStorage');
    }
    // In React Native, we would check for AsyncStorage and SQLite
    return methods;
}
