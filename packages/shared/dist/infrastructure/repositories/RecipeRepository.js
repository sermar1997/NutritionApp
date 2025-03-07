/**
 * Recipe Repository Implementation
 *
 * Implements the recipe repository interface using the base repository.
 */
import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './BaseRepository';
/**
 * Storage-based implementation of the Recipe Repository
 */
export class RecipeRepository extends BaseRepository {
    /**
     * Create a new recipe repository
     * @param storageService Optional storage service (for DI)
     */
    constructor(storageService) {
        super('recipes', storageService);
        this.favoritesStorageKey = 'favorites_recipes';
    }
    /**
     * Find recipes that contain the specified ingredients
     * @param ingredientIds IDs of ingredients to match
     * @param matchThreshold Percentage (0-1) of ingredients that must match
     * @returns List of recipes that match the criteria
     */
    async getByIngredients(ingredientIds, matchThreshold = 0.5) {
        try {
            if (!ingredientIds.length) {
                return [];
            }
            const recipes = await this.getAll();
            return recipes.filter(recipe => {
                const recipeIngredientIds = recipe.ingredients.map(ingredient => ingredient.ingredientId);
                // Count how many ingredients match
                const matchingIngredients = recipeIngredientIds.filter(id => ingredientIds.includes(id));
                // Calculate the match ratio
                const matchRatio = matchingIngredients.length / recipeIngredientIds.length;
                // Return true if the ratio meets or exceeds the threshold
                return matchRatio >= matchThreshold;
            });
        }
        catch (error) {
            console.error('Error getting recipes by ingredients:', error);
            return [];
        }
    }
    /**
     * Add a new recipe
     * @param recipeData Recipe data without ID and timestamps
     * @returns The added recipe with ID and timestamps
     */
    async add(recipeData) {
        try {
            const now = new Date();
            const newRecipe = {
                ...recipeData,
                id: uuidv4(),
                createdAt: now,
                updatedAt: now,
            };
            const recipes = await this.getAll();
            recipes.push(newRecipe);
            await this.saveAll(recipes);
            return newRecipe;
        }
        catch (error) {
            console.error('Error adding recipe:', error);
            throw error;
        }
    }
    /**
     * Update an existing recipe
     * @param id ID of the recipe to update
     * @param updates Updated recipe data
     * @returns True if successfully updated, false otherwise
     */
    async update(id, updates) {
        try {
            const recipes = await this.getAll();
            const index = recipes.findIndex(recipe => recipe.id === id);
            if (index === -1) {
                return false;
            }
            recipes[index] = {
                ...recipes[index],
                ...updates,
                updatedAt: new Date(),
            };
            await this.saveAll(recipes);
            return true;
        }
        catch (error) {
            console.error('Error updating recipe:', error);
            return false;
        }
    }
    /**
     * Add a recipe to favorites
     * @param id Recipe ID
     * @returns True if successfully added to favorites, false otherwise
     */
    async addToFavorites(id) {
        try {
            const recipe = await this.getById(id);
            if (!recipe)
                return false;
            // Get current favorites
            const favorites = await this.getFavoriteIds();
            // Check if already in favorites
            if (favorites.includes(id))
                return true;
            // Add to favorites
            favorites.push(id);
            await this.storageService.set(this.favoritesStorageKey, favorites);
            return true;
        }
        catch (error) {
            console.error('Error adding recipe to favorites:', error);
            return false;
        }
    }
    /**
     * Remove a recipe from favorites
     * @param id Recipe ID
     * @returns True if successfully removed from favorites, false otherwise
     */
    async removeFromFavorites(id) {
        try {
            // Get current favorites
            const favorites = await this.getFavoriteIds();
            // Check if in favorites
            if (!favorites.includes(id))
                return true;
            // Remove from favorites
            const updatedFavorites = favorites.filter(favId => favId !== id);
            await this.storageService.set(this.favoritesStorageKey, updatedFavorites);
            return true;
        }
        catch (error) {
            console.error('Error removing recipe from favorites:', error);
            return false;
        }
    }
    /**
     * Get favorite recipes
     * @returns List of favorite recipes
     */
    async getFavorites() {
        try {
            const favoriteIds = await this.getFavoriteIds();
            if (!favoriteIds.length) {
                return [];
            }
            const recipes = await this.getAll();
            // Filter recipes by favorite IDs and add isFavorite flag
            return recipes
                .filter(recipe => favoriteIds.includes(recipe.id))
                .map(recipe => ({
                ...recipe,
                isFavorite: true,
            }));
        }
        catch (error) {
            console.error('Error getting favorite recipes:', error);
            return [];
        }
    }
    /**
     * Get IDs of favorite recipes
     * @returns Array of favorite recipe IDs
     */
    async getFavoriteIds() {
        try {
            const favorites = await this.storageService.get(this.favoritesStorageKey);
            return favorites || [];
        }
        catch (error) {
            console.error('Error getting favorite recipe IDs:', error);
            return [];
        }
    }
}
