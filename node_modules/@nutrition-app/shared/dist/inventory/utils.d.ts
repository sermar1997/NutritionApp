/**
 * Inventory utilities
 */
import { InventoryItem, InventoryStats, ShoppingListItem, InventoryAlert } from './types';
/**
 * Calculate days until an inventory item expires
 * @param item Inventory item
 * @returns Days until expiration, or -1 if no expiration date
 */
export declare function getDaysUntilExpiration(item: InventoryItem): number;
/**
 * Check if an inventory item is expired
 * @param item Inventory item
 * @returns True if item is expired
 */
export declare function isItemExpired(item: InventoryItem): boolean;
/**
 * Check if an inventory item is running low
 * @param item Inventory item
 * @returns True if item is low in stock
 */
export declare function isItemLow(item: InventoryItem): boolean;
/**
 * Update item status based on quantity and expiration
 * @param item Inventory item to update
 * @returns Updated inventory item with correct status
 */
export declare function updateItemStatus(item: InventoryItem): InventoryItem;
/**
 * Calculate total value of inventory items
 * @param items List of inventory items
 * @returns Total value
 */
export declare function calculateInventoryValue(items: InventoryItem[]): number;
/**
 * Get items that are expiring soon
 * @param items List of inventory items
 * @param daysThreshold Number of days to consider as "soon" (default: 7)
 * @returns List of items expiring soon
 */
export declare function getExpiringItems(items: InventoryItem[], daysThreshold?: number): InventoryItem[];
/**
 * Calculate inventory statistics
 * @param items List of inventory items
 * @returns Inventory statistics
 */
export declare function calculateInventoryStats(items: InventoryItem[]): InventoryStats;
/**
 * Generate shopping list from inventory
 * @param items List of inventory items
 * @returns Shopping list items for low or out of stock staple items
 */
export declare function generateShoppingList(items: InventoryItem[]): ShoppingListItem[];
/**
 * Generate alerts from inventory items
 * @param items List of inventory items
 * @returns List of inventory alerts
 */
export declare function generateInventoryAlerts(items: InventoryItem[]): InventoryAlert[];
/**
 * Sort inventory items by various criteria
 * @param items List of inventory items
 * @param sortBy Sort criteria
 * @param ascending True for ascending order, false for descending
 * @returns Sorted inventory items
 */
export declare function sortInventoryItems(items: InventoryItem[], sortBy: 'name' | 'expirationDate' | 'quantity' | 'category' | 'location', ascending?: boolean): InventoryItem[];
