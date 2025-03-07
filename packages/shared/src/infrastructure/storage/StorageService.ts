/**
 * Storage Service
 * 
 * Provides a high-level interface for storing and retrieving data, with
 * serialization and support for complex objects. This service uses the
 * underlying platform-specific storage adapter.
 */

import { IStorageAdapter } from './IStorageAdapter';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { AsyncStorageAdapter } from './AsyncStorageAdapter';
import { isPlatform, Platform } from '../../utils/platform';

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
export class StorageService {
  private adapter: IStorageAdapter;
  private keyPrefix: string;
  
  /**
   * Create a new storage service
   * @param options Configuration options
   */
  constructor(options: StorageServiceOptions = {}) {
    this.keyPrefix = options.keyPrefix || '';
    this.adapter = options.adapter || this.createDefaultAdapter();
  }
  
  /**
   * Create the default adapter based on platform
   */
  private createDefaultAdapter(): IStorageAdapter {
    if (isPlatform(Platform.REACT_NATIVE)) {
      return new AsyncStorageAdapter();
    }
    return new LocalStorageAdapter();
  }
  
  /**
   * Format a key with the prefix
   * @param key The key to format
   * @returns The formatted key
   */
  private formatKey(key: string): string {
    return this.keyPrefix ? `${this.keyPrefix}_${key}` : key;
  }
  
  /**
   * Get an item from storage
   * @param key The key to retrieve
   * @returns The parsed value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    const formattedKey = this.formatKey(key);
    const value = await this.adapter.getItem(formattedKey);
    
    if (value === null) {
      return null;
    }
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error parsing stored value for key ${key}:`, error);
      return null;
    }
  }
  
  /**
   * Set an item in storage
   * @param key The key to store under
   * @param value The value to store
   */
  async set<T>(key: string, value: T): Promise<void> {
    const formattedKey = this.formatKey(key);
    
    try {
      const serialized = JSON.stringify(value);
      await this.adapter.setItem(formattedKey, serialized);
    } catch (error) {
      console.error(`Error storing value for key ${key}:`, error);
      throw error;
    }
  }
  
  /**
   * Remove an item from storage
   * @param key The key to remove
   */
  async remove(key: string): Promise<void> {
    const formattedKey = this.formatKey(key);
    await this.adapter.removeItem(formattedKey);
  }
  
  /**
   * Clear all items with the current prefix
   */
  async clear(): Promise<void> {
    if (!this.keyPrefix) {
      // No prefix, clear everything
      await this.adapter.clear();
      return;
    }
    
    // Clear only items with the prefix
    const keys = await this.adapter.keys();
    const prefixedKeys = keys.filter(key => key.startsWith(this.keyPrefix));
    
    for (const key of prefixedKeys) {
      await this.adapter.removeItem(key);
    }
  }
  
  /**
   * Check if a key exists in storage
   * @param key The key to check
   * @returns Whether the key exists
   */
  async has(key: string): Promise<boolean> {
    const formattedKey = this.formatKey(key);
    return this.adapter.hasKey(formattedKey);
  }
  
  /**
   * Get all keys with the current prefix
   * @returns Array of keys
   */
  async keys(): Promise<string[]> {
    const allKeys = await this.adapter.keys();
    
    if (!this.keyPrefix) {
      return allKeys;
    }
    
    // Filter keys by prefix and remove prefix
    return allKeys
      .filter(key => key.startsWith(this.keyPrefix))
      .map(key => key.slice(this.keyPrefix.length + 1)); // +1 for the underscore
  }
}
