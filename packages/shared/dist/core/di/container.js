/**
 * Dependency Injection Container
 *
 * A lightweight DI container that manages singletons and factory registrations.
 * This enables us to decouple components and makes testing much easier.
 */
import { IngredientRepository, InventoryRepository, RecipeRepository } from '../../infrastructure/repositories';
import { IngredientDetectionService, InventoryService, RecipeService } from '../../infrastructure/services';
import { StorageService } from '../../infrastructure/storage';
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
    constructor() {
        this.registrations = new Map();
    }
    /**
     * Register a service with the container
     * @param token Unique identifier for the service
     * @param factory Function that creates the service
     * @param singleton Whether the service should be a singleton
     */
    register(token, factory, singleton = true) {
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
    resolve(token, ...args) {
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
    has(token) {
        return this.registrations.has(token);
    }
    /**
     * Clear all registrations
     */
    clear() {
        this.registrations.clear();
    }
}
// Global container instance
const container = new Container();
// Register storage services
container.register(ServiceTokens.StorageService, () => new StorageService({ keyPrefix: 'nutrition_app' }));
// Register repositories
container.register(ServiceTokens.IngredientRepository, () => new IngredientRepository(container.resolve(ServiceTokens.StorageService)));
container.register(ServiceTokens.InventoryRepository, () => new InventoryRepository(container.resolve(ServiceTokens.StorageService)));
container.register(ServiceTokens.RecipeRepository, () => new RecipeRepository(container.resolve(ServiceTokens.StorageService)));
// Register services
container.register(ServiceTokens.IngredientDetectionService, () => new IngredientDetectionService());
container.register(ServiceTokens.InventoryService, () => new InventoryService(container.resolve(ServiceTokens.InventoryRepository), container.resolve(ServiceTokens.RecipeRepository)));
container.register(ServiceTokens.RecipeService, () => new RecipeService(container.resolve(ServiceTokens.RecipeRepository)));
export default container;
