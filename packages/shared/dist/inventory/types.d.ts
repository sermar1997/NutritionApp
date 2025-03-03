/**
 * Inventory module types
 */
import { NutritionInfo } from '../models';
/**
 * Inventory item status
 */
export declare enum InventoryItemStatus {
    AVAILABLE = "AVAILABLE",// Item is available for use
    LOW = "LOW",// Running low on this item
    EXPIRED = "EXPIRED",// Item has expired
    OUT_OF_STOCK = "OUT_OF_STOCK"
}
/**
 * Inventory location in kitchen
 */
export declare enum StorageLocation {
    REFRIGERATOR = "REFRIGERATOR",
    FREEZER = "FREEZER",
    PANTRY = "PANTRY",
    SPICE_RACK = "SPICE_RACK",
    OTHER = "OTHER"
}
/**
 * Interface for inventory items
 */
export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    expirationDate?: Date;
    purchaseDate?: Date;
    status: InventoryItemStatus;
    location: StorageLocation;
    nutritionPer100g?: NutritionInfo;
    barcode?: string;
    imageUrl?: string;
    notes?: string;
    isStaple: boolean;
    minStockLevel?: number;
    costPerUnit?: number;
}
/**
 * Shopping list item interface
 */
export interface ShoppingListItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    isPurchased: boolean;
    category: string;
    priority: number;
    estimatedCost?: number;
    notes?: string;
    relatedInventoryItemId?: string;
}
/**
 * Inventory statistics interface
 */
export interface InventoryStats {
    totalItems: number;
    expiringWithin7Days: number;
    expiredItems: number;
    lowStockItems: number;
    totalValue: number;
    mostStockedCategory: string;
    recentlyUsedItems: number;
}
/**
 * Item usage history entry
 */
export interface UsageHistoryEntry {
    id: string;
    inventoryItemId: string;
    quantityUsed: number;
    unit: string;
    date: Date;
    usedInRecipeId?: string;
    usedByUserId: string;
}
/**
 * Inventory change type
 */
export declare enum InventoryChangeType {
    ADDED = "ADDED",// Item added to inventory
    REMOVED = "REMOVED",// Item removed from inventory
    UPDATED = "UPDATED",// Item details updated
    USED = "USED",// Item used in cooking
    EXPIRED = "EXPIRED",// Item marked as expired
    PURCHASED = "PURCHASED"
}
/**
 * Inventory change log entry
 */
export interface InventoryChangeLog {
    id: string;
    timestamp: Date;
    itemId: string;
    itemName: string;
    changeType: InventoryChangeType;
    quantity?: number;
    userId: string;
    notes?: string;
}
/**
 * Inventory alert types
 */
export declare enum InventoryAlertType {
    EXPIRATION = "EXPIRATION",// Alert for expiration
    LOW_STOCK = "LOW_STOCK",// Alert for low stock
    OUT_OF_STOCK = "OUT_OF_STOCK"
}
/**
 * Inventory alert interface
 */
export interface InventoryAlert {
    id: string;
    itemId: string;
    itemName: string;
    alertType: InventoryAlertType;
    createdAt: Date;
    isRead: boolean;
    message: string;
    actionRequired: boolean;
}
