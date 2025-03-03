/**
 * TensorFlow.js implementation of ingredient detection model
 * 
 * This file implements a model handler for detecting ingredients in images
 * using TensorFlow.js and a pre-trained model.
 */
import * as tf from '@tensorflow/tfjs';
import { ModelHandler, ModelMetadata } from './models';
import { ModelType, ImageAnalysisResult, DetectedIngredient, BoundingBox } from './types';
import { Ingredient, IngredientCategory } from '../models';
import { getModelUrl } from './utils';

// Class labels for ingredient detection
const CLASS_MAPPING: Record<number, string> = {
  0: 'apple',
  1: 'banana',
  2: 'bell_pepper',
  3: 'broccoli',
  4: 'carrot',
  5: 'chicken',
  6: 'cucumber',
  7: 'egg',
  8: 'garlic',
  9: 'lemon',
  10: 'lettuce',
  11: 'milk',
  12: 'onion',
  13: 'potato',
  14: 'rice',
  15: 'salmon',
  16: 'tomato',
  // Add more ingredients as needed
};

// List of ingredients with nutritional information
const INGREDIENTS_DB: Record<string, Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>> = {
  'apple': { 
    name: 'Apple', 
    category: IngredientCategory.FRUIT,
    nutritionPer100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 }
  },
  'banana': { 
    name: 'Banana', 
    category: IngredientCategory.FRUIT,
    nutritionPer100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6 }
  },
  'bell_pepper': { 
    name: 'Bell Pepper', 
    category: IngredientCategory.VEGETABLE,
    nutritionPer100g: { calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 }
  },
  'broccoli': { 
    name: 'Broccoli', 
    category: IngredientCategory.VEGETABLE,
    nutritionPer100g: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6 }
  },
  'carrot': { 
    name: 'Carrot', 
    category: IngredientCategory.VEGETABLE,
    nutritionPer100g: { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8 }
  },
  // Add more ingredients with nutrition data
};

/**
 * Implementation of ingredient detection model using TensorFlow.js
 */
export class IngredientDetectionModel implements ModelHandler<HTMLImageElement | ImageData | string, ImageAnalysisResult> {
  private model: tf.GraphModel | null = null;
  private isModelLoading: boolean = false;
  private modelLoadPromise: Promise<void> | null = null;
  
  private readonly metadata: ModelMetadata = {
    name: 'ingredient-detection-mobile-net-v2',
    version: '1.0.0',
    type: ModelType.INGREDIENT_DETECTION,
    description: 'MobileNet v2 based model for ingredient detection in images',
    sizeKb: 11264, // ~11MB for the model
    lastUpdated: new Date('2025-01-15'),
    accuracy: 0.85,
    requiresInternetConnection: false,
    isPremiumOnly: false
  };
  
  /**
   * Get model metadata
   */
  public getMetadata(): ModelMetadata {
    return this.metadata;
  }
  
  /**
   * Check if model is ready for inference
   */
  public isReady(): boolean {
    return this.model !== null;
  }
  
  /**
   * Load the model
   */
  public async load(): Promise<void> {
    if (this.model) {
      return; // Model already loaded
    }
    
    if (this.isModelLoading) {
      return this.modelLoadPromise;
    }
    
    this.isModelLoading = true;
    
    try {
      // Create a promise to load the model
      this.modelLoadPromise = (async () => {
        // Ensure TensorFlow.js is ready
        await tf.ready();
        
        // Load the model from the specified URL
        const modelUrl = getModelUrl(ModelType.INGREDIENT_DETECTION, this.metadata.version, true);
        this.model = await tf.loadGraphModel(modelUrl);
        
        // Warm up the model with a dummy tensor
        const dummyInput = tf.zeros([1, 224, 224, 3]);
        await this.model.predict(dummyInput) as tf.Tensor;
        dummyInput.dispose();
        
        console.log('Ingredient detection model loaded successfully');
      })();
      
      await this.modelLoadPromise;
    } catch (error) {
      console.error('Failed to load ingredient detection model:', error);
      throw error;
    } finally {
      this.isModelLoading = false;
      this.modelLoadPromise = null;
    }
  }
  
