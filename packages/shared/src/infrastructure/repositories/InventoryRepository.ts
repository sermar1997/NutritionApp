/**
 * Inventory Repository Implementation
 * 
 * Implements the inventory repository interface using the base repository.
 */

import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './BaseRepository';
import { IInventoryRepository } from '../../core/domain/repositories/IInventoryRepository';
import { 
  InventoryItem, 
  InventoryItemCreateDto, 
  InventoryItemUpdateDto,
  InventoryItemStatus,
  StorageLocation,
  InventoryChangeLog,
  InventoryChangeType,
  ShoppingListItem
} from '../../core/models/inventory';
import { StorageService } from '../storage/StorageService';

/**
 * Storage-based implementation of the Inventory Repository
 */
export class InventoryRepository 
  extends BaseRepository<InventoryItem> 
  implements IInventoryRepository {
  
  private readonly logStorageKey = 'inventory_logs';
  private readonly shoppingListStorageKey = 'shopping_list';
  
  /**
   * Create a new inventory repository
   * @param storageService Optional storage service (for DI)
   */
  constructor(storageService?: StorageService) {
    super('inventory', storageService);
  }
  
  /**
   * Get inventory items by category
   * @param category Category to filter by
   * @returns Inventory items in the specified category
   */
  async getByCategory(category: string): Promise<InventoryItem[]> {
    try {
      const items = await this.getAll();
      return items.filter(item => item.category === category);
    } catch (error) {
      console.error('Error getting inventory items by category:', error);
      return [];
    }
  }
  
  /**
   * Get inventory items by status
   * @param status Status to filter by
   * @returns Inventory items with the specified status
   */
  async getByStatus(status: InventoryItemStatus): Promise<InventoryItem[]> {
    try {
      const items = await this.getAll();
      return items.filter(item => item.status === status);
    } catch (error) {
      console.error('Error getting inventory items by status:', error);
      return [];
    }
  }
  
  /**
   * Get inventory items by location
   * @param location Location to filter by
   * @returns Inventory items in the specified location
   */
  async getByLocation(location: StorageLocation): Promise<InventoryItem[]> {
    try {
      const items = await this.getAll();
      return items.filter(item => item.locationId === location);
    } catch (error) {
      console.error('Error getting inventory items by location:', error);
      return [];
    }
  }
  
  /**
   * Get expiring inventory items
   * @param daysThreshold Number of days to consider for expiration
   * @returns Inventory items expiring within the specified days
   */
  async getExpiringItems(daysThreshold: number): Promise<InventoryItem[]> {
    try {
      const items = await this.getAll();
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + daysThreshold);
      
      return items.filter(item => {
        if (!item.expirationDate) {
          return false;
        }
        
        const expiry = new Date(item.expirationDate);
        return expiry >= now && expiry <= futureDate;
      });
    } catch (error) {
      console.error('Error getting expiring inventory items:', error);
      return [];
    }
  }
  
  /**
   * Add a new inventory item
   * @param item Inventory item data
   * @returns The added inventory item with ID and timestamps
   */
  async add(item: InventoryItemCreateDto): Promise<InventoryItem> {
    try {
      const now = new Date();
      const newItem: InventoryItem = {
        ...item,
        id: uuidv4(),
        status: InventoryItemStatus.AVAILABLE, // Default status
        createdAt: now,
        updatedAt: now
      };
      
      // Add to inventory
      const items = await this.getAll();
      items.push(newItem);
      await this.saveAll(items);
      
      // Log the change
      await this.logInventoryChange({
        id: uuidv4(),
        timestamp: now,
        itemId: newItem.id,
        itemName: newItem.name,
        changeType: InventoryChangeType.ADDED,
        quantity: newItem.quantity,
        userId: 'system', // Would come from auth context in real implementation
        createdAt: now,
        updatedAt: now
      });
      
      return newItem;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }
  }
  
  /**
   * Add multiple inventory items
   * @param items List of inventory items data
   * @returns The added inventory items with IDs and timestamps
   */
  async addMany(items: InventoryItemCreateDto[]): Promise<InventoryItem[]> {
    try {
      const now = new Date();
      const newItems: InventoryItem[] = items.map(item => ({
        ...item,
        id: uuidv4(),
        status: InventoryItemStatus.AVAILABLE, // Default status
        createdAt: now,
        updatedAt: now
      }));
      
      // Add to inventory
      const existingItems = await this.getAll();
      existingItems.push(...newItems);
      await this.saveAll(existingItems);
      
      // Log the changes
      for (const newItem of newItems) {
        await this.logInventoryChange({
          id: uuidv4(),
          timestamp: now,
          itemId: newItem.id,
          itemName: newItem.name,
          changeType: InventoryChangeType.ADDED,
          quantity: newItem.quantity,
          userId: 'system', // Would come from auth context in real implementation
          createdAt: now,
          updatedAt: now
        });
      }
      
      return newItems;
    } catch (error) {
      console.error('Error adding multiple inventory items:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing inventory item
   * @param id ID of the inventory item to update
   * @param updates Updated inventory item data
   * @returns True if successfully updated, false otherwise
   */
  async update(id: string, updates: InventoryItemUpdateDto): Promise<boolean> {
    try {
      const items = await this.getAll();
      const index = items.findIndex(item => item.id === id);
      
      if (index === -1) {
        return false;
      }
      
      const oldItem = items[index];
      const now = new Date();
      
      items[index] = {
        ...oldItem,
        ...updates,
        updatedAt: now
      };
      
      await this.saveAll(items);
      
      // Log the change
      await this.logInventoryChange({
        id: uuidv4(),
        timestamp: now,
        itemId: id,
        itemName: items[index].name,
        changeType: InventoryChangeType.UPDATED,
        quantity: updates.quantity !== undefined ? updates.quantity : oldItem.quantity,
        userId: 'system', // Would come from auth context in real implementation
        createdAt: now,
        updatedAt: now
      });
      
      return true;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      return false;
    }
  }
  
  /**
   * Update the quantity of an inventory item
   * @param id ID of the inventory item to update
   * @param quantity New quantity
   * @returns True if successfully updated, false otherwise
   */
  async updateQuantity(id: string, quantity: number): Promise<boolean> {
    return this.update(id, { quantity });
  }
  
  /**
   * Log an inventory change
   * @param log Change log entry
   */
  private async logInventoryChange(log: InventoryChangeLog): Promise<void> {
    try {
      const logs = await this.storageService.get<InventoryChangeLog[]>(this.logStorageKey) || [];
      logs.push(log);
      await this.storageService.set(this.logStorageKey, logs);
    } catch (error) {
      console.error('Error logging inventory change:', error);
    }
  }
  
  /**
   * Get inventory change logs
   * @param itemId Optional item ID to filter logs
   * @param limit Maximum number of logs to return
   * @returns List of inventory change logs
   */
  async getChangeLogs(itemId?: string, limit?: number): Promise<InventoryChangeLog[]> {
    try {
      const logs = await this.storageService.get<InventoryChangeLog[]>(this.logStorageKey) || [];
      
      // Filter by item ID if provided
      let filteredLogs = itemId ? logs.filter(log => log.itemId === itemId) : logs;
      
      // Sort by timestamp, newest first
      filteredLogs = filteredLogs.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // Apply limit if provided
      if (limit !== undefined && limit > 0) {
        filteredLogs = filteredLogs.slice(0, limit);
      }
      
      return filteredLogs;
    } catch (error) {
      console.error('Error getting inventory change logs:', error);
      return [];
    }
  }
  
  /**
   * Get the shopping list
   * @returns The current shopping list
   */
  async getShoppingList(): Promise<ShoppingListItem[]> {
    try {
      return await this.storageService.get<ShoppingListItem[]>(this.shoppingListStorageKey) || [];
    } catch (error) {
      console.error('Error getting shopping list:', error);
      return [];
    }
  }
  
  /**
   * Save the shopping list
   * @param items Shopping list items
   */
  private async saveShoppingList(items: ShoppingListItem[]): Promise<void> {
    try {
      await this.storageService.set(this.shoppingListStorageKey, items);
    } catch (error) {
      console.error('Error saving shopping list:', error);
      throw error;
    }
  }
  
  /**
   * Update a shopping list item
   * @param id ID of the shopping list item to update
   * @param updates Updated shopping list item data
   * @returns True if successfully updated, false otherwise
   */
  async updateShoppingListItem(id: string, updates: Partial<ShoppingListItem>): Promise<boolean> {
    try {
      const shoppingList = await this.getShoppingList();
      const index = shoppingList.findIndex(item => item.id === id);
      
      if (index === -1) {
        return false;
      }
      
      const now = new Date();
      shoppingList[index] = {
        ...shoppingList[index],
        ...updates,
        updatedAt: now
      };
      
      await this.saveShoppingList(shoppingList);
      return true;
    } catch (error) {
      console.error('Error updating shopping list item:', error);
      return false;
    }
  }
  
  /**
   * Mark a shopping list item as purchased
   * @param id ID of the shopping list item
   * @param isPurchased Whether the item is purchased
   * @returns True if successfully updated, false otherwise
   */
  async markAsPurchased(id: string, isPurchased: boolean): Promise<boolean> {
    return this.updateShoppingListItem(id, { isPurchased });
  }
  
  /**
   * Add inventory items from purchased shopping list items
   * @param shoppingListIds IDs of purchased shopping list items
   * @returns True if successfully added, false otherwise
   */
  async addInventoryFromPurchased(shoppingListIds: string[]): Promise<boolean> {
    try {
      if (!shoppingListIds.length) {
        return false;
      }
      
      const shoppingList = await this.getShoppingList();
      const purchasedItems = shoppingList.filter(item => 
        shoppingListIds.includes(item.id) && item.isPurchased
      );
      
      if (!purchasedItems.length) {
        return false;
      }
      
      // Convert shopping list items to inventory items
      const inventoryItems: InventoryItemCreateDto[] = purchasedItems.map(item => {
        // If related to existing inventory item, use that as a template
        let locationId = StorageLocation.PANTRY; // Default
        let expirationDate: Date | undefined = undefined;
        let isStaple = false;
        
        // Create the new inventory item
        return {
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          locationId,
          isStaple,
          expirationDate,
          purchasePrice: item.estimatedCost,
          purchaseDate: new Date(),
          notes: item.notes
        };
      });
      
      // Add to inventory
      await this.addMany(inventoryItems);
      
      // Remove purchased items from shopping list
      const updatedShoppingList = shoppingList.filter(item => 
        !shoppingListIds.includes(item.id)
      );
      
      await this.saveShoppingList(updatedShoppingList);
      
      return true;
    } catch (error) {
      console.error('Error adding inventory from purchased items:', error);
      return false;
    }
  }
}
