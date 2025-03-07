/**
 * Recipe Service Implementation
 *
 * This service encapsulates business logic for recipes,
 * following the Service Layer Pattern to separate business logic from data access.
 */
/**
 * Implementation of Recipe Service
 */
export class RecipeService {
    /**
     * Create a new Recipe Service
     * @param recipeRepository Repository for recipe data access
     */
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }
    /**
     * Generate recipe suggestions based on available ingredients
     * @param ingredients List of available ingredients
     * @param preferences Optional preferences for recipe generation
     * @returns List of suggested recipes
     */
    async generateRecipeSuggestions(ingredients, preferences) {
        try {
            if (!ingredients.length) {
                return [];
            }
            // Get IDs of available ingredients
            const ingredientIds = ingredients.map(ingredient => ingredient.id);
            // Find recipes that can be made with these ingredients
            const recipes = await this.recipeRepository.getByIngredients(ingredientIds, 0.7);
            // Filter by preferences if provided
            let filteredRecipes = [...recipes];
            if (preferences) {
                // Filter by dietary preferences
                if (preferences.dietary && preferences.dietary.length) {
                    filteredRecipes = filteredRecipes.filter(recipe => {
                        if (!recipe.suitableFor)
                            return false;
                        return preferences.dietary.some(pref => recipe.suitableFor.includes(pref));
                    });
                }
                // Filter by max prep time
                if (preferences.maxPrepTime) {
                    filteredRecipes = filteredRecipes.filter(recipe => recipe.prepTimeMinutes <= preferences.maxPrepTime);
                }
                // Filter by difficulty
                if (preferences.difficulty) {
                    const difficultyMap = {
                        'easy': 'EASY',
                        'medium': 'MEDIUM',
                        'hard': 'HARD'
                    };
                    const difficultyValue = difficultyMap[preferences.difficulty];
                    if (difficultyValue) {
                        filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty.toString() === difficultyValue);
                    }
                }
            }
            return filteredRecipes;
        }
        catch (error) {
            console.error('Error generating recipe suggestions:', error);
            return [];
        }
    }
    /**
     * Calculate nutrition information for a recipe
     * @param recipe Recipe to analyze
     * @returns Nutrition information for the recipe
     */
    async calculateNutrition(recipe) {
        try {
            // This would normally involve fetching nutrition data for each ingredient
            // and calculating the total based on quantities
            // For now, return the existing nutrition info if available
            if (recipe.nutritionPerServing) {
                return recipe.nutritionPerServing;
            }
            // Fall back to a stub implementation
            return {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            };
        }
        catch (error) {
            console.error('Error calculating nutrition:', error);
            return {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            };
        }
    }
    /**
     * Check if all ingredients for a recipe are available in inventory
     * @param recipe Recipe to check
     * @param availableIngredients Available ingredients in inventory
     * @returns List of missing ingredients with quantities
     */
    async getMissingIngredients(recipe, availableIngredients) {
        try {
            const result = [];
            // Map available ingredients by ID for quick lookup
            const availableMap = new Map();
            for (const ingredient of availableIngredients) {
                availableMap.set(ingredient.id, ingredient);
            }
            // Check each recipe ingredient
            for (const recipeIngredient of recipe.ingredients) {
                // Skip optional ingredients
                if (recipeIngredient.optional)
                    continue;
                // Check if ingredient is available
                const available = availableMap.get(recipeIngredient.ingredientId);
                // If not available, add to missing list
                if (!available) {
                    result.push({
                        name: recipeIngredient.name,
                        quantity: recipeIngredient.quantity,
                        unit: recipeIngredient.unit.toString()
                    });
                    continue;
                }
                // If available but not enough quantity, add to missing list with the difference
                if (available.quantity !== undefined &&
                    available.quantity < recipeIngredient.quantity) {
                    result.push({
                        name: recipeIngredient.name,
                        quantity: recipeIngredient.quantity - available.quantity,
                        unit: recipeIngredient.unit.toString()
                    });
                }
            }
            return result;
        }
        catch (error) {
            console.error('Error checking missing ingredients:', error);
            return [];
        }
    }
    /**
     * Convert recipe between measurement systems (metric/imperial)
     * @param recipe Recipe to convert
     * @param targetMeasurementSystem 'metric' or 'imperial'
     * @returns Converted recipe
     */
    async convertMeasurements(recipe, targetMeasurementSystem) {
        try {
            // This would involve a complex conversion system
            // For now, just return the original recipe
            console.log(`Converting recipe to ${targetMeasurementSystem} system`);
            return recipe;
        }
        catch (error) {
            console.error('Error converting measurements:', error);
            return recipe;
        }
    }
    /**
     * Scale a recipe for a different number of servings
     * @param recipe Recipe to scale
     * @param targetServings Number of servings to scale to
     * @returns Scaled recipe
     */
    async scaleRecipe(recipe, targetServings) {
        try {
            if (targetServings <= 0 || recipe.servings <= 0) {
                return recipe;
            }
            // Calculate the scaling factor
            const scaleFactor = targetServings / recipe.servings;
            // Create a new recipe with scaled ingredients
            const scaledRecipe = {
                ...recipe,
                servings: targetServings,
                ingredients: recipe.ingredients.map(ingredient => ({
                    ...ingredient,
                    quantity: ingredient.quantity * scaleFactor
                }))
            };
            // Scale the nutrition information
            if (recipe.nutritionPerServing) {
                // Note: nutrition per serving should remain the same
                // The total nutrition would change, but per serving stays the same
            }
            return scaledRecipe;
        }
        catch (error) {
            console.error('Error scaling recipe:', error);
            return recipe;
        }
    }
}
