/**
 * Inventory utilities
 */
import { isAfter, isBefore, parseISO, addDays } from 'date-fns';
import { InventoryItemStatus, InventoryAlertType } from './types';
/**
 * Calculate days until an inventory item expires
 * @param item Inventory item
 * @returns Days until expiration, or -1 if no expiration date
 */
export function getDaysUntilExpiration(item) {
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
export function isItemExpired(item) {
    if (!item.expirationDate) {
        return false;
    }
    const expiryDate = typeof item.expirationDate === 'string'
        ? parseISO(item.expirationDate)
        : item.expirationDate;
    return isBefore(expiryDate, new Date());
}
/**
 * Check if an inventory item is running low
 * @param item Inventory item
 * @returns True if item is low in stock
 */
export function isItemLow(item) {
    if (!item.isStaple || !item.minStockLevel) {
        // Only staple items can be "low"
        return false;
    }
    return item.quantity <= item.minStockLevel;
}
/**
 * Update item status based on quantity and expiration
 * @param item Inventory item to update
 * @returns Updated inventory item with correct status
 */
export function updateItemStatus(item) {
    const updatedItem = { ...item };
    if (item.quantity <= 0) {
        updatedItem.status = InventoryItemStatus.OUT_OF_STOCK;
    }
    else if (isItemExpired(item)) {
        updatedItem.status = InventoryItemStatus.EXPIRED;
    }
    else if (isItemLow(item)) {
        updatedItem.status = InventoryItemStatus.LOW;
    }
    else {
        updatedItem.status = InventoryItemStatus.AVAILABLE;
    }
    return updatedItem;
}
/**
 * Calculate total value of inventory items
 * @param items List of inventory items
 * @returns Total value
 */
export function calculateInventoryValue(items) {
    return items.reduce((total, item) => {
        if (item.costPerUnit && item.quantity > 0) {
            return total + (item.costPerUnit * item.quantity);
        }
        return total;
    }, 0);
}
/**
 * Get items that are expiring soon
 * @param items List of inventory items
 * @param daysThreshold Number of days to consider as "soon" (default: 7)
 * @returns List of items expiring soon
 */
export function getExpiringItems(items, daysThreshold = 7) {
    return items.filter(item => {
        const daysUntilExpiry = getDaysUntilExpiration(item);
        return daysUntilExpiry >= 0 && daysUntilExpiry <= daysThreshold;
    });
}
/**
 * Calculate inventory statistics
 * @param items List of inventory items
 * @returns Inventory statistics
 */
export function calculateInventoryStats(items) {
    const now = new Date();
    const sevenDaysFromNow = addDays(now, 7);
    // Items expiring within 7 days
    const expiringItems = items.filter(item => {
        if (!item.expirationDate)
            return false;
        const expiryDate = typeof item.expirationDate === 'string'
            ? parseISO(item.expirationDate)
            : item.expirationDate;
        return isAfter(expiryDate, now) && isBefore(expiryDate, sevenDaysFromNow);
    });
    // Already expired items
    const expiredItems = items.filter(item => isItemExpired(item));
    // Low stock items
    const lowStockItems = items.filter(item => isItemLow(item));
    // Calculate most stocked category
    const categoryCount = {};
    items.forEach(item => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    let mostStockedCategory = '';
    let highestCount = 0;
    Object.entries(categoryCount).forEach(([category, count]) => {
        if (count > highestCount) {
            highestCount = count;
            mostStockedCategory = category;
        }
    });
    return {
        totalItems: items.length,
        expiringWithin7Days: expiringItems.length,
        expiredItems: expiredItems.length,
        lowStockItems: lowStockItems.length,
        totalValue: calculateInventoryValue(items),
        mostStockedCategory,
        recentlyUsedItems: 0, // This would require usage history
    };
}
/**
 * Generate shopping list from inventory
 * @param items List of inventory items
 * @returns Shopping list items for low or out of stock staple items
 */
export function generateShoppingList(items) {
    return items
        .filter(item => item.isStaple && (isItemLow(item) || item.status === InventoryItemStatus.OUT_OF_STOCK))
        .map(item => {
        const quantityNeeded = item.minStockLevel
            ? Math.max(0, item.minStockLevel - item.quantity)
            : 1;
        return {
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
            name: item.name,
            quantity: quantityNeeded,
            unit: item.unit,
            isPurchased: false,
            category: item.category,
            priority: 3, // Medium priority by default
            estimatedCost: item.costPerUnit ? item.costPerUnit * quantityNeeded : undefined,
            relatedInventoryItemId: item.id,
        };
    });
}
/**
 * Generate alerts from inventory items
 * @param items List of inventory items
 * @returns List of inventory alerts
 */
export function generateInventoryAlerts(items) {
    const alerts = [];
    // Check for expiring items
    const expiringItems = getExpiringItems(items, 3); // Items expiring within 3 days
    expiringItems.forEach(item => {
        alerts.push({
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
            itemId: item.id,
            itemName: item.name,
            alertType: InventoryAlertType.EXPIRATION,
            createdAt: new Date(),
            isRead: false,
            message: `${item.name} will expire in ${getDaysUntilExpiration(item)} days`,
            actionRequired: true,
        });
    });
    // Check for low stock items
    const lowStockItems = items.filter(item => isItemLow(item));
    lowStockItems.forEach(item => {
        alerts.push({
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
            itemId: item.id,
            itemName: item.name,
            alertType: InventoryAlertType.LOW_STOCK,
            createdAt: new Date(),
            isRead: false,
            message: `${item.name} is running low (${item.quantity} ${item.unit} left)`,
            actionRequired: true,
        });
    });
    // Check for out of stock items
    const outOfStockItems = items.filter(item => item.status === InventoryItemStatus.OUT_OF_STOCK);
    outOfStockItems.forEach(item => {
        alerts.push({
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
            itemId: item.id,
            itemName: item.name,
            alertType: InventoryAlertType.OUT_OF_STOCK,
            createdAt: new Date(),
            isRead: false,
            message: `${item.name} is out of stock`,
            actionRequired: true,
        });
    });
    return alerts;
}
/**
 * Sort inventory items by various criteria
 * @param items List of inventory items
 * @param sortBy Sort criteria
 * @param ascending True for ascending order, false for descending
 * @returns Sorted inventory items
 */
export function sortInventoryItems(items, sortBy, ascending = true) {
    const direction = ascending ? 1 : -1;
    return [...items].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name) * direction;
            case 'expirationDate':
                if (!a.expirationDate && !b.expirationDate)
                    return 0;
                if (!a.expirationDate)
                    return direction; // Items without expiration date come last in ascending order
                if (!b.expirationDate)
                    return -direction; // Items without expiration date come first in descending order
                const dateA = typeof a.expirationDate === 'string' ? parseISO(a.expirationDate) : a.expirationDate;
                const dateB = typeof b.expirationDate === 'string' ? parseISO(b.expirationDate) : b.expirationDate;
                return (dateA.getTime() - dateB.getTime()) * direction;
            case 'quantity':
                return (a.quantity - b.quantity) * direction;
            case 'category':
                return a.category.localeCompare(b.category) * direction;
            case 'location':
                return a.location.localeCompare(b.location) * direction;
            default:
                return 0;
        }
    });
}
