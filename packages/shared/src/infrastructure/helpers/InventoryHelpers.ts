/**
 * Inventory Helper Functions
 * 
 * Utility functions for working with inventory items.
 */

import { isAfter, isBefore, parseISO } from 'date-fns';
import { 
  InventoryItem, 
  InventoryItemStatus 
} from '../../core/models/inventory';

/**
 * Calculate days until an inventory item expires
 * @param item Inventory item
 * @returns Days until expiration, or -1 if no expiration date
 */
export function getDaysUntilExpiration(item: InventoryItem): number {
  if (!item.expirationDate) {
    return -1;
  }
  
  const expiryDate = typeof item.expirationDate === 'string' 
    ? parseISO(item.expirationDate) 
    : item.expirationDate;
    
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if an inventory item is expired
 * @param item Inventory item
 * @returns True if item is expired
 */
export function isItemExpired(item: InventoryItem): boolean {
  if (!item.expirationDate) {
    return false;
  }
  
  const expiryDate = typeof item.expirationDate === 'string' 
    ? parseISO(item.expirationDate) 
    : item.expirationDate;
    
  return isBefore(expiryDate, new Date());
}

/**
 * Check if an inventory item is running low on stock
 * @param item Inventory item
 * @returns True if item is low in stock
 */
export function isItemLow(item: InventoryItem): boolean {
  if (!item.isStaple || !item.lowStockThreshold) {
    // Only staple items can be "low"
    return false;
  }
  
  return item.quantity <= item.lowStockThreshold;
}

/**
 * Update inventory item status based on quantity and expiration
 * @param item Inventory item to check
 * @returns Appropriate status based on current state
 */
export function determineItemStatus(item: InventoryItem): InventoryItemStatus {
  if (item.quantity <= 0) {
    return InventoryItemStatus.OUT_OF_STOCK;
  } else if (isItemExpired(item)) {
    return InventoryItemStatus.EXPIRED;
  } else if (isItemLow(item)) {
    return InventoryItemStatus.LOW;
  } else {
    return InventoryItemStatus.AVAILABLE;
  }
}

/**
 * Calculate total value of inventory items
 * @param items List of inventory items
 * @returns Total value
 */
export function calculateInventoryValue(items: InventoryItem[]): number {
  return items.reduce((total, item) => {
    if (item.purchasePrice && item.quantity > 0) {
      return total + (item.purchasePrice * item.quantity);
    }
    return total;
  }, 0);
}

/**
 * Filter items expiring within a certain timeframe
 * @param items List of inventory items
 * @param days Number of days to check
 * @returns Items expiring within specified days
 */
export function filterExpiringItems(items: InventoryItem[], days: number): InventoryItem[] {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + days);
  
  return items.filter(item => {
    if (!item.expirationDate) {
      return false;
    }
    
    const expiryDate = typeof item.expirationDate === 'string' 
      ? parseISO(item.expirationDate) 
      : item.expirationDate;
      
    return isAfter(expiryDate, now) && isBefore(expiryDate, futureDate);
  });
}

/**
 * Sort inventory items by various criteria
 * @param items List of inventory items
 * @param sortBy Sort criteria
 * @param ascending Sort direction (true for ascending)
 * @returns Sorted inventory items
 */
export function sortInventoryItems(
  items: InventoryItem[], 
  sortBy: 'name' | 'expirationDate' | 'quantity' | 'category' | 'location', 
  ascending: boolean = true
): InventoryItem[] {
  const direction = ascending ? 1 : -1;
  
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name) * direction;
        
      case 'expirationDate':
        if (!a.expirationDate && !b.expirationDate) return 0;
        if (!a.expirationDate) return direction; // Items without expiration date come last in ascending order
        if (!b.expirationDate) return -direction; // Items without expiration date come first in descending order
        
        const dateA = typeof a.expirationDate === 'string' ? parseISO(a.expirationDate) : a.expirationDate;
        const dateB = typeof b.expirationDate === 'string' ? parseISO(b.expirationDate) : b.expirationDate;
        
        return (dateA.getTime() - dateB.getTime()) * direction;
        
      case 'quantity':
        return (a.quantity - b.quantity) * direction;
        
      case 'category':
        return a.category.localeCompare(b.category) * direction;
        
      case 'location':
        return (a.locationId || '').localeCompare(b.locationId || '') * direction;
        
      default:
        return 0;
    }
  });
}
