/**
 * Model interfaces for AI components
 */
import { ModelType } from '../../core/models/ai';
/**
 * Base interface for AI model metadata
 */
export interface ModelMetadata {
    name: string;
    version: string;
    type: ModelType;
    description: string;
    sizeKb: number;
    lastUpdated: Date;
    accuracy: number;
    requiresInternetConnection: boolean;
    isPremiumOnly: boolean;
}
/**
 * Interface for an AI model handler
 */
export interface ModelHandler<T, U> {
    /**
     * Process input data through the AI model
     * @param input Input data for the model
     * @returns Processed output from the model
     */
    process(input: T): Promise<U>;
    /**
     * Get metadata about the model
     * @returns Model metadata
     */
    getMetadata(): ModelMetadata;
    /**
     * Check if the model is ready for processing
     * @returns True if the model is loaded and ready
     */
    isReady(): boolean;
    /**
     * Load the model if not already loaded
     * @returns Promise that resolves when the model is loaded
     */
    load(): Promise<void>;
    /**
     * Unload the model to free memory
     * @returns Promise that resolves when the model is unloaded
     */
    unload(): Promise<void>;
}
