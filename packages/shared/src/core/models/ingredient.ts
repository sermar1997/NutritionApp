/**
 * Ingredient models
 * 
 * Types and interfaces for ingredients and inventory items.
 */

import { NutritionInfo } from './nutrition';

/**
 * Ingredient category
 */
export enum IngredientCategory {
  FRUIT = 'FRUIT',
  VEGETABLE = 'VEGETABLE',
  MEAT = 'MEAT',
  FISH = 'FISH',
  DAIRY = 'DAIRY',
  GRAIN = 'GRAIN',
  LEGUME = 'LEGUME',
  NUT = 'NUT',
  HERB = 'HERB',
  SPICE = 'SPICE',
  OIL = 'OIL',
  CONDIMENT = 'CONDIMENT',
  SWEETENER = 'SWEETENER',
  BAKING = 'BAKING',
  BEVERAGE = 'BEVERAGE',
  OTHER = 'OTHER',
}

/**
 * Unit of measurement
 */
export enum UnitOfMeasurement {
  // Metric
  GRAM = 'GRAM',
  KILOGRAM = 'KILOGRAM',
  MILLILITER = 'MILLILITER',
  LITER = 'LITER',
  
  // Imperial
  TEASPOON = 'TEASPOON',
  TABLESPOON = 'TABLESPOON',
  CUP = 'CUP',
  OUNCE = 'OUNCE',
  POUND = 'POUND',
  
  // Other
  PINCH = 'PINCH',
  PIECE = 'PIECE',
  SLICE = 'SLICE',
  WHOLE = 'WHOLE',
}

/**
 * Base ingredient entity - represents a type of ingredient
 */
export interface Ingredient {
  /** Unique identifier */
  id: string;
  /** Ingredient name */
  name: string;
  /** Ingredient category */
  category: IngredientCategory;
  /** Nutrition information per 100g */
  nutritionPer100g: NutritionInfo;
  /** Quantity (for inventory ingredients) */
  quantity?: number;
  /** Unit of measurement (for inventory ingredients) */
  unit?: UnitOfMeasurement;
  /** Image URL */
  imageUrl?: string;
  /** Expiry date (for inventory ingredients) */
  expiryDate?: Date;
  /** Additional notes */
  notes?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Ingredient with purchase information for inventory
 */
export interface InventoryIngredient extends Ingredient {
  /** Purchase date */
  purchaseDate: Date;
  /** Quantity in inventory */
  quantity: number;
  /** Unit of measurement */
  unit: UnitOfMeasurement;
  /** Storage location */
  storageLocation?: string;
  /** Additional notes */
  notes?: string;
}

/**
 * Represents an ingredient's base data for creation
 */
export type IngredientCreateDto = Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Represents partial ingredient data for updates 
 */
export type IngredientUpdateDto = Partial<Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Represents an ingredient detected in image
 */
export interface DetectedIngredient {
  /** Ingredient name */
  name: string;
  /** Detection confidence (0-1) */
  confidence: number;
  /** Ingredient category if available */
  category?: IngredientCategory;
  /** Estimated quantity if available */
  estimatedQuantity?: {
    value: number;
    unit: UnitOfMeasurement;
  };
}
