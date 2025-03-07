/**
 * AsyncStorage Adapter Implementation
 *
 * Provides an adapter for React Native's AsyncStorage API.
 * This is a placeholder implementation that will need to be completed
 * with the actual AsyncStorage import from React Native when used in mobile.
 */
import { IStorageAdapter } from './IStorageAdapter';
/**
 * AsyncStorage adapter for React Native
 */
export declare class AsyncStorageAdapter implements IStorageAdapter {
    /**
     * Get an item from AsyncStorage
     * @param keyToRetrieve The key to retrieve
     * @returns The value as string or null if not found
     */
    getItem(keyToRetrieve: string): Promise<string | null>;
    /**
     * Set an item in AsyncStorage
     * @param keyToStore The key to store under
     * @param valueToStore The value to store
     */
    setItem(keyToStore: string, valueToStore: string): Promise<void>;
    /**
     * Remove an item from AsyncStorage
     * @param key The key to remove
     */
    removeItem(key: string): Promise<void>;
    /**
     * Clear all items from AsyncStorage
     */
    clear(): Promise<void>;
    /**
     * Get all keys in AsyncStorage
     * @returns Array of all keys
     */
    keys(): Promise<string[]>;
    /**
     * Check if a key exists in AsyncStorage
     * @param keyToCheck The key to check
     * @returns Whether the key exists
     */
    hasKey(keyToCheck: string): Promise<boolean>;
}
