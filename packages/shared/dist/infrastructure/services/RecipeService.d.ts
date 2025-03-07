/**
 * Recipe Service Implementation
 *
 * This service encapsulates business logic for recipes,
 * following the Service Layer Pattern to separate business logic from data access.
 */
import { IRecipeService } from '../../core/domain/services/IRecipeService';
import { IRecipeRepository } from '../../core/domain/repositories/IRecipeRepository';
import { Recipe } from '../../core/models/recipe';
import { Ingredient } from '../../core/models/ingredient';
import { NutritionInfo } from '../../core/models/nutrition';
/**
 * Implementation of Recipe Service
 */
export declare class RecipeService implements IRecipeService {
    private readonly recipeRepository;
    /**
     * Create a new Recipe Service
     * @param recipeRepository Repository for recipe data access
     */
    constructor(recipeRepository: IRecipeRepository);
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
     * @param targetMeasurementSystem 'metric' or 'imperial'
     * @returns Converted recipe
     */
    convertMeasurements(recipe: Recipe, targetMeasurementSystem: 'metric' | 'imperial'): Promise<Recipe>;
    /**
     * Scale a recipe for a different number of servings
     * @param recipe Recipe to scale
     * @param targetServings Number of servings to scale to
     * @returns Scaled recipe
     */
    scaleRecipe(recipe: Recipe, targetServings: number): Promise<Recipe>;
}
