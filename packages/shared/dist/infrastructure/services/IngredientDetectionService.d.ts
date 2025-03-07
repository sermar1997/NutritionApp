/**
 * Ingredient Detection Service Implementation
 *
 * This service encapsulates the logic for detecting ingredients in images
 * using AI models, following the Service Layer Pattern.
 */
import { IIngredientDetectionService } from '../../core/domain/services/IIngredientDetectionService';
import { ImageAnalysisResult } from '../../core/models/ai';
import { DetectedIngredient } from '../../core/models/ingredient';
import { IngredientDetectionInput, InfraImageAnalysisResult } from '../ai/types';
interface ModelHandler<TInput, TOutput> {
    process(input: TInput): Promise<TOutput>;
    load(): Promise<void>;
    unload(): Promise<void>;
    isLoaded(): boolean;
    getMetadata?(): any;
}
/**
 * Implementation of the ingredient detection service using TensorFlow
 */
export declare class IngredientDetectionService implements IIngredientDetectionService {
    private model;
    private modelLoaded;
    /**
     * Create a new ingredient detection service
     * @param model Optional model handler for dependency injection
     */
    constructor(model?: ModelHandler<IngredientDetectionInput, InfraImageAnalysisResult>);
    /**
     * Create a placeholder model for demonstration
     * @returns A placeholder model handler
     */
    private createPlaceholderModel;
    /**
     * Detect ingredients in an image
     * @param imageData Image to analyze (HTML element, ImageData or data URL)
     * @returns Analysis results with detected ingredients
     */
    detectIngredientsInImage(imageData: HTMLImageElement | ImageData | string): Promise<ImageAnalysisResult>;
    /**
     * Extract detected ingredients for direct use
     * @param imageData Image to analyze
     * @param confidenceThreshold Minimum confidence threshold
     * @returns List of detected ingredients
     */
    extractIngredients(imageData: HTMLImageElement | ImageData | string, confidenceThreshold?: number): Promise<DetectedIngredient[]>;
    /**
     * Convert domain model input to model-specific input
     */
    private convertToModelInput;
    /**
     * Convert from infrastructure result to domain model result
     */
    private convertToDomainResult;
    /**
     * Load the ingredient detection model
     * @returns Promise that resolves when model is loaded
     */
    loadModel(): Promise<void>;
    /**
     * Check if the model is loaded
     * @returns True if model is loaded and ready
     */
    isModelLoaded(): boolean;
    /**
     * Release AI model resources
     * @returns Promise that resolves when model is unloaded
     */
    releaseModel(): Promise<void>;
}
/**
 * Factory function to create a new ingredient detection service
 * @returns A new instance of IIngredientDetectionService
 */
export declare function createIngredientDetectionService(): IIngredientDetectionService;
export {};
