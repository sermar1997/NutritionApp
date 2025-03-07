import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  IIngredientRepository
} from '@nutrition-app/shared/src/core/domain/repositories/IIngredientRepository';
import {
  createIngredientRepository
} from '@nutrition-app/shared/src/infrastructure/repositories/IngredientRepository';
import { 
  Ingredient, 
  IngredientCreateDto,
  IngredientCategory
} from '@nutrition-app/shared/src/core/models/ingredient';

// Types
type InventoryContextType = {
  ingredients: Ingredient[];
  addIngredient: (ingredient: IngredientCreateDto) => Promise<string>;
  addIngredients: (ingredients: IngredientCreateDto[]) => Promise<string[]>;
  updateIngredient: (id: string, updates: Partial<IngredientCreateDto>) => Promise<boolean>;
  deleteIngredient: (id: string) => Promise<boolean>;
  updateQuantity: (id: string, newQuantity: number) => Promise<boolean>;
  getExpiringIngredients: (days: number) => Promise<Ingredient[]>;
  getIngredientsByCategory: (category: IngredientCategory) => Promise<Ingredient[]>;
  categories: IngredientCategory[];
  isLoading: boolean;
};

// Create context
const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

/**
 * Provider component for inventory context
 */
export const InventoryProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<IngredientCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [repository] = useState<IIngredientRepository>(() => createIngredientRepository());
  
  // Load ingredients on mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setIsLoading(true);
        const items = await repository.getAll();
        setIngredients(items);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(items.map(item => item.category))].filter(Boolean) as IngredientCategory[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading ingredients:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadIngredients();
  }, [repository]);
  
  /**
   * Add a new ingredient to the inventory
   */
  const addIngredient = async (ingredient: IngredientCreateDto): Promise<string> => {
    const newIngredient = await repository.add(ingredient);
    
    // Update local state
    setIngredients(prev => [...prev, newIngredient]);
    
    // If this is a new category, add it to categories
    if (ingredient.category && !categories.includes(ingredient.category)) {
      setCategories(prev => [...prev, ingredient.category]);
    }
    
    return newIngredient.id;
  };

  /**
   * Adds multiple ingredients to the inventory
   */
  const addIngredients = async (ingredients: IngredientCreateDto[]): Promise<string[]> => {
    const newIngredients = await repository.addMany(ingredients);
    setIngredients(prev => [...prev, ...newIngredients]);
    
    // Update categories with any new ones
    const newCategories = new Set(categories);
    ingredients.forEach(ingredient => {
      if (ingredient.category) {
        newCategories.add(ingredient.category);
      }
    });
    
    setCategories(Array.from(newCategories));
    
    return newIngredients.map(ingredient => ingredient.id);
  };

  /**
   * Updates an existing ingredient
   */
  const updateIngredient = async (id: string, updates: Partial<IngredientCreateDto>): Promise<boolean> => {
    const success = await repository.update(id, updates);
    
    if (success) {
      // Refresh ingredients list from repository to ensure consistency
      const updatedIngredients = await repository.getAll();
      setIngredients(updatedIngredients);
      
      // Update categories if needed
      if (updates.category) {
        const updatedCategories = [...new Set(updatedIngredients.map(item => item.category))].filter(Boolean) as IngredientCategory[];
        setCategories(updatedCategories);
      }
    }
    
    return success;
  };

  /**
   * Deletes an ingredient from the inventory
   */
  const deleteIngredient = async (id: string): Promise<boolean> => {
    const success = await repository.delete(id);
    
    if (success) {
      setIngredients(prev => prev.filter(ingredient => ingredient.id !== id));
      
      // Refresh categories in case one is no longer used
      const updatedIngredients = await repository.getAll();
      const updatedCategories = [...new Set(updatedIngredients.map(item => item.category))].filter(Boolean) as IngredientCategory[];
      setCategories(updatedCategories);
    }
    
    return success;
  };

  /**
   * Updates the quantity of an ingredient
   */
  const updateQuantity = async (id: string, newQuantity: number): Promise<boolean> => {
    const success = await repository.updateQuantity(id, newQuantity);
    
    if (success) {
      setIngredients(prev => 
        prev.map(ingredient => 
          ingredient.id === id 
            ? { ...ingredient, quantity: newQuantity, updatedAt: new Date() }
            : ingredient
        )
      );
    }
    
    return success;
  };

  /**
   * Gets a list of ingredients expiring within a specified number of days
   */
  const getExpiringIngredients = async (days: number): Promise<Ingredient[]> => {
    return repository.getExpiringIngredients(days);
  };

  /**
   * Gets ingredients by category
   */
  const getIngredientsByCategory = async (category: IngredientCategory): Promise<Ingredient[]> => {
    try {
      return repository.getByCategoryId(category);
    } catch (error) {
      console.error('Error getting ingredients by category:', error);
      return [];
    }
  };

  return (
    <InventoryContext.Provider 
      value={{ 
        ingredients, 
        addIngredient, 
        addIngredients, 
        updateIngredient, 
        deleteIngredient,
        updateQuantity,
        getExpiringIngredients,
        getIngredientsByCategory,
        categories,
        isLoading
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

/**
 * Hook to access inventory context
 */
export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  
  return context;
};

export default InventoryProvider;