  /**
   * Unload the model to free memory
   */
  public async unload(): Promise<void> {
    if (this.model) {
      await this.model.dispose();
      this.model = null;
    }
  }
  
  /**
   * Process an image to detect ingredients
   * @param input Image to process (can be HTML image element, ImageData, or data URL)
   * @returns Detection results
   */
  public async process(input: HTMLImageElement | ImageData | string): Promise<ImageAnalysisResult> {
    if (!this.isReady()) {
      await this.load();
    }
    
    if (!this.model) {
      throw new Error('Model failed to load');
    }
    
    const startTime = performance.now();
    
    try {
      // Convert input to tensor
      let imageTensor: tf.Tensor3D | tf.Tensor4D;
      let imageWidth: number;
      let imageHeight: number;
      
      if (typeof input === 'string') {
        // Handle data URL
        const image = new Image();
        image.src = input;
        await new Promise(resolve => {
          image.onload = resolve;
        });
        imageTensor = tf.browser.fromPixels(image);
        imageWidth = image.width;
        imageHeight = image.height;
      } else if ((input as HTMLImageElement).complete !== undefined) {
        // Handle HTML image element
        const image = input as HTMLImageElement;
        imageTensor = tf.browser.fromPixels(image);
        imageWidth = image.width;
        imageHeight = image.height;
      } else {
        // Handle ImageData
        const imageData = input as ImageData;
        imageTensor = tf.browser.fromPixels(imageData);
        imageWidth = imageData.width;
        imageHeight = imageData.height;
      }
      
      // Preprocess image
      const preprocessed = this.preprocessImage(imageTensor);
      imageTensor.dispose(); // Clean up original tensor
      
      // Run inference
      const predictions = await this.runInference(preprocessed);
      preprocessed.dispose(); // Clean up preprocessed tensor
      
      // Process predictions
      const detectedIngredients = this.processPredictions(predictions, imageWidth, imageHeight);
      
      const processingTimeMs = performance.now() - startTime;
      
      return {
        detectedIngredients,
        processingTimeMs,
        imageWidth,
        imageHeight
      };
    } catch (error) {
      console.error('Error during image processing:', error);
      throw error;
    }
  }
  
