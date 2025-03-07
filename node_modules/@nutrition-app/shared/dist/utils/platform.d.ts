/**
 * Platform detection and capability utilities
 */
/**
 * Platform types
 */
export declare enum Platform {
    WEB = "web",
    IOS = "ios",
    ANDROID = "android",
    REACT_NATIVE = "react-native",
    UNKNOWN = "unknown"
}
/**
 * Get the current platform
 * @returns The current platform
 */
export declare function getPlatform(): Platform;
/**
 * Check if the current platform matches the specified platform
 * @param platform Platform to check against
 * @returns True if the current platform matches
 */
export declare function isPlatform(platform: Platform): boolean;
/**
 * Check if running on the web platform
 * @returns True if running on web
 */
export declare function isWeb(): boolean;
/**
 * Check if running on a mobile platform
 * @returns True if running on mobile
 */
export declare function isMobile(): boolean;
/**
 * Check if device has camera capabilities
 * @returns True if camera is available
 */
export declare function hasCamera(): boolean;
/**
 * Check if device has offline capabilities
 * @returns True if offline storage is available
 */
export declare function hasOfflineCapabilities(): boolean;
/**
 * Check if the app is currently offline
 * @returns True if offline
 */
export declare function isOffline(): boolean;
/**
 * Get available storage methods
 * @returns Array of available storage methods
 */
export declare function getAvailableStorageMethods(): string[];
