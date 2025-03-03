import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: Date;
  image?: string;
  category: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  notes?: string;
  addedDate: Date;
  lastModified: Date;
}

type InventoryContextType = {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Omit<Ingredient, 'id' | 'addedDate' | 'lastModified'>) => string;
  addIngredients: (ingredients: Omit<Ingredient, 'id' | 'addedDate' | 'lastModified'>[]) => string[];
  updateIngredient: (id: string, updates: Partial<Omit<Ingredient, 'id' | 'addedDate' | 'lastModified'>>) => void;
  deleteIngredient: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  getExpiringIngredients: (days: number) => Ingredient[];
  getIngredientsByCategory: (category: string) => Ingredient[];
  categories: string[];
  isLoading: boolean;
};

/**
 * Serializes a Date object to ISO string for storage
 */
const serializeDate = (date?: Date): string | undefined => {
  return date ? date.toISOString() : undefined;
};

/**
 * Deserializes an ISO string to a Date object
 */
const deserializeDate = (dateString?: string): Date | undefined => {
  return dateString ? new Date(dateString) : undefined;
};

/**
 * Serializes ingredient data for storage
 */
const serializeIngredient = (ingredient: Ingredient): any => {
  return {
    ...ingredient,
    expiryDate: serializeDate(ingredient.expiryDate),
    addedDate: serializeDate(ingredient.addedDate),
    lastModified: serializeDate(ingredient.lastModified),
  };
};

/**
 * Deserializes ingredient data from storage
 */
const deserializeIngredient = (data: any): Ingredient => {
  return {
    ...data,
    expiryDate: deserializeDate(data.expiryDate),
    addedDate: deserializeDate(data.addedDate) || new Date(),
    lastModified: deserializeDate(data.lastModified) || new Date(),
  };
};

// Create context
const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

/**
 * Provider component for inventory context
 */
export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load ingredients from localStorage on component mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be replaced with API calls
        // and integration with a backend storage
        const savedIngredients = localStorage.getItem('ingredients');
        
        if (savedIngredients) {
          const parsedIngredients = JSON.parse(savedIngredients);
          const deserializedIngredients = parsedIngredients.map(deserializeIngredient);
          setIngredients(deserializedIngredients);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(deserializedIngredients.map((item: Ingredient) => item.category))
          );
          setCategories(uniqueCategories as string[]);
        } else {
          // If no saved data, initialize with empty arrays
          setIngredients([]);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error loading inventory:', error);
        // Initialize with empty data in case of error
        setIngredients([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadIngredients();
  }, []);

  // Save ingredients to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      const serializedIngredients = ingredients.map(serializeIngredient);
      localStorage.setItem('ingredients', JSON.stringify(serializedIngredients));
    }
  }, [ingredients, isLoading]);

  /**
   * Adds a single ingredient to the inventory
   */
  const addIngredient = (ingredient: Omit<Ingredient, 'id' | 'addedDate' | 'lastModified'>): string => {
    const newId = uuidv4();
    const now = new Date();
    
    const newIngredient: Ingredient = {
      id: newId,
      ...ingredient,
      addedDate: now,
      lastModified: now,
    };
    
    setIngredients(prev => [...prev, newIngredient]);
    
    // If this is a new category, add it to categories
    if (ingredient.category && !categories.includes(ingredient.category)) {
      setCategories(prev => [...prev, ingredient.category]);
    }
    
    return newId;
  };

  /**
   * Adds multiple ingredients to the inventory
   */
  const addIngredients = (ingredients: Omit<Ingredient, 'id' | 'addedDate' | 'lastModified'>[]): string[] => {
    const newIds: string[] = [];
    const now = new Date();
    const newIngredients: Ingredient[] = [];
    const newCategories: string[] = [];
    
    ingredients.forEach(ingredient => {
      const newId = uuidv4();
      newIds.push(newId);
      
      const newIngredient: Ingredient = {
        id: newId,
        ...ingredient,
        addedDate: now,
        lastModified: now,
      };
      
      newIngredients.push(newIngredient);
      
      // Track new categories
      if (ingredient.category && !categories.includes(ingredient.category) && !newCategories.includes(ingredient.category)) {
        newCategories.push(ingredient.category);
      }
    });
    
    // Update ingredients
    setIngredients(prev => [...prev, ...newIngredients]);
    
    // Update categories if needed
    if (newCategories.length > 0) {
      setCategories(prev => [...prev, ...newCategories]);
    }
    
    return newIds;
  };

  /**
   * Updates an existing ingredient
   */
  const updateIngredient = (id: string, updates: Partial<Omit<Ingredient, 'id' | 'addedDate' | 'lastModified'>>) => {
    setIngredients(prev => 
      prev.map(ingredient => {
        if (ingredient.id === id) {
          const updatedIngredient = {
            ...ingredient,
            ...updates,
            lastModified: new Date(),
          };
          
          // If category changed, we may need to update the categories array
          if (updates.category && !categories.includes(updates.category)) {
            setCategories(prev => [...prev, updates.category!]);
          }
          
          return updatedIngredient;
        }
        return ingredient;
      })
    );
  };

  /**
   * Deletes an ingredient from the inventory
   */
  const deleteIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ingredient => ingredient.id !== id));
    
    // After removing an ingredient, update categories if needed
    setTimeout(() => {
      const remainingCategories = Array.from(
        new Set(ingredients.map(item => item.category))
      );
      setCategories(remainingCategories as string[]);
    }, 0);
  };

  /**
   * Updates just the quantity of an ingredient
   */
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setIngredients(prev => 
      prev.map(ingredient => {
        if (ingredient.id === id) {
          return {
            ...ingredient,
            quantity: newQuantity,
            lastModified: new Date(),
          };
        }
        return ingredient;
      })
    );
  };

  /**
   * Gets ingredients expiring within the specified number of days
   */
  const getExpiringIngredients = (days: number): Ingredient[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return ingredients.filter(ingredient => {
      if (!ingredient.expiryDate) return false;
      
      const expiryDate = new Date(ingredient.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);
      
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays >= 0 && diffDays <= days;
    });
  };

  /**
   * Gets ingredients by category
   */
  const getIngredientsByCategory = (category: string): Ingredient[] => {
    return ingredients.filter(ingredient => ingredient.category === category);
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
        isLoading,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

/**
 * Hook to use the inventory context
 */
export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
