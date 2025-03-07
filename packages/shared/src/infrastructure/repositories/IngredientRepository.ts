/**
 * Ingredient Repository Implementation
 * 
 * Implements the ingredient repository interface using the base repository.
 */

import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './BaseRepository';
import { IIngredientRepository } from '../../core/domain/repositories/IIngredientRepository';
import { 
  Ingredient, 
  IngredientCategory,
  IngredientCreateDto,
  IngredientUpdateDto
} from '../../core/models/ingredient';
import { StorageService } from '../storage/StorageService';

/**
 * Storage-based implementation of the Ingredient Repository
 */
export class IngredientRepository 
  extends BaseRepository<Ingredient> 
  implements IIngredientRepository {
  
  /**
   * Create a new ingredient repository
   * @param storageService Optional storage service (for DI)
   */
  constructor(storageService?: StorageService) {
    super('ingredients', storageService);
  }
  
  /**
   * Override serialize to handle dates and enums
   * @param ingredient Ingredient to serialize
   * @returns Serialized ingredient
   */
  protected override serialize(ingredient: Ingredient): any {
    return {
      ...super.serialize(ingredient),
      category: ingredient.category.toString(),
      expiryDate: ingredient.expiryDate?.toISOString(),
    };
  }
  
  /**
   * Override deserialize to handle dates and enums
   * @param data Serialized ingredient data
   * @returns Deserialized ingredient
   */
  protected override deserialize(data: any): Ingredient {
    const baseIngredient = super.deserialize(data);
    
    return {
      ...baseIngredient,
      // Convert string category to enum if needed
      category: Object.values(IngredientCategory).includes(data.category as IngredientCategory)
        ? data.category as IngredientCategory
        : IngredientCategory.OTHER,
      // Parse dates
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
    };
  }
  
  /**
   * Get ingredients by category
   * @param category Category enum value
   * @returns List of ingredients in the category
   */
  async getByCategoryId(category: IngredientCategory): Promise<Ingredient[]> {
    try {
      const ingredients = await this.getAll();
      
      return ingredients.filter(ingredient => ingredient.category === category);
    } catch (error) {
      console.error('Error getting ingredients by category:', error);
      return [];
    }
  }
  
  /**
   * Get ingredients expiring within a certain number of days
   * @param days Number of days to check for expiration
   * @returns List of ingredients expiring within the specified days
   */
  async getExpiringIngredients(days: number): Promise<Ingredient[]> {
    try {
      const ingredients = await this.getAll();
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + days);
      
      return ingredients.filter(ingredient => {
        if (!ingredient.expiryDate) {
          return false;
        }
        
        // Compare the timestamp values for accurate date comparison
        return (
          ingredient.expiryDate.getTime() >= today.getTime() && 
          ingredient.expiryDate.getTime() <= futureDate.getTime()
        );
      });
    } catch (error) {
      console.error('Error getting expiring ingredients:', error);
      return [];
    }
  }
  
  /**
   * Add a new ingredient
   * @param ingredientData Ingredient data without ID and timestamps
   * @returns The added ingredient with ID and timestamps
   */
  async add(ingredientData: IngredientCreateDto): Promise<Ingredient> {
    try {
      const now = new Date();
      const newIngredient: Ingredient = {
        ...ingredientData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      
      const ingredients = await this.getAll();
      ingredients.push(newIngredient);
      await this.saveAll(ingredients);
      
      return newIngredient;
    } catch (error) {
      console.error('Error adding ingredient:', error);
      throw error;
    }
  }
  
  /**
   * Add multiple ingredients
   * @param ingredientsData List of ingredient data without IDs and timestamps
   * @returns The added ingredients with IDs and timestamps
   */
  async addMany(ingredientsData: IngredientCreateDto[]): Promise<Ingredient[]> {
    try {
      const now = new Date();
      const newIngredients: Ingredient[] = ingredientsData.map(data => ({
        ...data,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      }));
      
      const ingredients = await this.getAll();
      ingredients.push(...newIngredients);
      await this.saveAll(ingredients);
      
      return newIngredients;
    } catch (error) {
      console.error('Error adding multiple ingredients:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing ingredient
   * @param id ID of the ingredient to update
   * @param updates Updated ingredient data
   * @returns True if successfully updated, false otherwise
   */
  async update(id: string, updates: IngredientUpdateDto): Promise<boolean> {
    try {
      const ingredients = await this.getAll();
      const index = ingredients.findIndex(ingredient => ingredient.id === id);
      
      if (index === -1) {
        return false;
      }
      
      ingredients[index] = {
        ...ingredients[index],
        ...updates,
        updatedAt: new Date(),
      };
      
      await this.saveAll(ingredients);
      return true;
    } catch (error) {
      console.error('Error updating ingredient:', error);
      return false;
    }
  }
  
  /**
   * Update the quantity of an ingredient
   * @param id ID of the ingredient to update
   * @param quantity New quantity
   * @returns True if successfully updated, false otherwise
   */
  async updateQuantity(id: string, quantity: number): Promise<boolean> {
    return this.update(id, { quantity });
  }
  
  /**
   * Get all unique categories from ingredients
   * @returns List of unique category strings
   */
  async getCategories(): Promise<string[]> {
    try {
      const ingredients = await this.getAll();
      const categories = new Set<string>();
      
      ingredients.forEach(ingredient => {
        if (ingredient.category) {
          categories.add(ingredient.category.toString());
        }
      });
      
      return Array.from(categories);
    } catch (error) {
      console.error('Error getting ingredient categories:', error);
      return [];
    }
  }
}

/**
 * Factory function to create a new ingredient repository
 * @returns A new instance of IIngredientRepository
 */
export function createIngredientRepository(): IIngredientRepository {
  return new IngredientRepository();
}
