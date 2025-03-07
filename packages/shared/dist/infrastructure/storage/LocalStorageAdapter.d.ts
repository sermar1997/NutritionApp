/**
 * LocalStorage Adapter Implementation
 *
 * Provides an adapter for browser's localStorage API.
 */
import { IStorageAdapter } from './IStorageAdapter';
/**
 * LocalStorage adapter for web platform
 */
export declare class LocalStorageAdapter implements IStorageAdapter {
    /**
     * Get an item from localStorage
     * @param key The key to retrieve
     * @returns The value as string or null if not found
     */
    getItem(key: string): Promise<string | null>;
    /**
     * Set an item in localStorage
     * @param key The key to store under
     * @param value The value to store
     */
    setItem(key: string, value: string): Promise<void>;
    /**
     * Remove an item from localStorage
     * @param key The key to remove
     */
    removeItem(key: string): Promise<void>;
    /**
     * Clear all items from localStorage
     */
    clear(): Promise<void>;
    /**
     * Get all keys in localStorage
     * @returns Array of all keys
     */
    keys(): Promise<string[]>;
    /**
     * Check if a key exists in localStorage
     * @param key The key to check
     * @returns Whether the key exists
     */
    hasKey(key: string): Promise<boolean>;
}
