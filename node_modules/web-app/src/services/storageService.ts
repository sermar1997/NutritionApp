/**
 * Service for handling localStorage operations
 * Provides utilities for storing and retrieving different types of data
 */

import { MealPlan } from '../types/mealPlan';

// Keys used for localStorage
const STORAGE_KEYS = {
  MEAL_PLAN: 'nutritionApp_mealPlan',
  FAVORITE_RECIPES: 'nutritionApp_favoriteRecipes',
};

/**
 * Save meal plan to localStorage
 * @param mealPlan The meal plan to save
 */
export const saveMealPlan = (mealPlan: MealPlan): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(mealPlan));
  } catch (error) {
    console.error('Error saving meal plan to localStorage:', error);
  }
};

/**
 * Load meal plan from localStorage
 * @returns The stored meal plan or null if not found
 */
export const loadMealPlan = (): MealPlan | null => {
  try {
    const savedPlan = localStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
    return savedPlan ? JSON.parse(savedPlan) : null;
  } catch (error) {
    console.error('Error loading meal plan from localStorage:', error);
    return null;
  }
};

/**
 * Save favorite recipe IDs to localStorage
 * @param favoriteIds Array of favorite recipe IDs
 */
export const saveFavoriteRecipes = (favoriteIds: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITE_RECIPES, JSON.stringify(favoriteIds));
  } catch (error) {
    console.error('Error saving favorite recipes to localStorage:', error);
  }
};

/**
 * Load favorite recipe IDs from localStorage
 * @returns Array of favorite recipe IDs or empty array if none found
 */
export const loadFavoriteRecipes = (): string[] => {
  try {
    const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITE_RECIPES);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
    console.error('Error loading favorite recipes from localStorage:', error);
    return [];
  }
};

/**
 * Check if a recipe is favorited
 * @param recipeId The recipe ID to check
 * @returns boolean indicating if the recipe is favorited
 */
export const isRecipeFavorite = (recipeId: string): boolean => {
  const favorites = loadFavoriteRecipes();
  return favorites.includes(recipeId);
};

/**
 * Toggle favorite status for a recipe
 * @param recipeId The recipe ID to toggle
 * @returns The new favorite status (true = favorited, false = unfavorited)
 */
export const toggleFavoriteRecipe = (recipeId: string): boolean => {
  const favorites = loadFavoriteRecipes();
  
  if (favorites.includes(recipeId)) {
    // Remove from favorites
    const updatedFavorites = favorites.filter(id => id !== recipeId);
    saveFavoriteRecipes(updatedFavorites);
    return false;
  } else {
    // Add to favorites
    const updatedFavorites = [...favorites, recipeId];
    saveFavoriteRecipes(updatedFavorites);
    return true;
  }
};
