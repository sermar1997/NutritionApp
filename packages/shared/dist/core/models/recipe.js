/**
 * Recipe models
 *
 * Types and interfaces for recipes, meal plans, and related entities.
 */
/**
 * Recipe difficulty level
 */
export var DifficultyLevel;
(function (DifficultyLevel) {
    DifficultyLevel["EASY"] = "EASY";
    DifficultyLevel["MEDIUM"] = "MEDIUM";
    DifficultyLevel["HARD"] = "HARD";
})(DifficultyLevel || (DifficultyLevel = {}));
/**
 * Dietary preferences
 */
export var DietaryPreference;
(function (DietaryPreference) {
    DietaryPreference["VEGETARIAN"] = "VEGETARIAN";
    DietaryPreference["VEGAN"] = "VEGAN";
    DietaryPreference["GLUTEN_FREE"] = "GLUTEN_FREE";
    DietaryPreference["DAIRY_FREE"] = "DAIRY_FREE";
    DietaryPreference["NUT_FREE"] = "NUT_FREE";
    DietaryPreference["LOW_CARB"] = "LOW_CARB";
    DietaryPreference["KETO"] = "KETO";
    DietaryPreference["PALEO"] = "PALEO";
    DietaryPreference["LOW_FAT"] = "LOW_FAT";
    DietaryPreference["LOW_SODIUM"] = "LOW_SODIUM";
    DietaryPreference["DIABETIC"] = "DIABETIC";
})(DietaryPreference || (DietaryPreference = {}));
