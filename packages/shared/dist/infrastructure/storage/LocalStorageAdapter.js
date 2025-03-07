/**
 * LocalStorage Adapter Implementation
 *
 * Provides an adapter for browser's localStorage API.
 */
/**
 * LocalStorage adapter for web platform
 */
export class LocalStorageAdapter {
    /**
     * Get an item from localStorage
     * @param key The key to retrieve
     * @returns The value as string or null if not found
     */
    async getItem(key) {
        return localStorage.getItem(key);
    }
    /**
     * Set an item in localStorage
     * @param key The key to store under
     * @param value The value to store
     */
    async setItem(key, value) {
        localStorage.setItem(key, value);
    }
    /**
     * Remove an item from localStorage
     * @param key The key to remove
     */
    async removeItem(key) {
        localStorage.removeItem(key);
    }
    /**
     * Clear all items from localStorage
     */
    async clear() {
        localStorage.clear();
    }
    /**
     * Get all keys in localStorage
     * @returns Array of all keys
     */
    async keys() {
        return Object.keys(localStorage);
    }
    /**
     * Check if a key exists in localStorage
     * @param key The key to check
     * @returns Whether the key exists
     */
    async hasKey(key) {
        return localStorage.getItem(key) !== null;
    }
}
