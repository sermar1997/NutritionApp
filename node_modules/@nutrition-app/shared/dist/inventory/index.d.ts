/**
 * Inventory module exports
 *
 * Note: This module has been refactored to follow Clean Architecture principles.
 * The core functionality is now available in core/models/inventory and
 * infrastructure/services/InventoryService.
 */
export * from '../core/models/inventory';
import { IInventoryService } from '../core/domain/services/IInventoryService';
/**
 * Get the inventory service instance
 * @returns The inventory service
 */
export declare const getInventoryService: () => IInventoryService;
