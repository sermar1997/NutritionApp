/**
 * Ingredient Repository Implementation
 *
 * Implements the ingredient repository interface using the base repository.
 */
import { BaseRepository } from './BaseRepository';
import { IIngredientRepository } from '../../core/domain/repositories/IIngredientRepository';
import { Ingredient, IngredientCategory, IngredientCreateDto, IngredientUpdateDto } from '../../core/models/ingredient';
import { StorageService } from '../storage/StorageService';
/**
 * Storage-based implementation of the Ingredient Repository
 */
export declare class IngredientRepository extends BaseRepository<Ingredient> implements IIngredientRepository {
    /**
     * Create a new ingredient repository
     * @param storageService Optional storage service (for DI)
     */
    constructor(storageService?: StorageService);
    /**
     * Override serialize to handle dates and enums
     * @param ingredient Ingredient to serialize
     * @returns Serialized ingredient
     */
    protected serialize(ingredient: Ingredient): any;
    /**
     * Override deserialize to handle dates and enums
     * @param data Serialized ingredient data
     * @returns Deserialized ingredient
     */
    protected deserialize(data: any): Ingredient;
    /**
     * Get ingredients by category
     * @param category Category enum value
     * @returns List of ingredients in the category
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
     * @param ingredientData Ingredient data without ID and timestamps
     * @returns The added ingredient with ID and timestamps
     */
    add(ingredientData: IngredientCreateDto): Promise<Ingredient>;
    /**
     * Add multiple ingredients
     * @param ingredientsData List of ingredient data without IDs and timestamps
     * @returns The added ingredients with IDs and timestamps
     */
    addMany(ingredientsData: IngredientCreateDto[]): Promise<Ingredient[]>;
    /**
     * Update an existing ingredient
     * @param id ID of the ingredient to update
     * @param updates Updated ingredient data
     * @returns True if successfully updated, false otherwise
     */
    update(id: string, updates: IngredientUpdateDto): Promise<boolean>;
    /**
     * Update the quantity of an ingredient
     * @param id ID of the ingredient to update
     * @param quantity New quantity
     * @returns True if successfully updated, false otherwise
     */
    updateQuantity(id: string, quantity: number): Promise<boolean>;
    /**
     * Get all unique categories from ingredients
     * @returns List of unique category strings
     */
    getCategories(): Promise<string[]>;
}
/**
 * Factory function to create a new ingredient repository
 * @returns A new instance of IIngredientRepository
 */
export declare function createIngredientRepository(): IIngredientRepository;
