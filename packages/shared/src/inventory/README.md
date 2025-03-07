# Inventory Module

This module has been refactored according to Clean Architecture principles.

## Structure

The inventory functionality is organized as follows:

- **Models**: Located in `core/models/inventory.ts`
- **Repository Interface**: Located in `core/domain/repositories/IInventoryRepository.ts`
- **Service Interface**: Located in `core/domain/services/IInventoryService.ts`
- **Repository Implementation**: Located in `infrastructure/repositories/InventoryRepository.ts`
- **Service Implementation**: Located in `infrastructure/services/InventoryService.ts`

## Usage

To use the inventory functionality:

```typescript
// Import models directly
import { InventoryItem, StorageLocation } from '../core/models';

// Using repository (for lower-level operations)
import { IInventoryRepository } from '../core/domain/repositories';
import container, { ServiceTokens } from '../core/di/container';

const inventoryRepo = container.resolve<IInventoryRepository>(ServiceTokens.InventoryRepository);

// Using service (recommended for application code)
import { IInventoryService } from '../core/domain/services';

const inventoryService = container.resolve<IInventoryService>(ServiceTokens.InventoryService);
```

You can also use the convenience function from this module:

```typescript
import { getInventoryService } from '../inventory';

const inventoryService = getInventoryService();
``` 
