/**
 * Base Repository
 *
 * Provides common functionality for all repositories using the storage service.
 * This follows the Template Method pattern, allowing specific repositories to
 * customize certain behaviors while inheriting common functionality.
 */
import { StorageService } from '../storage/StorageService';
/**
 * Base repository with common CRUD operations
 */
export class BaseRepository {
    /**
     * Create a new base repository
     * @param storageKey Key for storing this entity type
     * @param storageService Optional storage service (for DI)
     */
    constructor(storageKey, storageService) {
        this.storageKey = storageKey;
        this.storageService = storageService || new StorageService({ keyPrefix: 'nutrition_app' });
    }
    /**
     * Serialize entity for storage
     * @param entity Entity to serialize
     * @returns Serialized entity
     */
    serialize(entity) {
        return {
            ...entity,
            createdAt: entity.createdAt?.toISOString(),
            updatedAt: entity.updatedAt?.toISOString(),
        };
    }
    /**
     * Deserialize entity from storage
     * @param data Serialized entity data
     * @returns Deserialized entity
     */
    deserialize(data) {
        return {
            ...data,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        };
    }
    /**
     * Get all entities
     * @returns Array of entities
     */
    async getAll() {
        try {
            const data = await this.storageService.get(this.storageKey);
            if (!data) {
                return [];
            }
            return data.map(item => this.deserialize(item));
        }
        catch (error) {
            console.error(`Error getting all ${this.storageKey}:`, error);
            return [];
        }
    }
    /**
     * Get entity by ID
     * @param id Entity ID
     * @returns Entity or null if not found
     */
    async getById(id) {
        try {
            const items = await this.getAll();
            const item = items.find(item => item.id === id);
            return item || null;
        }
        catch (error) {
            console.error(`Error getting ${this.storageKey} by ID:`, error);
            return null;
        }
    }
    /**
     * Delete entity by ID
     * @param id Entity ID
     * @returns Success status
     */
    async delete(id) {
        try {
            const items = await this.getAll();
            const filteredItems = items.filter(item => item.id !== id);
            if (items.length === filteredItems.length) {
                // Item not found, nothing to delete
                return false;
            }
            await this.saveAll(filteredItems);
            return true;
        }
        catch (error) {
            console.error(`Error deleting ${this.storageKey}:`, error);
            return false;
        }
    }
    /**
     * Save all entities (replaces existing data)
     * @param items Entities to save
     */
    async saveAll(items) {
        try {
            const serialized = items.map(item => this.serialize(item));
            await this.storageService.set(this.storageKey, serialized);
        }
        catch (error) {
            console.error(`Error saving ${this.storageKey}:`, error);
            throw error;
        }
    }
}
