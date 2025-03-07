/**
 * Recipe Repository Interface
 *
 * Defines the contract for repositories that handle recipe data.
 * Following the Repository Pattern to separate domain logic from data access.
 */
import { Recipe } from '../../models/recipe';
/**
 * Interface for the Recipe Repository
 */
export interface IRecipeRepository {
    /**
     * Get all recipes
     * @returns List of all recipes
     */
    getAll(): Promise<Recipe[]>;
    /**
     * Get a recipe by ID
     * @param id Recipe ID
     * @returns The recipe or null if not found
     */
    getById(id: string): Promise<Recipe | null>;
    /**
     * Find recipes that contain the specified ingredients
     * @param ingredientIds IDs of ingredients to match
     * @param matchThreshold Percentage (0-1) of ingredients that must match
     * @returns List of recipes that match the criteria
     */
    getByIngredients(ingredientIds: string[], matchThreshold?: number): Promise<Recipe[]>;
    /**
     * Add a new recipe
     * @param recipe Recipe data without ID and timestamps
     * @returns The added recipe with ID and timestamps
     */
    add(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe>;
    /**
     * Update an existing recipe
     * @param id ID of the recipe to update
     * @param recipe Updated recipe data
     * @returns True if successfully updated, false otherwise
     */
    update(id: string, recipe: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>): Promise<boolean>;
    /**
     * Delete a recipe
     * @param id ID of the recipe to delete
     * @returns True if successfully deleted, false otherwise
     */
    delete(id: string): Promise<boolean>;
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
}
