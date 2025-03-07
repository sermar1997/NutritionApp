/**
 * Inventory Service Interface
 * 
 * Defines business logic operations for managing inventory.
 */

import { 
  InventoryItem, 
  InventoryItemCreateDto, 
  InventoryItemUpdateDto,
  InventoryStats,
  ShoppingListItem,
  InventoryAlert,
  StorageLocation
} from '../../models/inventory';

/**
 * Service interface for inventory operations
 */
export interface IInventoryService {
  /**
   * Get all inventory items
   * @returns All inventory items
   */
  getAllItems(): Promise<InventoryItem[]>;
  
  /**
   * Get an inventory item by ID
   * @param id Inventory item ID
   * @returns The inventory item or null if not found
   */
  getItemById(id: string): Promise<InventoryItem | null>;
  
  /**
   * Add a new inventory item
   * @param item Inventory item data
   * @returns The added inventory item
   */
  addItem(item: InventoryItemCreateDto): Promise<InventoryItem>;
  
  /**
   * Update an existing inventory item
   * @param id ID of the inventory item to update
   * @param updates Updated inventory item data
   * @returns True if successfully updated, false otherwise
   */
  updateItem(id: string, updates: InventoryItemUpdateDto): Promise<boolean>;
  
  /**
   * Delete an inventory item
   * @param id ID of the inventory item to delete
   * @returns True if successfully deleted, false otherwise
   */
  deleteItem(id: string): Promise<boolean>;
  
  /**
   * Calculate inventory statistics
   * @returns Inventory statistics
   */
  calculateInventoryStats(): Promise<InventoryStats>;
  
  /**
   * Find items by name, partial match
   * @param searchText Text to search for
   * @returns Matching inventory items
   */
  searchItems(searchText: string): Promise<InventoryItem[]>;
  
  /**
   * Generate a shopping list based on low or out of stock items
   * @param includeOutOfStock Include out of stock items
   * @param includeLowStock Include low stock items
   * @returns Generated shopping list
   */
  generateShoppingList(
    includeOutOfStock: boolean, 
    includeLowStock: boolean
  ): Promise<ShoppingListItem[]>;
  
  /**
   * Get inventory items expiring within a certain number of days
   * @param days Number of days to check
   * @returns Items expiring within the specified days
   */
  getExpiringItems(days: number): Promise<InventoryItem[]>;
  
  /**
   * Update the status of all inventory items based on their current state
   * @returns Number of items updated
   */
  refreshItemStatuses(): Promise<number>;
  
  /**
   * Use inventory items for a recipe
   * @param recipeId Recipe ID
   * @param servings Number of servings
   * @returns Updated inventory items
   */
  useItemsForRecipe(recipeId: string, servings: number): Promise<InventoryItem[]>;
  
  /**
   * Generate inventory alerts
   * @returns Current inventory alerts
   */
  generateAlerts(): Promise<InventoryAlert[]>;
  
  /**
   * Get inventory items by location
   * @param location Storage location
   * @returns Items in the specified location
   */
  getItemsByLocation(location: StorageLocation): Promise<InventoryItem[]>;
  
  /**
   * Sort inventory items
   * @param sortBy Property to sort by
   * @param ascending Sort direction
   * @returns Sorted inventory items
   */
  sortItems(
    sortBy: 'name' | 'expirationDate' | 'quantity' | 'category' | 'location', 
    ascending: boolean
  ): Promise<InventoryItem[]>;
}
