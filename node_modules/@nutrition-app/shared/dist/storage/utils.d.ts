/**
 * Storage utilities
 */
import { StorageAdapter, StorageEntity, StorageProvider, StorageType, QueryOptions } from './types';
/**
 * Base storage provider implementation
 */
export declare abstract class BaseStorageProvider implements StorageProvider {
    protected isInitialized: boolean;
    /**
     * Initialize the storage provider
     */
    abstract initialize(options?: any): Promise<void>;
    /**
     * Check if the storage is ready
     */
    isReady(): boolean;
    /**
     * Create an item
     * @param entity Entity type
     * @param item Item to create
     */
    abstract create<T>(entity: StorageEntity, item: T): Promise<string>;
    /**
     * Get an item
     * @param entity Entity type
     * @param id Item ID
     */
    abstract get<T>(entity: StorageEntity, id: string): Promise<T | null>;
    /**
     * Update an item
     * @param entity Entity type
     * @param id Item ID
     * @param item Item data
     */
    abstract update<T>(entity: StorageEntity, id: string, item: Partial<T>): Promise<boolean>;
    /**
     * Delete an item
     * @param entity Entity type
     * @param id Item ID
     */
    abstract delete(entity: StorageEntity, id: string): Promise<boolean>;
    /**
     * Query items
     * @param entity Entity type
     * @param options Query options
     */
    abstract query<T>(entity: StorageEntity, options?: QueryOptions): Promise<T[]>;
    /**
     * Clear all items of an entity
     * @param entity Entity type
     */
    abstract clear(entity: StorageEntity): Promise<boolean>;
    /**
     * Clear all data
     */
    abstract clearAll(): Promise<boolean>;
    /**
     * Count items
     * @param entity Entity type
     */
    abstract count(entity: StorageEntity): Promise<number>;
    /**
     * Generate a storage key for an entity and ID
     * @param entity Entity type
     * @param id Item ID
     * @returns Storage key
     */
    protected getKey(entity: StorageEntity, id: string): string;
    /**
     * Parse an entity and ID from a storage key
     * @param key Storage key
     * @returns Entity and ID
     */
    protected parseKey(key: string): {
        entity: StorageEntity;
        id: string;
    };
    /**
     * Generate a unique ID
     * @returns Unique ID
     */
    protected generateId(): string;
}
/**
 * Memory storage adapter implementation
 */
export declare class MemoryStorageAdapter implements StorageAdapter {
    private storage;
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
     */
    getItem(key: string): Promise<string | null>;
    /**
     * Remove an item
     * @param key Storage key
     */
    removeItem(key: string): Promise<void>;
    /**
     * Get all keys
     */
    keys(): Promise<string[]>;
    /**
     * Clear all items
     */
    clear(): Promise<void>;
}
/**
 * In-memory storage provider implementation
 */
export declare class MemoryStorageProvider extends BaseStorageProvider {
    private storage;
    private entityIndices;
    /**
     * Initialize the storage provider
     */
    initialize(): Promise<void>;
    /**
     * Create an item
     * @param entity Entity type
     * @param item Item to create
     */
    create<T>(entity: StorageEntity, item: T): Promise<string>;
    /**
     * Get an item
     * @param entity Entity type
     * @param id Item ID
     */
    get<T>(entity: StorageEntity, id: string): Promise<T | null>;
    /**
     * Update an item
     * @param entity Entity type
     * @param id Item ID
     * @param item Partial item data
     */
    update<T>(entity: StorageEntity, id: string, item: Partial<T>): Promise<boolean>;
    /**
     * Delete an item
     * @param entity Entity type
     * @param id Item ID
     */
    delete(entity: StorageEntity, id: string): Promise<boolean>;
    /**
     * Query items
     * @param entity Entity type
     * @param options Query options
     */
    query<T>(entity: StorageEntity, options?: QueryOptions): Promise<T[]>;
    /**
     * Clear all items of an entity
     * @param entity Entity type
     */
    clear(entity: StorageEntity): Promise<boolean>;
    /**
     * Clear all data
     */
    clearAll(): Promise<boolean>;
    /**
     * Count items
     * @param entity Entity type
     */
    count(entity: StorageEntity): Promise<number>;
}
/**
 * Factory function to create a storage provider
 * @param type Storage type
 * @param options Provider-specific options
 * @returns Storage provider instance
 */
export declare function createStorageProvider(type: StorageType, options?: any): StorageProvider;
