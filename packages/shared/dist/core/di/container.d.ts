/**
 * Dependency Injection Container
 *
 * A lightweight DI container that manages singletons and factory registrations.
 * This enables us to decouple components and makes testing much easier.
 */
type Factory<T> = (...args: any[]) => T;
/**
 * Service tokens for the container
 */
export declare const ServiceTokens: {
    IngredientRepository: string;
    InventoryRepository: string;
    RecipeRepository: string;
    StorageService: string;
    IngredientDetectionService: string;
    InventoryService: string;
    RecipeService: string;
};
/**
 * Container for dependency injection
 */
export declare class Container {
    private registrations;
    /**
     * Register a service with the container
     * @param token Unique identifier for the service
     * @param factory Function that creates the service
     * @param singleton Whether the service should be a singleton
     */
    register<T>(token: string, factory: Factory<T>, singleton?: boolean): void;
    /**
     * Get a service from the container
     * @param token Unique identifier for the service
     * @param args Optional arguments to pass to the factory
     * @returns The requested service
     * @throws Error if the service is not registered
     */
    resolve<T>(token: string, ...args: any[]): T;
    /**
     * Check if a service is registered
     * @param token Unique identifier for the service
     */
    has(token: string): boolean;
    /**
     * Clear all registrations
     */
    clear(): void;
}
declare const container: Container;
export default container;
