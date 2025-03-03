/**
 * Storage types
 */
/**
 * Storage provider types
 */
export declare enum StorageType {
    INDEXED_DB = "INDEXED_DB",
    LOCAL_STORAGE = "LOCAL_STORAGE",
    ASYNC_STORAGE = "ASYNC_STORAGE",
    SQLITE = "SQLITE",
    MEMORY = "MEMORY"
}
/**
 * Storage entity type
 */
export declare enum StorageEntity {
    USER = "USER",
    INGREDIENT = "INGREDIENT",
    INVENTORY = "INVENTORY",
    RECIPE = "RECIPE",
    MEAL_PLAN = "MEAL_PLAN",
    NUTRITION = "NUTRITION",
    SUBSCRIPTION = "SUBSCRIPTION",
    IMAGE = "IMAGE",
    SETTINGS = "SETTINGS"
}
/**
 * Storage operation type
 */
export declare enum StorageOperation {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    QUERY = "QUERY"
}
/**
 * Storage query options
 */
export interface QueryOptions {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    filters?: Record<string, any>;
}
/**
 * Storage provider interface
 */
export interface StorageProvider {
    /**
     * Initialize the storage provider
     * @param options Provider-specific options
     */
    initialize(options?: any): Promise<void>;
    /**
     * Check if the storage provider is ready
     */
    isReady(): boolean;
    /**
     * Create an item
     * @param entity Entity type
     * @param item Item to create
     * @returns Created item ID
     */
    create<T>(entity: StorageEntity, item: T): Promise<string>;
    /**
     * Get an item by ID
     * @param entity Entity type
     * @param id Item ID
     * @returns Item or null if not found
     */
    get<T>(entity: StorageEntity, id: string): Promise<T | null>;
    /**
     * Update an item
     * @param entity Entity type
     * @param id Item ID
     * @param item Item data or partial update
     * @returns True if updated
     */
    update<T>(entity: StorageEntity, id: string, item: Partial<T>): Promise<boolean>;
    /**
     * Delete an item
     * @param entity Entity type
     * @param id Item ID
     * @returns True if deleted
     */
    delete(entity: StorageEntity, id: string): Promise<boolean>;
    /**
     * Query items
     * @param entity Entity type
     * @param options Query options
     * @returns Array of items
     */
    query<T>(entity: StorageEntity, options?: QueryOptions): Promise<T[]>;
    /**
     * Clear all items of an entity type
     * @param entity Entity type
     * @returns True if cleared
     */
    clear(entity: StorageEntity): Promise<boolean>;
    /**
     * Clear all data from storage
     * @returns True if cleared
     */
    clearAll(): Promise<boolean>;
    /**
     * Get the count of items for an entity
     * @param entity Entity type
     * @returns Number of items
     */
    count(entity: StorageEntity): Promise<number>;
}
/**
 * Interface for a storage adapter - used to implement platform-specific storage
 */
export interface StorageAdapter {
    /**
     * Initialize the storage
     */
    initialize(): Promise<void>;
    /**
     * Set an item
     * @param key Storage key
     * @param value Item value
     */
    setItem(key: string, value: string): Promise<void>;
    /**
     * Get an item
     * @param key Storage key
     * @returns Item value or null
     */
    getItem(key: string): Promise<string | null>;
    /**
     * Remove an item
     * @param key Storage key
     */
    removeItem(key: string): Promise<void>;
    /**
     * Get all keys
     * @returns Array of keys
     */
    keys(): Promise<string[]>;
    /**
     * Clear all items
     */
    clear(): Promise<void>;
}
