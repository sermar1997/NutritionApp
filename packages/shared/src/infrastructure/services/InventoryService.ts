/**
 * Inventory Service Implementation
 * 
 * Implements the inventory service interface using the inventory repository.
 */

import { v4 as uuidv4 } from 'uuid';
import { IInventoryService } from '../../core/domain/services/IInventoryService';
import { IInventoryRepository } from '../../core/domain/repositories/IInventoryRepository';
import { IRecipeRepository } from '../../core/domain/repositories/IRecipeRepository';
import { 
  InventoryItem, 
  InventoryItemCreateDto, 
  InventoryItemUpdateDto,
  InventoryStats,
  ShoppingListItem,
  InventoryAlert,
  InventoryAlertType,
  InventoryItemStatus,
  StorageLocation
} from '../../core/models/inventory';
import { isAfter, isBefore, addDays } from 'date-fns';

/**
 * Implementation of Inventory Service
 */
export class InventoryService implements IInventoryService {
  /**
   * Create a new inventory service
   * @param inventoryRepository Repository for inventory data
   * @param recipeRepository Repository for recipe data
   */
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly recipeRepository: IRecipeRepository
  ) {}
  
  /**
   * Get all inventory items
   * @returns All inventory items
   */
  async getAllItems(): Promise<InventoryItem[]> {
    return this.inventoryRepository.getAll();
  }
  
  /**
   * Get an inventory item by ID
   * @param id Inventory item ID
   * @returns The inventory item or null if not found
   */
  async getItemById(id: string): Promise<InventoryItem | null> {
    return this.inventoryRepository.getById(id);
  }
  
  /**
   * Add a new inventory item
   * @param item Inventory item data
   * @returns The added inventory item
   */
  async addItem(item: InventoryItemCreateDto): Promise<InventoryItem> {
    return this.inventoryRepository.add(item);
  }
  
  /**
   * Update an existing inventory item
   * @param id ID of the inventory item to update
   * @param updates Updated inventory item data
   * @returns True if successfully updated, false otherwise
   */
  async updateItem(id: string, updates: InventoryItemUpdateDto): Promise<boolean> {
    return this.inventoryRepository.update(id, updates);
  }
  
  /**
   * Delete an inventory item
   * @param id ID of the inventory item to delete
   * @returns True if successfully deleted, false otherwise
   */
  async deleteItem(id: string): Promise<boolean> {
    return this.inventoryRepository.delete(id);
  }
  
  /**
   * Calculate inventory statistics
   * @returns Inventory statistics
   */
  async calculateInventoryStats(): Promise<InventoryStats> {
    try {
      const items = await this.inventoryRepository.getAll();
      
      if (!items.length) {
        return {
          totalItems: 0,
          expiringWithin7Days: 0,
          expiredItems: 0,
          lowStockItems: 0,
          totalValue: 0,
          mostStockedCategory: '',
          recentlyUsedItems: 0
        };
      }
      
      // Count expiring items
      const now = new Date();
      const in7Days = addDays(now, 7);
      
      // Count by category
      const categories: Record<string, number> = {};
      
      // Calculate statistics
      let expiringCount = 0;
      let expiredCount = 0;
      let lowStockCount = 0;
      let totalValue = 0;
      
      for (const item of items) {
        // Category counts
        const category = item.category || 'Uncategorized';
        categories[category] = (categories[category] || 0) + 1;
        
        // Expiration counts
        if (item.expirationDate) {
          const expiry = new Date(item.expirationDate);
          if (isBefore(expiry, now)) {
            expiredCount++;
          } else if (isBefore(expiry, in7Days)) {
            expiringCount++;
          }
        }
        
        // Low stock count
        if (item.status === InventoryItemStatus.LOW) {
          lowStockCount++;
        }
        
        // Total value
        if (item.purchasePrice) {
          totalValue += item.purchasePrice * item.quantity;
        }
      }
      
      // Find most stocked category
      let mostStockedCategory = '';
      let highestCount = 0;
      
      for (const [category, count] of Object.entries(categories)) {
        if (count > highestCount) {
          highestCount = count;
          mostStockedCategory = category;
        }
      }
      
      return {
        totalItems: items.length,
        expiringWithin7Days: expiringCount,
        expiredItems: expiredCount,
        lowStockItems: lowStockCount,
        totalValue,
        mostStockedCategory,
        recentlyUsedItems: 0 // Would be calculated from usage logs
      };
    } catch (error) {
      console.error('Error calculating inventory stats:', error);
      return {
        totalItems: 0,
        expiringWithin7Days: 0,
        expiredItems: 0,
        lowStockItems: 0,
        totalValue: 0,
        mostStockedCategory: '',
        recentlyUsedItems: 0
      };
    }
  }
  
  /**
   * Find items by name, partial match
   * @param searchText Text to search for
   * @returns Matching inventory items
   */
  async searchItems(searchText: string): Promise<InventoryItem[]> {
    try {
      if (!searchText.trim()) {
        return [];
      }
      
      const items = await this.inventoryRepository.getAll();
      const searchLower = searchText.toLowerCase().trim();
      
      return items.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        (item.notes && item.notes.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error('Error searching inventory items:', error);
      return [];
    }
  }
  
  /**
   * Generate a shopping list based on low or out of stock items
   * @param includeOutOfStock Include out of stock items
   * @param includeLowStock Include low stock items
   * @returns Generated shopping list
   */
  async generateShoppingList(
    includeOutOfStock: boolean, 
    includeLowStock: boolean
  ): Promise<ShoppingListItem[]> {
    try {
      if (!includeOutOfStock && !includeLowStock) {
        return [];
      }
      
      const items = await this.inventoryRepository.getAll();
      
      // Filter items by status
      const filteredItems = items.filter(item => {
        if (includeOutOfStock && item.status === InventoryItemStatus.OUT_OF_STOCK) {
          return true;
        }
        
        if (includeLowStock && item.status === InventoryItemStatus.LOW) {
          return true;
        }
        
        return false;
      });
      
      // Convert to shopping list items
      const now = new Date();
      const shoppingList: ShoppingListItem[] = filteredItems.map(item => ({
        id: uuidv4(),
        name: item.name,
        quantity: item.status === InventoryItemStatus.OUT_OF_STOCK ? 1 : (item.lowStockThreshold || 1),
        unit: item.unit,
        isPurchased: false,
        category: item.category,
        priority: item.status === InventoryItemStatus.OUT_OF_STOCK ? 1 : 2,
        notes: `Auto-generated from ${item.status.toLowerCase()} inventory item`,
        relatedInventoryItemId: item.id,
        createdAt: now,
        updatedAt: now
      }));
      
      return shoppingList;
    } catch (error) {
      console.error('Error generating shopping list:', error);
      return [];
    }
  }
  
  /**
   * Get inventory items expiring within a certain number of days
   * @param days Number of days to check
   * @returns Items expiring within the specified days
   */
  async getExpiringItems(days: number): Promise<InventoryItem[]> {
    return this.inventoryRepository.getExpiringItems(days);
  }
  
  /**
   * Update the status of all inventory items based on their current state
   * @returns Number of items updated
   */
  async refreshItemStatuses(): Promise<number> {
    try {
      const items = await this.inventoryRepository.getAll();
      let updatedCount = 0;
      
      for (const item of items) {
        const oldStatus = item.status;
        let newStatus = oldStatus;
        
        // Check for expiration
        if (item.expirationDate) {
          const expiry = new Date(item.expirationDate);
          if (isBefore(expiry, new Date())) {
            newStatus = InventoryItemStatus.EXPIRED;
          }
        }
        
        // Check for low stock
        if (newStatus !== InventoryItemStatus.EXPIRED) {
          if (item.quantity <= 0) {
            newStatus = InventoryItemStatus.OUT_OF_STOCK;
          } else if (
            item.lowStockThreshold && 
            item.quantity <= item.lowStockThreshold
          ) {
            newStatus = InventoryItemStatus.LOW;
          } else {
            newStatus = InventoryItemStatus.AVAILABLE;
          }
        }
        
        // Update if status changed
        if (newStatus !== oldStatus) {
          await this.inventoryRepository.update(item.id, { status: newStatus });
          updatedCount++;
        }
      }
      
      return updatedCount;
    } catch (error) {
      console.error('Error refreshing item statuses:', error);
      return 0;
    }
  }
  
  /**
   * Use inventory items for a recipe
   * @param recipeId Recipe ID
   * @param servings Number of servings
   * @returns Updated inventory items
   */
  async useItemsForRecipe(recipeId: string, servings: number): Promise<InventoryItem[]> {
    try {
      const recipe = await this.recipeRepository.getById(recipeId);
      
      if (!recipe) {
        throw new Error(`Recipe not found: ${recipeId}`);
      }
      
      // Calculate scaling factor
      const scaleFactor = servings / recipe.servings;
      
      // Get all inventory items
      const inventoryItems = await this.inventoryRepository.getAll();
      const updatedItems: InventoryItem[] = [];
      
      // Update quantities for each recipe ingredient
      for (const recipeIngredient of recipe.ingredients) {
        // Skip optional ingredients
        if (recipeIngredient.optional) continue;
        
        // Find corresponding inventory item
        const inventoryItem = inventoryItems.find(item => 
          item.id === recipeIngredient.ingredientId
        );
        
        if (!inventoryItem) continue;
        
        // Calculate quantity to use
        const quantityToUse = recipeIngredient.quantity * scaleFactor;
        
        // Update inventory
        if (inventoryItem.quantity >= quantityToUse) {
          const newQuantity = inventoryItem.quantity - quantityToUse;
          
          await this.inventoryRepository.updateQuantity(inventoryItem.id, newQuantity);
          
          // Add to updated items
          const updatedItem = {
            ...inventoryItem,
            quantity: newQuantity
          };
          
          updatedItems.push(updatedItem);
        }
      }
      
      // Refresh statuses to update any items that are now low or out of stock
      await this.refreshItemStatuses();
      
      return updatedItems;
    } catch (error) {
      console.error('Error using items for recipe:', error);
      return [];
    }
  }
  
  /**
   * Generate inventory alerts
   * @returns Current inventory alerts
   */
  async generateAlerts(): Promise<InventoryAlert[]> {
    try {
      const items = await this.inventoryRepository.getAll();
      const now = new Date();
      const in3Days = addDays(now, 3);
      const in7Days = addDays(now, 7);
      
      const alerts: InventoryAlert[] = [];
      
      for (const item of items) {
        // Expired items
        if (item.expirationDate && isBefore(new Date(item.expirationDate), now)) {
          alerts.push({
            id: uuidv4(),
            itemId: item.id,
            itemName: item.name,
            alertType: InventoryAlertType.EXPIRED,
            createdAt: now,
            isRead: false,
            message: `${item.name} has expired!`,
            actionRequired: true,
            updatedAt: now
          });
        }
        // Expiring soon (3 days)
        else if (
          item.expirationDate && 
          isAfter(new Date(item.expirationDate), now) && 
          isBefore(new Date(item.expirationDate), in3Days)
        ) {
          alerts.push({
            id: uuidv4(),
            itemId: item.id,
            itemName: item.name,
            alertType: InventoryAlertType.EXPIRING_SOON,
            createdAt: now,
            isRead: false,
            message: `${item.name} expires in less than 3 days!`,
            actionRequired: true,
            updatedAt: now
          });
        }
        // Expiring within a week
        else if (
          item.expirationDate && 
          isAfter(new Date(item.expirationDate), in3Days) && 
          isBefore(new Date(item.expirationDate), in7Days)
        ) {
          alerts.push({
            id: uuidv4(),
            itemId: item.id,
            itemName: item.name,
            alertType: InventoryAlertType.EXPIRING_SOON,
            createdAt: now,
            isRead: false,
            message: `${item.name} expires in less than a week`,
            actionRequired: false,
            updatedAt: now
          });
        }
        
        // Low stock
        if (item.status === InventoryItemStatus.LOW) {
          alerts.push({
            id: uuidv4(),
            itemId: item.id,
            itemName: item.name,
            alertType: InventoryAlertType.LOW_STOCK,
            createdAt: now,
            isRead: false,
            message: `${item.name} is running low`,
            actionRequired: false,
            updatedAt: now
          });
        }
        
        // Out of stock
        if (item.status === InventoryItemStatus.OUT_OF_STOCK) {
          alerts.push({
            id: uuidv4(),
            itemId: item.id,
            itemName: item.name,
            alertType: InventoryAlertType.OUT_OF_STOCK,
            createdAt: now,
            isRead: false,
            message: `${item.name} is out of stock`,
            actionRequired: item.isStaple, // Only require action for staple items
            updatedAt: now
          });
        }
      }
      
      return alerts;
    } catch (error) {
      console.error('Error generating inventory alerts:', error);
      return [];
    }
  }
  
  /**
   * Get inventory items by location
   * @param location Storage location
   * @returns Items in the specified location
   */
  async getItemsByLocation(location: StorageLocation): Promise<InventoryItem[]> {
    return this.inventoryRepository.getByLocation(location);
  }
  
  /**
   * Sort inventory items
   * @param sortBy Property to sort by
   * @param ascending Sort direction
   * @returns Sorted inventory items
   */
  async sortItems(
    sortBy: 'name' | 'expirationDate' | 'quantity' | 'category' | 'location', 
    ascending: boolean
  ): Promise<InventoryItem[]> {
    try {
      const items = await this.inventoryRepository.getAll();
      
      return items.sort((a, b) => {
        let valueA: any;
        let valueB: any;
        
        switch (sortBy) {
          case 'name':
            valueA = a.name;
            valueB = b.name;
            break;
          case 'expirationDate':
            valueA = a.expirationDate ? new Date(a.expirationDate).getTime() : Infinity;
            valueB = b.expirationDate ? new Date(b.expirationDate).getTime() : Infinity;
            break;
          case 'quantity':
            valueA = a.quantity;
            valueB = b.quantity;
            break;
          case 'category':
            valueA = a.category;
            valueB = b.category;
            break;
          case 'location':
            valueA = a.locationId;
            valueB = b.locationId;
            break;
          default:
            valueA = a.name;
            valueB = b.name;
        }
        
        // Handle string comparison
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return ascending 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        
        // Handle numeric comparison
        return ascending 
          ? valueA - valueB
          : valueB - valueA;
      });
    } catch (error) {
      console.error('Error sorting inventory items:', error);
      return [];
    }
  }
}