  /**
   * Preprocess image for the model
   * @param imageTensor Original image tensor
   * @returns Preprocessed tensor ready for model input
   */
  private preprocessImage(imageTensor: tf.Tensor3D): tf.Tensor4D {
    // Resize to expected model input size (224x224)
    const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
    imageTensor.dispose(); // Clean up original tensor
    
    // Normalize pixel values to [-1, 1]
    const normalized = resized.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1));
    resized.dispose(); // Clean up resized tensor
    
    // Expand dimensions to get shape [1, 224, 224, 3]
    const batched = normalized.expandDims(0) as tf.Tensor4D;
    normalized.dispose(); // Clean up normalized tensor
    
    return batched;
  }
  
  /**
   * Run model inference
   * @param inputTensor Preprocessed input tensor
   * @returns Model predictions
   */
  private async runInference(inputTensor: tf.Tensor4D): Promise<tf.Tensor> {
    if (!this.model) {
      throw new Error('Model not loaded');
    }
    
    // Run inference
    const result = await this.model.predict(inputTensor) as tf.Tensor;
    return result;
  }
  
  /**
   * Process model predictions to get detected ingredients
   * @param predictions Raw model predictions
   * @param imageWidth Original image width
   * @param imageHeight Original image height
   * @returns List of detected ingredients with confidence scores
   */
  private processPredictions(predictions: tf.Tensor, imageWidth: number, imageHeight: number): DetectedIngredient[] {
    // For object detection models (SSD, YOLO, etc.), predictions include boxes and scores
    // For classification models, predictions are class probabilities
    
    // This is a simplified implementation - adapt based on your actual model output format
    const [boxes, scores, classes, valid_detections] = this.extractPredictions(predictions);
    
    const detectedIngredients: DetectedIngredient[] = [];
    const numDetections = valid_detections.dataSync()[0];
    
    const boxesData = boxes.dataSync();
    const scoresData = scores.dataSync();
    const classesData = classes.dataSync();
    
    // Threshold for detection confidence
    const CONFIDENCE_THRESHOLD = 0.5;
    
    for (let i = 0; i < numDetections; i++) {
      const confidence = scoresData[i];
      
      // Filter low-confidence detections
      if (confidence < CONFIDENCE_THRESHOLD) continue;
      
      const classId = Math.round(classesData[i]);
      const className = CLASS_MAPPING[classId];
      
      if (!className || !INGREDIENTS_DB[className]) continue;
      
      // Get bounding box (normalized [0-1] values)
      const y1 = boxesData[i * 4];
      const x1 = boxesData[i * 4 + 1];
      const y2 = boxesData[i * 4 + 2];
      const x2 = boxesData[i * 4 + 3];
      
      // Convert to pixel coordinates
      const boundingBox: BoundingBox = {
        x: x1 * imageWidth,
        y: y1 * imageHeight,
        width: (x2 - x1) * imageWidth,
        height: (y2 - y1) * imageHeight
      };
      
      // Create ingredient instance with random ID and default values
      const ingredientBase = INGREDIENTS_DB[className];
      const ingredient: Ingredient = {
        id: `${className}_${Date.now()}`, // Generate a unique ID
        name: ingredientBase.name,
        category: ingredientBase.category,
        quantity: 1, // Default quantity
        unit: 'piece', // Default unit
        nutritionPer100g: { ...ingredientBase.nutritionPer100g },
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default: 1 week from now
      };
      
      detectedIngredients.push({
        ingredient,
        confidence,
        boundingBox
      });
    }
    
    // Clean up tensors
    boxes.dispose();
    scores.dispose();
    classes.dispose();
    valid_detections.dispose();
    predictions.dispose();
    
    return detectedIngredients;
  }
  
  /**
   * Extract prediction components from model output
   * @param predictions Model output tensor
   * @returns Tuple of [boxes, scores, classes, valid_detections] tensors
   */
  private extractPredictions(predictions: tf.Tensor): [tf.Tensor, tf.Tensor, tf.Tensor, tf.Tensor] {
    // This is a simplified implementation - adapt based on your actual model output format
    // Assuming predictions is in the format expected by TensorFlow Object Detection API models
    
    // For a SSD MobileNet model, the output might be:
    // - A tensor with shape [1, N, 4] for the boxes (normalized [y1, x1, y2, x2])
    // - A tensor with shape [1, N] for the scores
    // - A tensor with shape [1, N] for the classes
    // - A scalar tensor for the number of valid detections
    
    // For demonstration, we'll create dummy outputs
    if (this.model) {
      // NOTE: This is just a placeholder - your actual model will have different outputs
      return [
        tf.tensor2d([[0.1, 0.1, 0.9, 0.9]], [1, 4]), // Single box covering most of the image
        tf.tensor1d([0.95]), // High confidence
        tf.tensor1d([0]), // Class 0 (apple)
        tf.scalar(1) // 1 valid detection
      ];
    }
    
    // If using real model, uncomment code like this:
    /*
    // For SSD models, the output is usually a dictionary or array of 4 tensors
    if (predictions instanceof Array) {
      return [
        predictions[0].squeeze(), // boxes
        predictions[1].squeeze(), // scores
        predictions[2].squeeze(), // classes
        predictions[3] // valid detections
      ];
    } else if (predictions instanceof Object) {
      // Some models return named outputs
      return [
        predictions['detection_boxes'].squeeze(),
        predictions['detection_scores'].squeeze(),
        predictions['detection_classes'].squeeze(),
        predictions['num_detections']
      ];
    }
    */
    
    throw new Error('Unsupported prediction format');
  }
}

/**
 * Create a new instance of the ingredient detection model
 * @returns Model handler instance
 */
export function createIngredientDetectionModel(): ModelHandler<HTMLImageElement | ImageData | string, ImageAnalysisResult> {
  return new IngredientDetectionModel();
}
