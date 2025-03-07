import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import Inventory from './Inventory';
import { useInventory } from '../context/InventoryContext';

// Mock the useInventory hook
vi.mock('../context/InventoryContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useInventory: vi.fn(),
  };
});

// Mock the Modal component to avoid createPortal issues
vi.mock('../components/common/Modal', () => ({
  default: ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="modal" aria-label={title}>
        <button onClick={onClose}>Close</button>
        <div>{title}</div>
        <div>{children}</div>
      </div>
    );
  },
}));

describe('Inventory Page', () => {
  const mockIngredients = [
    {
      id: '1',
      name: 'Tomato',
      quantity: 5,
      unit: 'pieces',
      category: 'Vegetables',
      addedDate: new Date('2023-01-01'),
      lastModified: new Date('2023-01-01'),
      expiryDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    },
    {
      id: '2',
      name: 'Chicken',
      quantity: 500,
      unit: 'grams',
      category: 'Protein',
      addedDate: new Date('2023-01-02'),
      lastModified: new Date('2023-01-02'),
      expiryDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
    },
    {
      id: '3',
      name: 'Rice',
      quantity: 1,
      unit: 'kg',
      category: 'Grains',
      addedDate: new Date('2023-01-03'),
      lastModified: new Date('2023-01-03'),
    },
  ];

  const mockCategories = ['Vegetables', 'Protein', 'Grains'];
  const mockDeleteIngredient = vi.fn();
  const mockUpdateQuantity = vi.fn();
  const mockAddIngredients = vi.fn();
  const mockGetExpiringIngredients = vi.fn().mockImplementation((days) => {
    return mockIngredients.filter(i => 
      i.expiryDate && 
      Math.ceil((i.expiryDate.getTime() - Date.now()) / (1000 * 3600 * 24)) <= days
    );
  });

  beforeEach(() => {
    // Reset mock functions
    vi.resetAllMocks();
    
    // Set up the mock implementation of useInventory
    vi.mocked(useInventory).mockReturnValue({
      ingredients: mockIngredients,
      categories: mockCategories,
      deleteIngredient: mockDeleteIngredient,
      updateQuantity: mockUpdateQuantity,
      addIngredients: mockAddIngredients,
      getExpiringIngredients: mockGetExpiringIngredients,
      isLoading: false,
      addIngredient: vi.fn(),
      updateIngredient: vi.fn(),
      getIngredientsByCategory: vi.fn(),
    });
  });

  it('renders the inventory page with ingredients', () => {
    render(<Inventory />);
    
    // Check if the main elements are rendered
    expect(screen.getByText(/inventory/i)).toBeInTheDocument();
    
    // Check if ingredients are rendered
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Chicken')).toBeInTheDocument();
    expect(screen.getByText('Rice')).toBeInTheDocument();
  });

  it('filters ingredients based on search term', async () => {
    render(<Inventory />);
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText(/search/i);
    
    // Type 'tom' in the search box
    fireEvent.change(searchInput, { target: { value: 'tom' } });
    
    // Check that only Tomato is visible
    await waitFor(() => {
      expect(screen.getByText('Tomato')).toBeInTheDocument();
      expect(screen.queryByText('Chicken')).not.toBeInTheDocument();
      expect(screen.queryByText('Rice')).not.toBeInTheDocument();
    });
  });

  it('filters ingredients based on category selection', async () => {
    render(<Inventory />);
    
    // Find and click the Vegetables category filter
    const categoryCheckboxes = screen.getAllByRole('checkbox');
    const vegetablesCheckbox = categoryCheckboxes.find(
      checkbox => checkbox.nextSibling?.textContent === 'Vegetables'
    );
    
    if (vegetablesCheckbox) {
      fireEvent.click(vegetablesCheckbox);
    }
    
    // Check that only Tomato is visible
    await waitFor(() => {
      expect(screen.getByText('Tomato')).toBeInTheDocument();
      expect(screen.queryByText('Chicken')).not.toBeInTheDocument();
      expect(screen.queryByText('Rice')).not.toBeInTheDocument();
    });
  });

  it('shows expiring ingredients', () => {
    render(<Inventory />);
    
    // Check if expiring ingredients section shows the correct ingredients
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Chicken')).toBeInTheDocument();
  });

  it('opens add ingredient modal when button is clicked', () => {
    render(<Inventory />);
    
    // Find and click the add ingredient button
    const addButton = screen.getByText(/add ingredient/i);
    fireEvent.click(addButton);
    
    // Check if modal is open
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('opens scan ingredient modal when button is clicked', () => {
    render(<Inventory />);
    
    // Find and click the scan ingredient button
    const scanButton = screen.getByText(/scan ingredient/i);
    fireEvent.click(scanButton);
    
    // Check if modal is open
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('calls deleteIngredient when delete button is clicked', () => {
    render(<Inventory />);
    
    // Find and click the delete button for the first ingredient
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // Check if deleteIngredient was called with the correct id
    expect(mockDeleteIngredient).toHaveBeenCalledWith('1');
  });

  it('renders loading spinner when isLoading is true', () => {
    // Override the mock to return isLoading = true
    vi.mocked(useInventory).mockReturnValue({
      ingredients: [],
      categories: [],
      deleteIngredient: mockDeleteIngredient,
      updateQuantity: mockUpdateQuantity,
      addIngredients: mockAddIngredients,
      getExpiringIngredients: mockGetExpiringIngredients,
      isLoading: true,
      addIngredient: vi.fn(),
      updateIngredient: vi.fn(),
      getIngredientsByCategory: vi.fn(),
    });
    
    render(<Inventory />);
    
    // Check if loading spinner is rendered
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
