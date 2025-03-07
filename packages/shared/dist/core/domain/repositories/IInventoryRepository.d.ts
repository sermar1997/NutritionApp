/**
 * Inventory Repository Interface
 *
 * Defines methods for managing inventory items in storage.
 */
import { InventoryItem, InventoryItemCreateDto, InventoryItemUpdateDto, InventoryItemStatus, StorageLocation, InventoryChangeLog, ShoppingListItem } from '../../models/inventory';
/**
 * Repository interface for inventory operations
 */
export interface IInventoryRepository {
    /**
     * Get all inventory items
     * @returns All inventory items
     */
    getAll(): Promise<InventoryItem[]>;
    /**
     * Get an inventory item by ID
     * @param id Inventory item ID
     * @returns The inventory item or null if not found
     */
    getById(id: string): Promise<InventoryItem | null>;
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
     * Delete an inventory item
     * @param id ID of the inventory item to delete
     * @returns True if successfully deleted, false otherwise
     */
    delete(id: string): Promise<boolean>;
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
