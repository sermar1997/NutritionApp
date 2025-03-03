/**
 * Nutrition models
 */
/**
 * Nutrition information
 */
export interface NutritionInfo {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    saturatedFat?: number;
    unsaturatedFat?: number;
    transFat?: number;
    cholesterol?: number;
    sodium?: number;
    potassium?: number;
    fiber?: number;
    sugar?: number;
    vitaminA?: number;
    vitaminC?: number;
    calcium?: number;
    iron?: number;
}
/**
 * Meal nutritional information
 */
export interface MealNutrition {
    name: string;
    recipeId?: string;
    nutrition: NutritionInfo;
}
/**
 * Daily nutritional summary
 */
export interface DailyNutritionSummary {
    date: Date;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalSugar?: number;
    totalFiber?: number;
    meals: MealNutrition[];
    createdAt: Date;
    updatedAt: Date;
}
