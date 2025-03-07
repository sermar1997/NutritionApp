/**
 * Storage Service
 *
 * Provides a high-level interface for storing and retrieving data, with
 * serialization and support for complex objects. This service uses the
 * underlying platform-specific storage adapter.
 */
import { IStorageAdapter } from './IStorageAdapter';
/**
 * Storage service options
 */
export interface StorageServiceOptions {
    /** Optional prefix for all keys */
    keyPrefix?: string;
    /** Custom storage adapter */
    adapter?: IStorageAdapter;
}
/**
 * Storage service for persisting data
 */
export declare class StorageService {
    private adapter;
    private keyPrefix;
    /**
     * Create a new storage service
     * @param options Configuration options
     */
    constructor(options?: StorageServiceOptions);
    /**
     * Create the default adapter based on platform
     */
    private createDefaultAdapter;
    /**
     * Format a key with the prefix
     * @param key The key to format
     * @returns The formatted key
     */
    private formatKey;
    /**
     * Get an item from storage
     * @param key The key to retrieve
     * @returns The parsed value or null if not found
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set an item in storage
     * @param key The key to store under
     * @param value The value to store
     */
    set<T>(key: string, value: T): Promise<void>;
    /**
     * Remove an item from storage
     * @param key The key to remove
     */
    remove(key: string): Promise<void>;
    /**
     * Clear all items with the current prefix
     */
    clear(): Promise<void>;
    /**
     * Check if a key exists in storage
     * @param key The key to check
     * @returns Whether the key exists
     */
    has(key: string): Promise<boolean>;
    /**
     * Get all keys with the current prefix
     * @returns Array of keys
     */
    keys(): Promise<string[]>;
}
