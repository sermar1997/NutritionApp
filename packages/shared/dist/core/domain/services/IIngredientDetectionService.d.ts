/**
 * Ingredient Detection Service Interface
 *
 * Defines the contract for services that detect ingredients in images.
 */
import { ImageAnalysisResult } from '../../models/ai';
import { DetectedIngredient } from '../../models/ingredient';
/**
 * Interface for ingredient detection service
 */
export interface IIngredientDetectionService {
    /**
     * Detect ingredients in an image
     * @param imageData Image to analyze (HTML element, ImageData or data URL)
     * @returns Analysis results with detected ingredients
     */
    detectIngredientsInImage(imageData: HTMLImageElement | ImageData | string): Promise<ImageAnalysisResult>;
    /**
     * Extract detected ingredients for direct use
     * @param imageData Image to analyze (HTML element, ImageData or data URL)
     * @returns Array of detected ingredients
     */
    extractIngredients(imageData: HTMLImageElement | ImageData | string): Promise<DetectedIngredient[]>;
    /**
     * Load the ingredient detection model
     * @returns Promise that resolves when the model is loaded
     */
    loadModel(): Promise<void>;
    /**
     * Check if the model is loaded
     * @returns True if the model is loaded
     */
    isModelLoaded(): boolean;
}
