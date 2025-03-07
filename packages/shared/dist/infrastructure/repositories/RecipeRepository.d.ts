/**
 * Recipe Repository Implementation
 *
 * Implements the recipe repository interface using the base repository.
 */
import { BaseRepository } from './BaseRepository';
import { IRecipeRepository } from '../../core/domain/repositories/IRecipeRepository';
import { Recipe, RecipeCreateDto, RecipeUpdateDto } from '../../core/models/recipe';
import { StorageService } from '../storage/StorageService';
/**
 * Storage-based implementation of the Recipe Repository
 */
export declare class RecipeRepository extends BaseRepository<Recipe> implements IRecipeRepository {
    private readonly favoritesStorageKey;
    /**
     * Create a new recipe repository
     * @param storageService Optional storage service (for DI)
     */
    constructor(storageService?: StorageService);
    /**
     * Find recipes that contain the specified ingredients
     * @param ingredientIds IDs of ingredients to match
     * @param matchThreshold Percentage (0-1) of ingredients that must match
     * @returns List of recipes that match the criteria
     */
    getByIngredients(ingredientIds: string[], matchThreshold?: number): Promise<Recipe[]>;
    /**
     * Add a new recipe
     * @param recipeData Recipe data without ID and timestamps
     * @returns The added recipe with ID and timestamps
     */
    add(recipeData: RecipeCreateDto): Promise<Recipe>;
    /**
     * Update an existing recipe
     * @param id ID of the recipe to update
     * @param updates Updated recipe data
     * @returns True if successfully updated, false otherwise
     */
    update(id: string, updates: RecipeUpdateDto): Promise<boolean>;
    /**
     * Add a recipe to favorites
     * @param id Recipe ID
     * @returns True if successfully added to favorites, false otherwise
     */
    addToFavorites(id: string): Promise<boolean>;
    /**
     * Remove a recipe from favorites
     * @param id Recipe ID
     * @returns True if successfully removed from favorites, false otherwise
     */
    removeFromFavorites(id: string): Promise<boolean>;
    /**
     * Get favorite recipes
     * @returns List of favorite recipes
     */
    getFavorites(): Promise<Recipe[]>;
    /**
     * Get IDs of favorite recipes
     * @returns Array of favorite recipe IDs
     */
    private getFavoriteIds;
}
