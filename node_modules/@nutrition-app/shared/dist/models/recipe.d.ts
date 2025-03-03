import { NutritionInfo } from './nutrition';
import { DietaryPreference } from './user';
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
 * Recipe ingredient
 */
export interface RecipeIngredient {
    ingredientId: string;
    name: string;
    quantity: number;
    unit: UnitOfMeasurement;
    optional: boolean;
    notes?: string;
}
/**
 * Recipe timer
 */
export interface Timer {
    durationMinutes: number;
    description?: string;
}
/**
 * Recipe instruction step
 */
export interface InstructionStep {
    stepNumber: number;
    instruction: string;
    timers?: Timer[];
}
/**
 * Recipe model
 */
export interface Recipe {
    id: string;
    name: string;
    description?: string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    difficulty: DifficultyLevel;
    imageUrl?: string;
    ingredients: RecipeIngredient[];
    instructions: InstructionStep[];
    tags?: string[];
    suitableFor?: DietaryPreference[];
    nutritionPerServing: NutritionInfo;
    source?: string;
    notes?: string;
    rating?: number;
    favorite: boolean;
    isAiGenerated: boolean;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Meal in meal plan
 */
export interface MealPlanMeal {
    name: string;
    recipeId: string;
    recipeName: string;
    servings: number;
    completed: boolean;
}
/**
 * Meal plan day
 */
export interface MealPlanDay {
    date: Date;
    meals: MealPlanMeal[];
}
/**
 * Meal plan
 */
export interface MealPlan {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    days: MealPlanDay[];
    createdAt: Date;
    updatedAt: Date;
}
