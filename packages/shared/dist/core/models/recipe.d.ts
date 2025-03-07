/**
 * Recipe models
 *
 * Types and interfaces for recipes, meal plans, and related entities.
 */
import { NutritionInfo } from './nutrition';
import { UnitOfMeasurement } from './ingredient';
/**
 * Recipe difficulty level
 */
export declare enum DifficultyLevel {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}
/**
 * Dietary preferences
 */
export declare enum DietaryPreference {
    VEGETARIAN = "VEGETARIAN",
    VEGAN = "VEGAN",
    GLUTEN_FREE = "GLUTEN_FREE",
    DAIRY_FREE = "DAIRY_FREE",
    NUT_FREE = "NUT_FREE",
    LOW_CARB = "LOW_CARB",
    KETO = "KETO",
    PALEO = "PALEO",
    LOW_FAT = "LOW_FAT",
    LOW_SODIUM = "LOW_SODIUM",
    DIABETIC = "DIABETIC"
}
/**
 * Recipe ingredient
 */
export interface RecipeIngredient {
    /** Reference to the ingredient ID */
    ingredientId: string;
    /** Denormalized name for offline display */
    name: string;
    /** Quantity required */
    quantity: number;
    /** Unit of measurement */
    unit: UnitOfMeasurement;
    /** Whether the ingredient is optional */
    optional: boolean;
    /** Additional notes about the ingredient */
    notes?: string;
}
/**
 * Recipe timer
 */
export interface Timer {
    /** Duration in minutes */
    durationMinutes: number;
    /** Description of what the timer is for */
    description?: string;
}
/**
 * Recipe instruction step
 */
export interface InstructionStep {
    /** Step number in sequence */
    stepNumber: number;
    /** Instructions for the step */
    instruction: string;
    /** Timers associated with the step */
    timers?: Timer[];
}
/**
 * Recipe model
 */
export interface Recipe {
    /** Unique identifier */
    id: string;
    /** Recipe name */
    name: string;
    /** Recipe description */
    description?: string;
    /** Preparation time in minutes */
    prepTimeMinutes: number;
    /** Cooking time in minutes */
    cookTimeMinutes: number;
    /** Number of servings */
    servings: number;
    /** Recipe difficulty */
    difficulty: DifficultyLevel;
    /** Recipe image URL */
    imageUrl?: string;
    /** List of ingredients with quantities */
    ingredients: RecipeIngredient[];
    /** Step-by-step instructions */
    instructions: InstructionStep[];
    /** Tags for categorization */
    tags?: string[];
    /** Dietary preferences this recipe is suitable for */
    suitableFor?: DietaryPreference[];
    /** Nutritional information per serving */
    nutritionPerServing: NutritionInfo;
    /** Source of the recipe (URL, book, etc.) */
    source?: string;
    /** Additional notes */
    notes?: string;
    /** Is a user favorite */
    isFavorite?: boolean;
    /** Creation timestamp */
    createdAt: Date;
    /** Last update timestamp */
    updatedAt: Date;
}
/**
 * Meal in meal plan
 */
export interface MealPlanMeal {
    /** Meal name (breakfast, lunch, dinner, etc.) */
    name: string;
    /** Reference to recipe ID */
    recipeId: string;
    /** Denormalized recipe name */
    recipeName: string;
    /** Number of servings */
    servings: number;
    /** Whether the meal has been completed */
    completed: boolean;
}
/**
 * Meal plan day
 */
export interface MealPlanDay {
    /** Date for this plan */
    date: Date;
    /** Meals planned for the day */
    meals: MealPlanMeal[];
}
/**
 * Meal plan
 */
export interface MealPlan {
    /** Unique identifier */
    id: string;
    /** Plan name */
    name: string;
    /** Start date of the plan */
    startDate: Date;
    /** End date of the plan */
    endDate: Date;
    /** Daily meal plans */
    days: MealPlanDay[];
    /** Creation timestamp */
    createdAt: Date;
    /** Last update timestamp */
    updatedAt: Date;
}
/**
 * Represents recipe base data for creation
 */
export type RecipeCreateDto = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
/**
 * Represents partial recipe data for updates
 */
export type RecipeUpdateDto = Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>;
/**
 * Recipe generation preferences
 */
export interface RecipeGenerationPreferences {
    /** Cuisine type (e.g., Italian, Mexican) */
    cuisine?: string;
    /** Dietary restrictions */
    dietary?: DietaryPreference[];
    /** Difficulty level */
    difficulty?: DifficultyLevel;
    /** Maximum preparation time in minutes */
    maxPrepTime?: number;
    /** Ingredients to include */
    includeIngredients?: string[];
    /** Ingredients to exclude */
    excludeIngredients?: string[];
}
