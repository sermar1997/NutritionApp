/**
 * Inventory module exports
 * 
 * Note: This module has been refactored to follow Clean Architecture principles.
 * The core functionality is now available in core/models/inventory and 
 * infrastructure/services/InventoryService.
 */

// Re-export models
export * from '../core/models/inventory';

// Import services for easy access
import container, { ServiceTokens } from '../core/di/container';
import { IInventoryService } from '../core/domain/services/IInventoryService';

/**
 * Get the inventory service instance
 * @returns The inventory service
 */
export const getInventoryService = (): IInventoryService => {
  return container.resolve<IInventoryService>(ServiceTokens.InventoryService);
};
