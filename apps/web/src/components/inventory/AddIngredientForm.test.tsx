import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import AddIngredientForm from './AddIngredientForm';
import userEvent from '@testing-library/user-event';
import { InventoryProvider } from '../../context/InventoryContext';

// Mock the i18n translation function
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations = {
          'inventory.addIngredient': 'Add Ingredient',
          'inventory.ingredientName': 'Name',
          'inventory.quantity': 'Quantity',
          'inventory.unit': 'Unit',
          'inventory.category': 'Category',
          'inventory.expiryDate': 'Expiry Date',
          'inventory.notes': 'Notes',
          'inventory.requiredField': 'This field is required',
          'inventory.enterValidNumber': 'Please enter a valid number',
          'inventory.selectUnit': 'Please select a unit',
          'common.save': 'Save',
          'common.add': 'Add',
          'common.cancel': 'Cancel',
        };
        return translations[key] || key;
      }
    }),
  };
});

describe('AddIngredientForm Component', () => {
  it('renders the form correctly', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    
    render(<AddIngredientForm onSubmit={onSubmit} onClose={onClose} />);
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/unit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    
    render(<AddIngredientForm onSubmit={onSubmit} onClose={onClose} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('validates required fields before submission', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    
    render(<AddIngredientForm onSubmit={onSubmit} onClose={onClose} />);
    
    // Try to submit the form without filling required fields
    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);
    
    // Check if validation error is shown
    await waitFor(() => {
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(<AddIngredientForm onSubmit={onSubmit} onClose={onClose} />);
    
    // Fill in the form fields
    await user.type(screen.getByLabelText(/name/i), 'Tomato');
    
    // Use fireEvent for number input as userEvent might have issues with it
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '5' } });
    
    await user.type(screen.getByLabelText(/unit/i), 'pieces');
    
    // Select a category
    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: 'Vegetables' } });
    
    // Set expiry date (optional)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: dateString } });
    
    // Submit the form
    const addButton = screen.getByRole('button', { name: /add/i });
    await user.click(addButton);
    
    // Check if onSubmit was called with the correct data
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Tomato',
        quantity: 5,
        unit: 'pieces',
        category: 'Vegetables',
        expiryDate: expect.any(Date),
      })
    );
  });

  it('initializes with provided ingredient data when editing', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    const ingredientToEdit = {
      id: '123',
      name: 'Carrot',
      quantity: 10,
      unit: 'pieces',
      category: 'Vegetables',
      expiryDate: new Date('2023-12-31'),
      addedDate: new Date('2023-01-01'),
      lastModified: new Date('2023-01-01'),
    };
    
    render(
      <AddIngredientForm 
        onSubmit={onSubmit} 
        onClose={onClose} 
        initialData={ingredientToEdit} 
      />
    );
    
    // Check if form is pre-filled with ingredient data
    expect(screen.getByLabelText(/name/i)).toHaveValue('Carrot');
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(10);
    expect(screen.getByLabelText(/unit/i)).toHaveValue('pieces');
    expect(screen.getByLabelText(/category/i)).toHaveValue('Vegetables');
    
    // Check if the button text is changed to "Update"
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });
});
