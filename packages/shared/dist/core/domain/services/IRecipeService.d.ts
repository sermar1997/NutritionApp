/**
 * Recipe Service Interface
 *
 * Defines the contract for services that handle recipe generation and management.
 */
import { Ingredient } from '../../models/ingredient';
import { Recipe } from '../../models/recipe';
import { NutritionInfo } from '../../models/nutrition';
/**
 * Interface for the Recipe Service
 */
export interface IRecipeService {
    /**
     * Generate recipe suggestions based on available ingredients
     * @param ingredients List of available ingredients
     * @param preferences Optional preferences for recipe generation
     * @returns List of suggested recipes
     */
    generateRecipeSuggestions(ingredients: Ingredient[], preferences?: {
        cuisine?: string;
        dietary?: string[];
        difficulty?: 'easy' | 'medium' | 'hard';
        maxPrepTime?: number;
    }): Promise<Recipe[]>;
    /**
     * Calculate nutrition information for a recipe
     * @param recipe Recipe to analyze
     * @returns Nutrition information for the recipe
     */
    calculateNutrition(recipe: Recipe): Promise<NutritionInfo>;
    /**
     * Check if all ingredients for a recipe are available in inventory
     * @param recipe Recipe to check
     * @param availableIngredients Available ingredients in inventory
     * @returns List of missing ingredients with quantities
     */
    getMissingIngredients(recipe: Recipe, availableIngredients: Ingredient[]): Promise<Array<{
        name: string;
        quantity: number;
        unit: string;
    }>>;
    /**
     * Convert recipe between measurement systems (metric/imperial)
     * @param recipe Recipe to convert
     * @param targetSystem 'metric' or 'imperial'
     * @returns Converted recipe
     */
    convertMeasurements(recipe: Recipe, targetSystem: 'metric' | 'imperial'): Promise<Recipe>;
    /**
     * Scale a recipe for a different number of servings
     * @param recipe Recipe to scale
     * @param targetServings Number of servings to scale to
     * @returns Scaled recipe
     */
    scaleRecipe(recipe: Recipe, targetServings: number): Promise<Recipe>;
}
