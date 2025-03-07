/**
 * Base Repository
 *
 * Provides common functionality for all repositories using the storage service.
 * This follows the Template Method pattern, allowing specific repositories to
 * customize certain behaviors while inheriting common functionality.
 */
import { BaseEntity } from '../../core/models/common';
import { StorageService } from '../storage/StorageService';
/**
 * Base repository with common CRUD operations
 */
export declare abstract class BaseRepository<T extends BaseEntity> {
    protected readonly storageKey: string;
    protected storageService: StorageService;
    /**
     * Create a new base repository
     * @param storageKey Key for storing this entity type
     * @param storageService Optional storage service (for DI)
     */
    constructor(storageKey: string, storageService?: StorageService);
    /**
     * Serialize entity for storage
     * @param entity Entity to serialize
     * @returns Serialized entity
     */
    protected serialize(entity: T): any;
    /**
     * Deserialize entity from storage
     * @param data Serialized entity data
     * @returns Deserialized entity
     */
    protected deserialize(data: any): T;
    /**
     * Get all entities
     * @returns Array of entities
     */
    getAll(): Promise<T[]>;
    /**
     * Get entity by ID
     * @param id Entity ID
     * @returns Entity or null if not found
     */
    getById(id: string): Promise<T | null>;
    /**
     * Delete entity by ID
     * @param id Entity ID
     * @returns Success status
     */
    delete(id: string): Promise<boolean>;
    /**
     * Save all entities (replaces existing data)
     * @param items Entities to save
     */
    protected saveAll(items: T[]): Promise<void>;
}
