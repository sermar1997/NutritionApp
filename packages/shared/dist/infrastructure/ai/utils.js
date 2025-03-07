/**
 * AI utilities
 *
 * Utility functions for AI model management and processing
 */
import { ModelType } from '../../core/models/ai';
/**
 * Determines if a model can be run locally or requires server connection
 * @param metadata Model metadata
 * @returns True if model can run offline
 */
export function canRunOffline(metadata) {
    return !metadata.requiresInternetConnection;
}
/**
 * Estimates memory required to load a model
 * @param metadata Model metadata
 * @returns Estimated memory in MB
 */
export function estimateMemoryRequirement(metadata) {
    // Basic estimation: model size * 2 for runtime overhead
    return (metadata.sizeKb / 1024) * 2;
}
/**
 * Combines nutrition info from multiple ingredients
 * @param ingredients List of ingredient nutrition info objects with weight in grams
 * @returns Combined nutrition information
 */
export function combineNutritionInfo(ingredients) {
    const result = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    };
    ingredients.forEach(item => {
        const factor = item.weightInGrams / 100; // Nutrition is typically per 100g
        result.calories += item.nutrition.calories * factor;
        result.protein += item.nutrition.protein * factor;
        result.carbs += item.nutrition.carbs * factor;
        result.fat += item.nutrition.fat * factor;
        // Optional nutritional values
        if (item.nutrition.fiber !== undefined) {
            result.fiber = (result.fiber || 0) + item.nutrition.fiber * factor;
        }
        if (item.nutrition.sugar !== undefined) {
            result.sugar = (result.sugar || 0) + item.nutrition.sugar * factor;
        }
        if (item.nutrition.saturatedFat !== undefined) {
            result.saturatedFat = (result.saturatedFat || 0) + item.nutrition.saturatedFat * factor;
        }
        if (item.nutrition.unsaturatedFat !== undefined) {
            result.unsaturatedFat = (result.unsaturatedFat || 0) + item.nutrition.unsaturatedFat * factor;
        }
    });
    // Round values to 1 decimal place
    return {
        calories: Math.round(result.calories * 10) / 10,
        protein: Math.round(result.protein * 10) / 10,
        carbs: Math.round(result.carbs * 10) / 10,
        fat: Math.round(result.fat * 10) / 10,
        fiber: result.fiber !== undefined ? Math.round(result.fiber * 10) / 10 : undefined,
        sugar: result.sugar !== undefined ? Math.round(result.sugar * 10) / 10 : undefined,
        saturatedFat: result.saturatedFat !== undefined ? Math.round(result.saturatedFat * 10) / 10 : undefined,
        unsaturatedFat: result.unsaturatedFat !== undefined ? Math.round(result.unsaturatedFat * 10) / 10 : undefined,
    };
}
/**
 * Gets a model-specific URL for either downloading or calling remotely
 * @param type Model type
 * @param version Model version
 * @param isDownload Whether this is for downloading or API calling
 * @returns URL string
 */
export function getModelUrl(type, version, isDownload = false) {
    const base = isDownload
        ? 'https://storage.googleapis.com/nutrition-app-models/'
        : 'https://api.nutrition-app.com/models/';
    const endpoint = (() => {
        switch (type) {
            case ModelType.TENSORFLOW_JS:
                return 'ingredient-detection';
            case ModelType.TENSORFLOW_LITE:
                return 'ingredient-detection-mobile';
            case ModelType.ONNX:
                return 'nutrition-analysis';
            default:
                return 'generic';
        }
    })();
    return `${base}${endpoint}/${version}${isDownload ? '.zip' : ''}`;
}
