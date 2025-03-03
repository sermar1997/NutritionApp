/**
 * Storage utilities
 */
/**
 * Base storage provider implementation
 */
export class BaseStorageProvider {
    constructor() {
        this.isInitialized = false;
    }
    /**
     * Check if the storage is ready
     */
    isReady() {
        return this.isInitialized;
    }
    /**
     * Generate a storage key for an entity and ID
     * @param entity Entity type
     * @param id Item ID
     * @returns Storage key
     */
    getKey(entity, id) {
        return `${entity}:${id}`;
    }
    /**
     * Parse an entity and ID from a storage key
     * @param key Storage key
     * @returns Entity and ID
     */
    parseKey(key) {
        const [entityStr, id] = key.split(':');
        return {
            entity: entityStr,
            id
        };
    }
    /**
     * Generate a unique ID
     * @returns Unique ID
     */
    generateId() {
        return crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
}
/**
 * Memory storage adapter implementation
 */
export class MemoryStorageAdapter {
    constructor() {
        this.storage = new Map();
    }
    /**
     * Initialize the storage
     */
    async initialize() {
        // Memory storage doesn't need initialization
    }
    /**
     * Set an item
     * @param key Storage key
     * @param value Item value
     */
    async setItem(key, value) {
        this.storage.set(key, value);
    }
    /**
     * Get an item
     * @param key Storage key
     */
    async getItem(key) {
        return this.storage.get(key) || null;
    }
    /**
     * Remove an item
     * @param key Storage key
     */
    async removeItem(key) {
        this.storage.delete(key);
    }
    /**
     * Get all keys
     */
    async keys() {
        return Array.from(this.storage.keys());
    }
    /**
     * Clear all items
     */
    async clear() {
        this.storage.clear();
    }
}
/**
 * In-memory storage provider implementation
 */
export class MemoryStorageProvider extends BaseStorageProvider {
    constructor() {
        super(...arguments);
        this.storage = new Map();
        this.entityIndices = new Map();
    }
    /**
     * Initialize the storage provider
     */
    async initialize() {
        this.isInitialized = true;
    }
    /**
     * Create an item
     * @param entity Entity type
     * @param item Item to create
     */
    async create(entity, item) {
        // Ensure item has an ID
        const itemWithId = item;
        if (!itemWithId.id) {
            itemWithId.id = this.generateId();
        }
        const id = itemWithId.id;
        const key = this.getKey(entity, id);
        // Add to entity index
        if (!this.entityIndices.has(entity)) {
            this.entityIndices.set(entity, new Set());
        }
        this.entityIndices.get(entity).add(id);
        // Store the item
        this.storage.set(key, JSON.parse(JSON.stringify(itemWithId)));
        return id;
    }
    /**
     * Get an item
     * @param entity Entity type
     * @param id Item ID
     */
    async get(entity, id) {
        const key = this.getKey(entity, id);
        const item = this.storage.get(key);
        return item ? JSON.parse(JSON.stringify(item)) : null;
    }
    /**
     * Update an item
     * @param entity Entity type
     * @param id Item ID
     * @param item Partial item data
     */
    async update(entity, id, item) {
        const key = this.getKey(entity, id);
        const existingItem = this.storage.get(key);
        if (!existingItem) {
            return false;
        }
        // Merge the items
        const updatedItem = { ...existingItem, ...item };
        this.storage.set(key, updatedItem);
        return true;
    }
    /**
     * Delete an item
     * @param entity Entity type
     * @param id Item ID
     */
    async delete(entity, id) {
        const key = this.getKey(entity, id);
        if (!this.storage.has(key)) {
            return false;
        }
        this.storage.delete(key);
        // Remove from entity index
        if (this.entityIndices.has(entity)) {
            this.entityIndices.get(entity).delete(id);
        }
        return true;
    }
    /**
     * Query items
     * @param entity Entity type
     * @param options Query options
     */
    async query(entity, options) {
        const ids = this.entityIndices.get(entity) || new Set();
        const items = [];
        for (const id of ids) {
            const key = this.getKey(entity, id);
            const item = this.storage.get(key);
            if (item) {
                // Apply filters if provided
                if (options?.filters) {
                    let matches = true;
                    for (const [field, value] of Object.entries(options.filters)) {
                        if (item[field] !== value) {
                            matches = false;
                            break;
                        }
                    }
                    if (!matches) {
                        continue;
                    }
                }
                items.push(JSON.parse(JSON.stringify(item)));
            }
        }
        // Apply sorting if provided
        if (options?.sortBy) {
            const direction = options.sortDirection === 'desc' ? -1 : 1;
            items.sort((a, b) => {
                if (a[options.sortBy] < b[options.sortBy])
                    return -1 * direction;
                if (a[options.sortBy] > b[options.sortBy])
                    return 1 * direction;
                return 0;
            });
        }
        // Apply pagination if provided
        if (options?.limit !== undefined) {
            const offset = options.offset || 0;
            return items.slice(offset, offset + options.limit);
        }
        return items;
    }
    /**
     * Clear all items of an entity
     * @param entity Entity type
     */
    async clear(entity) {
        const ids = this.entityIndices.get(entity) || new Set();
        for (const id of ids) {
            const key = this.getKey(entity, id);
            this.storage.delete(key);
        }
        this.entityIndices.delete(entity);
        return true;
    }
    /**
     * Clear all data
     */
    async clearAll() {
        this.storage.clear();
        this.entityIndices.clear();
        return true;
    }
    /**
     * Count items
     * @param entity Entity type
     */
    async count(entity) {
        return this.entityIndices.get(entity)?.size || 0;
    }
}
/**
 * Factory function to create a storage provider
 * @param type Storage type
 * @param options Provider-specific options
 * @returns Storage provider instance
 */
export function createStorageProvider(type, options) {
    // In a real implementation, this would return the appropriate storage provider
    // based on the platform (web/mobile) and options
    // For now, just return the memory storage provider
    return new MemoryStorageProvider();
}
