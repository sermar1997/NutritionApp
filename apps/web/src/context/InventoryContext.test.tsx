import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '../test/test-utils';
import { InventoryProvider, useInventory } from './InventoryContext';
import React, { useEffect } from 'react';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

// Set up localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test component that uses the inventory context
const TestComponent: React.FC<{
  testFunction: (api: ReturnType<typeof useInventory>) => void;
}> = ({ testFunction }) => {
  const inventoryAPI = useInventory();
  
  useEffect(() => {
    testFunction(inventoryAPI);
  }, [inventoryAPI, testFunction]);
  
  return (
    <div>
      <h1>Inventory Test Component</h1>
      <ul>
        {inventoryAPI.ingredients.map((ingredient) => (
          <li key={ingredient.id} data-testid={`ingredient-${ingredient.id}`}>
            {ingredient.name} - {ingredient.quantity} {ingredient.unit}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('InventoryContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('provides initial empty state', () => {
    const testFunction = vi.fn();
    render(
      <InventoryProvider>
        <TestComponent testFunction={testFunction} />
      </InventoryProvider>
    );
    
    // Check if the component rendered
    expect(screen.getByText('Inventory Test Component')).toBeInTheDocument();
    
    // Check if the inventory API was provided with empty initial state
    expect(testFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        ingredients: [],
        categories: [],
        isLoading: false,
      })
    );
  });

  it('can add an ingredient', () => {
    const testFunction = vi.fn((api) => {
      if (api.ingredients.length === 0) {
        act(() => {
          api.addIngredient({
            name: 'Test Ingredient',
            quantity: 1,
            unit: 'piece',
            category: 'Test Category',
            expiryDate: new Date('2023-12-31'),
            notes: 'Test note',
          });
        });
      }
    });
    
    render(
      <InventoryProvider>
        <TestComponent testFunction={testFunction} />
      </InventoryProvider>
    );
    
    // Wait for the ingredient to be added
    expect(screen.getByText(/Test Ingredient - 1 piece/)).toBeInTheDocument();
    
    // Verify that localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('can add multiple ingredients at once', () => {
    const testFunction = vi.fn((api) => {
      if (api.ingredients.length === 0) {
        act(() => {
          api.addIngredients([
            {
              name: 'Ingredient 1',
              quantity: 1,
              unit: 'piece',
              category: 'Category 1',
            },
            {
              name: 'Ingredient 2',
              quantity: 2,
              unit: 'pieces',
              category: 'Category 2',
            },
          ]);
        });
      }
    });
    
    render(
      <InventoryProvider>
        <TestComponent testFunction={testFunction} />
      </InventoryProvider>
    );
    
    // Wait for ingredients to be added
    expect(screen.getByText(/Ingredient 1 - 1 piece/)).toBeInTheDocument();
    expect(screen.getByText(/Ingredient 2 - 2 pieces/)).toBeInTheDocument();
  });

  it('can update an ingredient', () => {
    let ingredientId = '';
    
    const testFunction = vi.fn((api) => {
      if (api.ingredients.length === 0) {
        act(() => {
          ingredientId = api.addIngredient({
            name: 'Original Name',
            quantity: 1,
            unit: 'piece',
            category: 'Test Category',
          });
        });
      } else if (api.ingredients[0].name === 'Original Name') {
        act(() => {
          api.updateIngredient(ingredientId, {
            name: 'Updated Name',
            quantity: 5,
          });
        });
      }
    });
    
    render(
      <InventoryProvider>
        <TestComponent testFunction={testFunction} />
      </InventoryProvider>
    );
    
    // Wait for the ingredient to be updated
    expect(screen.getByText(/Updated Name - 5 piece/)).toBeInTheDocument();
  });

  it('can delete an ingredient', () => {
    let ingredientId = '';
    
    const testFunction = vi.fn((api) => {
      if (api.ingredients.length === 0) {
        act(() => {
          ingredientId = api.addIngredient({
            name: 'To Be Deleted',
            quantity: 1,
            unit: 'piece',
            category: 'Test Category',
          });
        });
      } else if (api.ingredients.length === 1 && api.ingredients[0].name === 'To Be Deleted') {
        act(() => {
          api.deleteIngredient(ingredientId);
        });
      }
    });
    
    render(
      <InventoryProvider>
        <TestComponent testFunction={testFunction} />
      </InventoryProvider>
    );
    
    // Wait until the ingredient is added and then deleted
    expect(screen.queryByText(/To Be Deleted/)).not.toBeInTheDocument();
  });

  it('can update quantity', () => {
    let ingredientId = '';
    
    const testFunction = vi.fn((api) => {
      if (api.ingredients.length === 0) {
        act(() => {
          ingredientId = api.addIngredient({
            name: 'Quantity Test',
            quantity: 1,
            unit: 'piece',
            category: 'Test Category',
          });
        });
      } else if (api.ingredients[0].quantity === 1) {
        act(() => {
          api.updateQuantity(ingredientId, 10);
        });
      }
    });
    
    render(
      <InventoryProvider>
        <TestComponent testFunction={testFunction} />
      </InventoryProvider>
    );
    
    // Wait for the quantity to be updated
    expect(screen.getByText(/Quantity Test - 10 piece/)).toBeInTheDocument();
  });

  it('can get expiring ingredients', () => {
    const testFunction = vi.fn((api) => {
      if (api.ingredients.length === 0) {
        // Add one expiring and one non-expiring ingredient
        act(() => {
          api.addIngredients([
            {
              name: 'Expiring Soon',
              quantity: 1,
              unit: 'piece',
              category: 'Test',
              expiryDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
            },
            {
              name: 'Not Expiring',
              quantity: 1,
              unit: 'piece',
              category: 'Test',
              expiryDate: new Date(Date.now() + 86400000 * 10), // 10 days from now
            },
          ]);
        });
      } else if (api.ingredients.length === 2) {
        // Get ingredients expiring in 3 days
        const expiringIngredients = api.getExpiringIngredients(3);
        expect(expiringIngredients.length).toBe(1);
        expect(expiringIngredients[0].name).toBe('Expiring Soon');
      }
    });
    
    render(
      <InventoryProvider>
        <TestComponent testFunction={testFunction} />
      </InventoryProvider>
    );
    
    // Verify both ingredients are rendered
    expect(screen.getByText(/Expiring Soon/)).toBeInTheDocument();
    expect(screen.getByText(/Not Expiring/)).toBeInTheDocument();
  });

  it('loads ingredients from localStorage on init', () => {
    // Pre-populate localStorage with ingredients
    const mockIngredients = [
      {
        id: 'test-id-1',
        name: 'Stored Ingredient',
        quantity: 3,
        unit: 'pieces',
        category: 'Stored',
        addedDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    ];
    
    localStorage.setItem('inventory-ingredients', JSON.stringify(mockIngredients));
    
    const testFunction = vi.fn();
    
    render(
      <InventoryProvider>
        <TestComponent testFunction={testFunction} />
      </InventoryProvider>
    );
    
    // Check if the stored ingredient is loaded
    expect(screen.getByText(/Stored Ingredient/)).toBeInTheDocument();
  });
});
