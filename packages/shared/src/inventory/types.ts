/**
 * Inventory module types
 */

import { NutritionInfo } from '../models';

/**
 * Inventory item status
 */
export enum InventoryItemStatus {
  AVAILABLE = 'AVAILABLE',     // Item is available for use
  LOW = 'LOW',                // Running low on this item
  EXPIRED = 'EXPIRED',        // Item has expired
  OUT_OF_STOCK = 'OUT_OF_STOCK', // Item is not currently in stock
}

/**
 * Inventory location in kitchen
 */
export enum StorageLocation {
  REFRIGERATOR = 'REFRIGERATOR',
  FREEZER = 'FREEZER',
  PANTRY = 'PANTRY',
  SPICE_RACK = 'SPICE_RACK',
  OTHER = 'OTHER',
}

/**
 * Interface for inventory items
 */
export interface InventoryItem {
  id: string;             // Unique identifier
  name: string;           // Name of the ingredient
  category: string;       // Category (e.g., Fruits, Vegetables, Dairy)
  quantity: number;       // Quantity available
  unit: string;           // Unit of measurement (e.g., grams, pieces)
  expirationDate?: Date;  // Expiration date if applicable
  purchaseDate?: Date;    // Date when item was purchased
  status: InventoryItemStatus; // Current status
  location: StorageLocation;  // Where the item is stored
  nutritionPer100g?: NutritionInfo; // Nutritional information per 100g
  barcode?: string;       // Optional barcode
  imageUrl?: string;      // Optional image of the item
  notes?: string;         // Any additional notes
  isStaple: boolean;      // Whether this is a staple item always kept in stock
  minStockLevel?: number; // Minimum stock level for staple items
  costPerUnit?: number;   // Cost per unit for budget tracking
}

/**
 * Shopping list item interface
 */
export interface ShoppingListItem {
  id: string;            // Unique identifier
  name: string;          // Name of the ingredient
  quantity: number;      // Quantity to purchase
  unit: string;          // Unit of measurement
  isPurchased: boolean;  // Whether the item has been purchased
  category: string;      // Shopping category (e.g., Produce, Dairy)
  priority: number;      // Priority level (1-5, with 1 being highest)
  estimatedCost?: number; // Estimated cost
  notes?: string;        // Additional notes
  relatedInventoryItemId?: string; // Related inventory item if applicable
}

/**
 * Inventory statistics interface
 */
export interface InventoryStats {
  totalItems: number;            // Total number of items
  expiringWithin7Days: number;   // Items expiring within 7 days
  expiredItems: number;          // Items already expired
  lowStockItems: number;         // Items with low stock
  totalValue: number;            // Total inventory value
  mostStockedCategory: string;   // Category with most items
  recentlyUsedItems: number;     // Items used in the last 7 days
}

/**
 * Item usage history entry
 */
export interface UsageHistoryEntry {
  id: string;                 // Unique identifier
  inventoryItemId: string;    // ID of the inventory item
  quantityUsed: number;       // Quantity used
  unit: string;               // Unit of measurement
  date: Date;                 // Date when used
  usedInRecipeId?: string;    // ID of the recipe if used in cooking
  usedByUserId: string;       // ID of the user who used the item
}

/**
 * Inventory change type
 */
export enum InventoryChangeType {
  ADDED = 'ADDED',            // Item added to inventory
  REMOVED = 'REMOVED',        // Item removed from inventory
  UPDATED = 'UPDATED',        // Item details updated
  USED = 'USED',              // Item used in cooking
  EXPIRED = 'EXPIRED',        // Item marked as expired
  PURCHASED = 'PURCHASED',    // Item purchased
}

/**
 * Inventory change log entry
 */
export interface InventoryChangeLog {
  id: string;                 // Unique identifier
  timestamp: Date;            // When the change occurred
  itemId: string;             // ID of the item
  itemName: string;           // Name of the item
  changeType: InventoryChangeType; // Type of change
  quantity?: number;          // Quantity changed if applicable
  userId: string;             // ID of the user who made the change
  notes?: string;             // Additional notes about the change
}

/**
 * Inventory alert types
 */
export enum InventoryAlertType {
  EXPIRATION = 'EXPIRATION',   // Alert for expiration
  LOW_STOCK = 'LOW_STOCK',     // Alert for low stock
  OUT_OF_STOCK = 'OUT_OF_STOCK', // Alert for out of stock
}

/**
 * Inventory alert interface
 */
export interface InventoryAlert {
  id: string;                  // Unique identifier
  itemId: string;              // ID of the affected item
  itemName: string;            // Name of the affected item
  alertType: InventoryAlertType; // Type of alert
  createdAt: Date;             // When the alert was created
  isRead: boolean;             // Whether the alert has been read
  message: string;             // Alert message
  actionRequired: boolean;     // Whether action is required
}
