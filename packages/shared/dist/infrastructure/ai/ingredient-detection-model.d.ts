import { ModelHandler, ModelMetadata } from './models';
import { InfraImageAnalysisResult, IngredientDetectionInput } from './types';
/**
 * Implementation of ingredient detection model using TensorFlow.js
 */
export declare class IngredientDetectionModel implements ModelHandler<IngredientDetectionInput, InfraImageAnalysisResult> {
    private model;
    private isModelLoading;
    private modelLoadPromise;
    private readonly metadata;
    /**
     * Get model metadata
     */
    getMetadata(): ModelMetadata;
    /**
     * Check if model is ready for inference
     */
    isReady(): boolean;
    /**
     * Load the model
     */
    load(): Promise<void>;
    /**
     * Unload the model to free memory
     */
    unload(): Promise<void>;
    /**
     * Process an image to detect ingredients
     * @param input Object containing image data and dimensions
     * @returns Analysis result with detected ingredients
     */
    process(input: IngredientDetectionInput): Promise<InfraImageAnalysisResult>;
    /**
     * Preprocess image for the model
     * @param imageTensor Original image tensor
     * @returns Preprocessed tensor ready for model input
     */
    private preprocessImage;
    /**
     * Run model inference
     * @param inputTensor Preprocessed input tensor
     * @returns Model predictions
     */
    private runInference;
    /**
     * Process model predictions to get detected ingredients
     * @param predictions Raw model predictions
     * @returns List of detected ingredients with confidence scores
     */
    private processPredictions;
    /**
     * Extract prediction components from model output
     * @param predictions Model output tensor
     * @returns Tuple of [boxes, scores, classes, valid_detections] tensors
     */
    private extractPredictions;
}
/**
 * Create a new instance of the ingredient detection model
 * @returns Model handler instance
 */
export declare function createIngredientDetectionModel(): ModelHandler<IngredientDetectionInput, InfraImageAnalysisResult>;
