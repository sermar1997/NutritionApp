/**
 * AI models
 *
 * Types and interfaces for AI and machine learning components.
 */
import { DetectedIngredient } from './ingredient';
/**
 * Model type for ingredient detection
 */
export declare enum ModelType {
    TENSORFLOW_JS = "TENSORFLOW_JS",
    TENSORFLOW_LITE = "TENSORFLOW_LITE",
    ONNX = "ONNX"
}
/**
 * Model configuration
 */
export interface ModelConfig {
    /** Type of model */
    modelType: ModelType;
    /** URL to model file */
    modelUrl: string;
    /** URL to labels file */
    labelsUrl?: string;
    /** Input dimensions */
    inputDimensions: {
        width: number;
        height: number;
        channels: number;
    };
    /** Preprocessing options */
    preprocessing?: {
        normalizeInput?: boolean;
        centerCrop?: boolean;
    };
}
/**
 * Bounding box for object detection
 */
export interface BoundingBox {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
    /** Width */
    width: number;
    /** Height */
    height: number;
}
/**
 * Detection result
 */
export interface Detection {
    /** Class name */
    class: string;
    /** Confidence score (0-1) */
    confidence: number;
    /** Bounding box if object detection */
    boundingBox?: BoundingBox;
}
/**
 * Image analysis result
 */
export interface ImageAnalysisResult {
    /** Timestamp of analysis */
    timestamp: number;
    /** Width of analyzed image */
    imageWidth: number;
    /** Height of analyzed image */
    imageHeight: number;
    /** List of detected items */
    detections: Detection[];
    /** Processed detections as ingredients */
    ingredients: DetectedIngredient[];
    /** Processing time in milliseconds */
    processingTimeMs?: number;
    /** Model used for detection */
    modelName?: string;
}
