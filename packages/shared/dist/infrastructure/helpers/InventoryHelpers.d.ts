/**
 * Inventory Helper Functions
 *
 * Utility functions for working with inventory items.
 */
import { InventoryItem, InventoryItemStatus } from '../../core/models/inventory';
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
 * Check if an inventory item is running low on stock
 * @param item Inventory item
 * @returns True if item is low in stock
 */
export declare function isItemLow(item: InventoryItem): boolean;
/**
 * Update inventory item status based on quantity and expiration
 * @param item Inventory item to check
 * @returns Appropriate status based on current state
 */
export declare function determineItemStatus(item: InventoryItem): InventoryItemStatus;
/**
 * Calculate total value of inventory items
 * @param items List of inventory items
 * @returns Total value
 */
export declare function calculateInventoryValue(items: InventoryItem[]): number;
/**
 * Filter items expiring within a certain timeframe
 * @param items List of inventory items
 * @param days Number of days to check
 * @returns Items expiring within specified days
 */
export declare function filterExpiringItems(items: InventoryItem[], days: number): InventoryItem[];
/**
 * Sort inventory items by various criteria
 * @param items List of inventory items
 * @param sortBy Sort criteria
 * @param ascending Sort direction (true for ascending)
 * @returns Sorted inventory items
 */
export declare function sortInventoryItems(items: InventoryItem[], sortBy: 'name' | 'expirationDate' | 'quantity' | 'category' | 'location', ascending?: boolean): InventoryItem[];
