/**
 * Dependency Injection Container
 * 
 * A lightweight DI container that manages singletons and factory registrations.
 * This enables us to decouple components and makes testing much easier.
 */

import { IIngredientRepository } from '../domain/repositories/IIngredientRepository';
import { IInventoryRepository } from '../domain/repositories/IInventoryRepository';
import { IRecipeRepository } from '../domain/repositories/IRecipeRepository';
import { IIngredientDetectionService } from '../domain/services/IIngredientDetectionService';
import { IInventoryService } from '../domain/services/IInventoryService';
import { IRecipeService } from '../domain/services/IRecipeService';
import { IngredientRepository, InventoryRepository, RecipeRepository } from '../../infrastructure/repositories';
import { IngredientDetectionService, InventoryService, RecipeService } from '../../infrastructure/services';
import { StorageService } from '../../infrastructure/storage';

type Factory<T> = (...args: any[]) => T;
type Registration<T> = {
  factory: Factory<T>;
  instance?: T;
  singleton: boolean;
};

/**
 * Service tokens for the container
 */
export const ServiceTokens = {
  // Repositories
  IngredientRepository: 'IngredientRepository',
  InventoryRepository: 'InventoryRepository',
  RecipeRepository: 'RecipeRepository',
  
  // Services
  StorageService: 'StorageService',
  IngredientDetectionService: 'IngredientDetectionService',
  InventoryService: 'InventoryService',
  RecipeService: 'RecipeService',
};

/**
 * Container for dependency injection
 */
export class Container {
  private registrations = new Map<string, Registration<any>>();

  /**
   * Register a service with the container
   * @param token Unique identifier for the service
   * @param factory Function that creates the service
   * @param singleton Whether the service should be a singleton
   */
  register<T>(token: string, factory: Factory<T>, singleton = true): void {
    this.registrations.set(token, {
      factory,
      singleton,
    });
  }

  /**
   * Get a service from the container
   * @param token Unique identifier for the service
   * @param args Optional arguments to pass to the factory
   * @returns The requested service
   * @throws Error if the service is not registered
   */
  resolve<T>(token: string, ...args: any[]): T {
    const registration = this.registrations.get(token);
    
    if (!registration) {
      throw new Error(`Service '${token}' not registered in container`);
    }

    if (registration.singleton) {
      if (!registration.instance) {
        registration.instance = registration.factory(...args);
      }
      return registration.instance;
    }

    return registration.factory(...args);
  }

  /**
   * Check if a service is registered
   * @param token Unique identifier for the service
   */
  has(token: string): boolean {
    return this.registrations.has(token);
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.registrations.clear();
  }
}

// Global container instance
const container = new Container();

// Register storage services
container.register<StorageService>(
  ServiceTokens.StorageService,
  () => new StorageService({ keyPrefix: 'nutrition_app' })
);

// Register repositories
container.register<IIngredientRepository>(
  ServiceTokens.IngredientRepository,
  () => new IngredientRepository(
    container.resolve<StorageService>(ServiceTokens.StorageService)
  )
);

container.register<IInventoryRepository>(
  ServiceTokens.InventoryRepository,
  () => new InventoryRepository(
    container.resolve<StorageService>(ServiceTokens.StorageService)
  )
);

container.register<IRecipeRepository>(
  ServiceTokens.RecipeRepository,
  () => new RecipeRepository(
    container.resolve<StorageService>(ServiceTokens.StorageService)
  )
);

// Register services
container.register<IIngredientDetectionService>(
  ServiceTokens.IngredientDetectionService,
  () => new IngredientDetectionService()
);

container.register<IInventoryService>(
  ServiceTokens.InventoryService,
  () => new InventoryService(
    container.resolve<IInventoryRepository>(ServiceTokens.InventoryRepository),
    container.resolve<IRecipeRepository>(ServiceTokens.RecipeRepository)
  )
);

container.register<IRecipeService>(
  ServiceTokens.RecipeService,
  () => new RecipeService(
    container.resolve<IRecipeRepository>(ServiceTokens.RecipeRepository)
  )
);

export default container;
