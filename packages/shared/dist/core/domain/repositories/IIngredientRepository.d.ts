/**
 * Ingredient Repository Interface
 *
 * Defines the contract for repositories that handle ingredient data.
 * Following the Repository Pattern to separate domain logic from data access.
 */
import { Ingredient, IngredientCategory } from '../../models/ingredient';
/**
 * Interface for the Ingredient Repository
 */
export interface IIngredientRepository {
    /**
     * Get all ingredients
     * @returns List of all ingredients
     */
    getAll(): Promise<Ingredient[]>;
    /**
     * Get an ingredient by ID
     * @param id Ingredient ID
     * @returns The ingredient or null if not found
     */
    getById(id: string): Promise<Ingredient | null>;
    /**
     * Get ingredients by category
     * @param category Category enum value
     * @returns List of ingredients in the specified category
     */
    getByCategoryId(category: IngredientCategory): Promise<Ingredient[]>;
    /**
     * Get ingredients expiring within a certain number of days
     * @param days Number of days to check for expiration
     * @returns List of ingredients expiring within the specified days
     */
    getExpiringIngredients(days: number): Promise<Ingredient[]>;
    /**
     * Add a new ingredient
     * @param ingredient Ingredient data without ID and timestamps
     * @returns The added ingredient with ID and timestamps
     */
    add(ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ingredient>;
    /**
     * Add multiple ingredients
     * @param ingredients List of ingredient data without IDs and timestamps
     * @returns The added ingredients with IDs and timestamps
     */
    addMany(ingredients: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Ingredient[]>;
    /**
     * Update an existing ingredient
     * @param id ID of the ingredient to update
     * @param ingredient Updated ingredient data
     * @returns True if successfully updated, false otherwise
     */
    update(id: string, ingredient: Partial<Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>>): Promise<boolean>;
    /**
     * Update the quantity of an ingredient
     * @param id ID of the ingredient to update
     * @param quantity New quantity
     * @returns True if successfully updated, false otherwise
     */
    updateQuantity(id: string, quantity: number): Promise<boolean>;
    /**
     * Delete an ingredient
     * @param id ID of the ingredient to delete
     * @returns True if successfully deleted, false otherwise
     */
    delete(id: string): Promise<boolean>;
    /**
     * Get all unique categories from ingredients
     * @returns List of unique category strings
     */
    getCategories(): Promise<string[]>;
}
