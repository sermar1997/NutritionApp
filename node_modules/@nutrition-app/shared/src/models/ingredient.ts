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
  GRAM = 'GRAM',
  KILOGRAM = 'KILOGRAM',
  MILLILITER = 'MILLILITER',
  LITER = 'LITER',
  TEASPOON = 'TEASPOON',
  TABLESPOON = 'TABLESPOON',
  CUP = 'CUP',
  OUNCE = 'OUNCE',
  POUND = 'POUND',
  PINCH = 'PINCH',
  PIECE = 'PIECE',
  SLICE = 'SLICE',
  WHOLE = 'WHOLE',
}

/**
 * Ingredient model
 */
export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  nutritionPer100g: NutritionInfo;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Inventory item - represents an ingredient in the user's inventory
 */
export interface IngredientInventoryItem {
  id: string;
  ingredientId: string;
  ingredient?: Ingredient; // Optional denormalized ingredient data
  quantity: number;
  unit: UnitOfMeasurement;
  expirationDate?: Date;
  purchaseDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
