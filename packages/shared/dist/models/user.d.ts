/**
 * User models
 */
/**
 * Dietary preferences
 */
export declare enum DietaryPreference {
    OMNIVORE = "OMNIVORE",
    VEGETARIAN = "VEGETARIAN",
    VEGAN = "VEGAN",
    PESCATARIAN = "PESCATARIAN",
    KETO = "KETO",
    PALEO = "PALEO",
    LOW_CARB = "LOW_CARB",
    LOW_FAT = "LOW_FAT",
    GLUTEN_FREE = "GLUTEN_FREE",
    DAIRY_FREE = "DAIRY_FREE"
}
/**
 * User allergies
 */
export declare enum Allergy {
    GLUTEN = "GLUTEN",
    DAIRY = "DAIRY",
    NUTS = "NUTS",
    EGGS = "EGGS",
    SOY = "SOY",
    FISH = "FISH",
    SHELLFISH = "SHELLFISH",
    WHEAT = "WHEAT",
    PEANUTS = "PEANUTS",
    TREE_NUTS = "TREE_NUTS"
}
/**
 * User nutrition goals
 */
export interface NutritionGoal {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    sugar?: number;
    fiber?: number;
}
/**
 * User subscription level
 */
export declare enum SubscriptionLevel {
    FREE = "FREE",
    PREMIUM = "PREMIUM",
    PREMIUM_PLUS = "PREMIUM_PLUS"
}
/**
 * User model
 */
export interface User {
    id: string;
    email: string;
    name?: string;
    dietaryPreferences?: DietaryPreference[];
    allergies?: Allergy[];
    nutritionGoals?: NutritionGoal;
    subscriptionLevel: SubscriptionLevel;
    subscriptionValidUntil?: Date;
    createdAt: Date;
    updatedAt: Date;
}
