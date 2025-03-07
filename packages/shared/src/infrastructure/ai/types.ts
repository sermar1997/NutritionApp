/**
 * AI infrastructure types
 */

import { Ingredient, Recipe } from '../../core/models';
import { ModelType, BoundingBox as CoreBoundingBox, ImageAnalysisResult as CoreImageAnalysisResult } from '../../core/models/ai';
import { DetectedIngredient as CoreDetectedIngredient } from '../../core/models/ingredient';

/**
 * Type alias for infrastructure layer
 */
export type AiModelType = ModelType;

/**
 * Extended bounding box in image for infrastructure layer
 */
export interface InfraBoundingBox extends CoreBoundingBox {
  confidence?: number;
  label?: string;
}

/**
 * Infrastructure specific detection result
 */
export interface RawDetection {
  class: string;
  confidence: number;
  boundingBox?: InfraBoundingBox;
}

/**
 * Extended detected ingredient for infrastructure implementation
 */
export interface InfraDetectedIngredient extends CoreDetectedIngredient {
  rawDetection?: RawDetection;
  metadata?: Record<string, any>;
}

/**
 * Extended image analysis result for infrastructure implementation
 */
export interface InfraImageAnalysisResult extends CoreImageAnalysisResult {
  rawDetections?: RawDetection[];
  modelVersion?: string;
  inferenceDevice?: string;
  confidenceThreshold?: number;
}

/**
 * Image analysis result
 */
export interface ImageAnalysisResult extends CoreImageAnalysisResult {
  detectedIngredients: InfraDetectedIngredient[];
  processingTimeMs: number;
  imageWidth: number;
  imageHeight: number;
}

/**
 * Recipe generation input
 */
export interface RecipeGenerationInput {
  availableIngredients: Ingredient[];
  mustUseIngredients: string[];
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
  usedIngredients: string[];
}

/**
 * Input for ingredient detection model
 */
export interface IngredientDetectionInput {
  imageData: Uint8Array;
  imageWidth: number;
  imageHeight: number;
}
