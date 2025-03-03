/**
 * Storage utilities
 */

import { StorageAdapter, StorageEntity, StorageProvider, StorageType, QueryOptions } from './types';

/**
 * Base storage provider implementation
 */
export abstract class BaseStorageProvider implements StorageProvider {
  protected isInitialized: boolean = false;
  
  /**
   * Initialize the storage provider
   */
  abstract initialize(options?: any): Promise<void>;
  
  /**
   * Check if the storage is ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }
  
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
  protected getKey(entity: StorageEntity, id: string): string {
    return `${entity}:${id}`;
  }
  
  /**
   * Parse an entity and ID from a storage key
   * @param key Storage key
   * @returns Entity and ID
   */
  protected parseKey(key: string): { entity: StorageEntity, id: string } {
    const [entityStr, id] = key.split(':');
    return {
      entity: entityStr as StorageEntity,
      id
    };
  }
  
  /**
   * Generate a unique ID
   * @returns Unique ID
   */
  protected generateId(): string {
    return crypto.randomUUID 
      ? crypto.randomUUID() 
      : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}

/**
 * Memory storage adapter implementation
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private storage: Map<string, string> = new Map();
  
  /**
   * Initialize the storage
   */
  async initialize(): Promise<void> {
    // Memory storage doesn't need initialization
  }
  
  /**
   * Set an item
   * @param key Storage key
   * @param value Item value
   */
  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }
  
  /**
   * Get an item
   * @param key Storage key
   */
  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }
  
  /**
   * Remove an item
   * @param key Storage key
   */
  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }
  
  /**
   * Get all keys
   */
  async keys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }
  
  /**
   * Clear all items
   */
  async clear(): Promise<void> {
    this.storage.clear();
  }
}

/**
 * In-memory storage provider implementation
 */
export class MemoryStorageProvider extends BaseStorageProvider {
  private storage: Map<string, any> = new Map();
  private entityIndices: Map<StorageEntity, Set<string>> = new Map();
  
  /**
   * Initialize the storage provider
   */
  async initialize(): Promise<void> {
    this.isInitialized = true;
  }
  
  /**
   * Create an item
   * @param entity Entity type
   * @param item Item to create
   */
  async create<T>(entity: StorageEntity, item: T): Promise<string> {
    // Ensure item has an ID
    const itemWithId = item as any;
    if (!itemWithId.id) {
      itemWithId.id = this.generateId();
    }
    
    const id = itemWithId.id;
    const key = this.getKey(entity, id);
    
    // Add to entity index
    if (!this.entityIndices.has(entity)) {
      this.entityIndices.set(entity, new Set());
    }
    this.entityIndices.get(entity)!.add(id);
    
    // Store the item
    this.storage.set(key, JSON.parse(JSON.stringify(itemWithId)));
    
    return id;
  }
  
  /**
   * Get an item
   * @param entity Entity type
   * @param id Item ID
   */
  async get<T>(entity: StorageEntity, id: string): Promise<T | null> {
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
  async update<T>(entity: StorageEntity, id: string, item: Partial<T>): Promise<boolean> {
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
  async delete(entity: StorageEntity, id: string): Promise<boolean> {
    const key = this.getKey(entity, id);
    
    if (!this.storage.has(key)) {
      return false;
    }
    
    this.storage.delete(key);
    
    // Remove from entity index
    if (this.entityIndices.has(entity)) {
      this.entityIndices.get(entity)!.delete(id);
    }
    
    return true;
  }
  
  /**
   * Query items
   * @param entity Entity type
   * @param options Query options
   */
  async query<T>(entity: StorageEntity, options?: QueryOptions): Promise<T[]> {
    const ids = this.entityIndices.get(entity) || new Set();
    const items: T[] = [];
    
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
      items.sort((a: any, b: any) => {
        if (a[options.sortBy!] < b[options.sortBy!]) return -1 * direction;
        if (a[options.sortBy!] > b[options.sortBy!]) return 1 * direction;
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
  async clear(entity: StorageEntity): Promise<boolean> {
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
  async clearAll(): Promise<boolean> {
    this.storage.clear();
    this.entityIndices.clear();
    return true;
  }
  
  /**
   * Count items
   * @param entity Entity type
   */
  async count(entity: StorageEntity): Promise<number> {
    return this.entityIndices.get(entity)?.size || 0;
  }
}

/**
 * Factory function to create a storage provider
 * @param storageType Storage type
 * @returns Storage provider instance
 */
export function createStorageProvider(storageType: StorageType): StorageProvider {
  // In a real implementation, this would return the appropriate storage provider
  // based on the platform (web/mobile) and options
  
  // For now, just return the memory storage provider
  return new MemoryStorageProvider();
}
