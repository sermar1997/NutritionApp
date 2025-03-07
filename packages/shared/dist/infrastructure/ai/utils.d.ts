/**
 * AI utilities
 *
 * Utility functions for AI model management and processing
 */
import { ModelType } from '../../core/models/ai';
import { ModelMetadata } from './models';
import { NutritionInfo } from '../../core/models/nutrition';
/**
 * Determines if a model can be run locally or requires server connection
 * @param metadata Model metadata
 * @returns True if model can run offline
 */
export declare function canRunOffline(metadata: ModelMetadata): boolean;
/**
 * Estimates memory required to load a model
 * @param metadata Model metadata
 * @returns Estimated memory in MB
 */
export declare function estimateMemoryRequirement(metadata: ModelMetadata): number;
/**
 * Combines nutrition info from multiple ingredients
 * @param ingredients List of ingredient nutrition info objects with weight in grams
 * @returns Combined nutrition information
 */
export declare function combineNutritionInfo(ingredients: Array<{
    nutrition: NutritionInfo;
    weightInGrams: number;
}>): NutritionInfo;
/**
 * Gets a model-specific URL for either downloading or calling remotely
 * @param type Model type
 * @param version Model version
 * @param isDownload Whether this is for downloading or API calling
 * @returns URL string
 */
export declare function getModelUrl(type: ModelType, version: string, isDownload?: boolean): string;
