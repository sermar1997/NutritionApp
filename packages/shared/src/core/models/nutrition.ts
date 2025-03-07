/**
 * Nutrition models
 * 
 * Types and interfaces for nutrition data.
 */

/**
 * Nutrition information for ingredients and recipes
 */
export interface NutritionInfo {
  /** Calories in kcal */
  calories: number;
  /** Protein in grams */
  protein: number;
  /** Total carbohydrates in grams */
  carbs: number;
  /** Total fat in grams */
  fat: number;
  /** Saturated fat in grams */
  saturatedFat?: number;
  /** Unsaturated fat in grams */
  unsaturatedFat?: number;
  /** Trans fat in grams */
  transFat?: number;
  /** Cholesterol in milligrams */
  cholesterol?: number;
  /** Sodium in milligrams */
  sodium?: number;
  /** Potassium in milligrams */
  potassium?: number;
  /** Dietary fiber in grams */
  fiber?: number;
  /** Sugar in grams */
  sugar?: number;
  /** Vitamin A in IU or mcg RAE */
  vitaminA?: number;
  /** Vitamin C in milligrams */
  vitaminC?: number;
  /** Calcium in milligrams */
  calcium?: number;
  /** Iron in milligrams */
  iron?: number;
}

/**
 * Meal nutritional information
 */
export interface MealNutrition {
  /** Name of the meal */
  name: string;
  /** Nutrition information for the meal */
  nutrition: NutritionInfo;
  /** Recipe ID if applicable */
  recipeId?: string;
}

/**
 * Daily nutritional summary
 */
export interface DailyNutritionSummary {
  /** Date of the nutrition summary */
  date: Date;
  /** Total calories for the day */
  totalCalories: number;
  /** Total protein for the day */
  totalProtein: number;
  /** Total carbohydrates for the day */
  totalCarbs: number;
  /** Total fat for the day */
  totalFat: number;
  /** Total sugar for the day */
  totalSugar?: number;
  /** Total fiber for the day */
  totalFiber?: number;
  /** Nutritional information for each meal */
  meals: MealNutrition[];
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}
