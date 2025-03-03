import { Ingredient, Recipe } from '../models';

/**
 * AI model type
 */
export enum ModelType {
  INGREDIENT_DETECTION = 'INGREDIENT_DETECTION',
  NUTRITION_ANALYSIS = 'NUTRITION_ANALYSIS',
  RECIPE_GENERATION = 'RECIPE_GENERATION',
}

/**
 * Ingredient bounding box in image
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Detected ingredient with confidence score
 */
export interface DetectedIngredient {
  ingredient: Ingredient;
  confidence: number;
  boundingBox?: BoundingBox;
}

/**
 * Image analysis result
 */
export interface ImageAnalysisResult {
  detectedIngredients: DetectedIngredient[];
  processingTimeMs: number;
  imageWidth: number;
  imageHeight: number;
}

/**
 * Recipe generation input
 */
export interface RecipeGenerationInput {
  availableIngredients: Ingredient[];
  mustUseIngredients: string[]; // List of ingredient IDs that must be used
  dietaryPreferences: string[];
  allergies: string[];
  mealType?: string;
  maxPrepTimeMinutes?: number;
  difficulty?: string;
  servings?: number;
}

/**
 * Recipe generation result
 */
export interface RecipeGenerationResult {
  recipes: Recipe[];
  processingTimeMs: number;
  usedIngredients: string[]; // List of ingredient IDs used
}
