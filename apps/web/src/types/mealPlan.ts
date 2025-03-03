import { RecipeCardProps } from '../components/recipes/RecipeCard';

/**
 * Types of meals in a day
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

/**
 * Structure for a day's meal plan
 */
export interface DayMealPlan {
  breakfast: RecipeCardProps | null;
  lunch: RecipeCardProps | null;
  dinner: RecipeCardProps | null;
  snacks: RecipeCardProps[];
}

/**
 * Structure for a complete meal plan
 * Keys are dates in YYYY-MM-DD format
 */
export interface MealPlan {
  [date: string]: DayMealPlan;
}

/**
 * Nutrition summary for a day's meals
 */
export interface DailyNutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
