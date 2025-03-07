/**
 * Inventory Repository Implementation
 *
 * Implements the inventory repository interface using the base repository.
 */
import { BaseRepository } from './BaseRepository';
import { IInventoryRepository } from '../../core/domain/repositories/IInventoryRepository';
import { InventoryItem, InventoryItemCreateDto, InventoryItemUpdateDto, InventoryItemStatus, StorageLocation, InventoryChangeLog, ShoppingListItem } from '../../core/models/inventory';
import { StorageService } from '../storage/StorageService';
/**
 * Storage-based implementation of the Inventory Repository
 */
export declare class InventoryRepository extends BaseRepository<InventoryItem> implements IInventoryRepository {
    private readonly logStorageKey;
    private readonly shoppingListStorageKey;
    /**
     * Create a new inventory repository
     * @param storageService Optional storage service (for DI)
     */
    constructor(storageService?: StorageService);
    /**
     * Get inventory items by category
     * @param category Category to filter by
     * @returns Inventory items in the specified category
     */
    getByCategory(category: string): Promise<InventoryItem[]>;
    /**
     * Get inventory items by status
     * @param status Status to filter by
     * @returns Inventory items with the specified status
     */
    getByStatus(status: InventoryItemStatus): Promise<InventoryItem[]>;
    /**
     * Get inventory items by location
     * @param location Location to filter by
     * @returns Inventory items in the specified location
     */
    getByLocation(location: StorageLocation): Promise<InventoryItem[]>;
    /**
     * Get expiring inventory items
     * @param daysThreshold Number of days to consider for expiration
     * @returns Inventory items expiring within the specified days
     */
    getExpiringItems(daysThreshold: number): Promise<InventoryItem[]>;
    /**
     * Add a new inventory item
     * @param item Inventory item data
     * @returns The added inventory item with ID and timestamps
     */
    add(item: InventoryItemCreateDto): Promise<InventoryItem>;
    /**
     * Add multiple inventory items
     * @param items List of inventory items data
     * @returns The added inventory items with IDs and timestamps
     */
    addMany(items: InventoryItemCreateDto[]): Promise<InventoryItem[]>;
    /**
     * Update an existing inventory item
     * @param id ID of the inventory item to update
     * @param updates Updated inventory item data
     * @returns True if successfully updated, false otherwise
     */
    update(id: string, updates: InventoryItemUpdateDto): Promise<boolean>;
    /**
     * Update the quantity of an inventory item
     * @param id ID of the inventory item to update
     * @param quantity New quantity
     * @returns True if successfully updated, false otherwise
     */
    updateQuantity(id: string, quantity: number): Promise<boolean>;
    /**
     * Log an inventory change
     * @param log Change log entry
     */
    private logInventoryChange;
    /**
     * Get inventory change logs
     * @param itemId Optional item ID to filter logs
     * @param limit Maximum number of logs to return
     * @returns List of inventory change logs
     */
    getChangeLogs(itemId?: string, limit?: number): Promise<InventoryChangeLog[]>;
    /**
     * Get the shopping list
     * @returns The current shopping list
     */
    getShoppingList(): Promise<ShoppingListItem[]>;
    /**
     * Save the shopping list
     * @param items Shopping list items
     */
    private saveShoppingList;
    /**
     * Update a shopping list item
     * @param id ID of the shopping list item to update
     * @param updates Updated shopping list item data
     * @returns True if successfully updated, false otherwise
     */
    updateShoppingListItem(id: string, updates: Partial<ShoppingListItem>): Promise<boolean>;
    /**
     * Mark a shopping list item as purchased
     * @param id ID of the shopping list item
     * @param isPurchased Whether the item is purchased
     * @returns True if successfully updated, false otherwise
     */
    markAsPurchased(id: string, isPurchased: boolean): Promise<boolean>;
    /**
     * Add inventory items from purchased shopping list items
     * @param shoppingListIds IDs of purchased shopping list items
     * @returns True if successfully added, false otherwise
     */
    addInventoryFromPurchased(shoppingListIds: string[]): Promise<boolean>;
}
