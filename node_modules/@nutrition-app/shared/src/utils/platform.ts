/**
 * Platform detection and capability utilities
 */

/**
 * Platform types
 */
export enum Platform {
  WEB = 'web',
  IOS = 'ios',
  ANDROID = 'android',
  REACT_NATIVE = 'react-native',
  UNKNOWN = 'unknown',
}

/**
 * Get the current platform
 * @returns The current platform
 */
export function getPlatform(): Platform {
  if (typeof window === 'undefined') {
    return Platform.UNKNOWN;
  }
  
  // React Native specific
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    // This would be more nuanced in a real implementation
    return Platform.REACT_NATIVE;
  }
  
  // Web browser
  return Platform.WEB;
}

/**
 * Check if the current platform matches the specified platform
 * @param platform Platform to check against
 * @returns True if the current platform matches
 */
export function isPlatform(platform: Platform): boolean {
  return getPlatform() === platform;
}

/**
 * Check if running on the web platform
 * @returns True if running on web
 */
export function isWeb(): boolean {
  return getPlatform() === Platform.WEB;
}

/**
 * Check if running on a mobile platform
 * @returns True if running on mobile
 */
export function isMobile(): boolean {
  const platform = getPlatform();
  return platform === Platform.IOS || platform === Platform.ANDROID;
}

/**
 * Check if device has camera capabilities
 * @returns True if camera is available
 */
export function hasCamera(): boolean {
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
export function hasOfflineCapabilities(): boolean {
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
export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

/**
 * Get available storage methods
 * @returns Array of available storage methods
 */
export function getAvailableStorageMethods(): string[] {
  const methods: string[] = [];
  
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
