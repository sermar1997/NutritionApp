/**
 * Storage Adapter Interface
 * 
 * Defines the contract for storage adapters that provide platform-agnostic
 * persistence capabilities. This follows the Adapter Pattern to abstract
 * platform-specific storage implementations.
 */

/**
 * Storage adapter interface
 */
export interface IStorageAdapter {
  /**
   * Get an item from storage by key
   * @param key The key to retrieve
   * @returns The value as string or null if not found
   */
  getItem(key: string): Promise<string | null>;
  
  /**
   * Set an item in storage
   * @param key The key to store under
   * @param value The value to store (will be converted to string)
   */
  setItem(key: string, value: string): Promise<void>;
  
  /**
   * Remove an item from storage
   * @param key The key to remove
   */
  removeItem(key: string): Promise<void>;
  
  /**
   * Clear all items from storage
   */
  clear(): Promise<void>;
  
  /**
   * Get all keys in storage
   * @returns Array of all keys
   */
  keys(): Promise<string[]>;
  
  /**
   * Check if a key exists in storage
   * @param key The key to check
   * @returns Whether the key exists
   */
  hasKey(key: string): Promise<boolean>;
}
