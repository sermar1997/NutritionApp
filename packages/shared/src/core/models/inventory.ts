/**
 * Inventory Models
 * 
 * Defines the data models for inventory management.
 */

import { BaseEntity } from './common';
import { NutritionInfo } from './nutrition';

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
export interface InventoryItem extends BaseEntity {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  locationId: StorageLocation;
  expirationDate?: Date;
  nutritionInfo?: NutritionInfo;
  imageUrl?: string;
  barcode?: string;
  isStaple: boolean;
  status: InventoryItemStatus;
  lowStockThreshold?: number;
  purchasePrice?: number;
  purchaseDate?: Date;
  notes?: string;
}

/**
 * DTO for creating an inventory item
 */
export interface InventoryItemCreateDto {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  locationId: StorageLocation;
  expirationDate?: Date;
  nutritionInfo?: NutritionInfo;
  imageUrl?: string;
  barcode?: string;
  isStaple: boolean;
  lowStockThreshold?: number;
  purchasePrice?: number;
  purchaseDate?: Date;
  notes?: string;
}

/**
 * DTO for updating an inventory item
 */
export interface InventoryItemUpdateDto {
  name?: string;
  quantity?: number;
  unit?: string;
  category?: string;
  locationId?: StorageLocation;
  expirationDate?: Date;
  nutritionInfo?: NutritionInfo;
  imageUrl?: string;
  barcode?: string;
  isStaple?: boolean;
  status?: InventoryItemStatus;
  lowStockThreshold?: number;
  purchasePrice?: number;
  purchaseDate?: Date;
  notes?: string;
}

/**
 * Shopping list item interface
 */
export interface ShoppingListItem extends BaseEntity {
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
export interface UsageHistoryEntry extends BaseEntity {
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
export enum InventoryChangeType {
  ADDED = 'ADDED',
  REMOVED = 'REMOVED',
  UPDATED = 'UPDATED',
  EXPIRED = 'EXPIRED',
  USED_IN_RECIPE = 'USED_IN_RECIPE',
  PURCHASED = 'PURCHASED',
  WASTED = 'WASTED',
  DONATED = 'DONATED',
  OTHER = 'OTHER'
}

/**
 * Inventory change log entry
 */
export interface InventoryChangeLog extends BaseEntity {
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
export enum InventoryAlertType {
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PRICE_DROP = 'PRICE_DROP',
  RESTOCKED = 'RESTOCKED',
  CONSUMPTION_TREND = 'CONSUMPTION_TREND'
}

/**
 * Inventory alert interface
 */
export interface InventoryAlert extends BaseEntity {
  itemId: string;
  itemName: string;
  alertType: InventoryAlertType;
  createdAt: Date;
  isRead: boolean;
  message: string;
  actionRequired: boolean;
}
