import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { useInventory, Ingredient } from '../../context/InventoryContext';
import { useTranslation } from 'react-i18next';

// Styled Components
const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  background-color: ${({ theme }) => theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

/**
 * Props for the AddIngredientForm component
 */
interface AddIngredientFormProps {
  onSubmit: (ingredient: Omit<Ingredient, 'id' | 'addedDate' | 'lastModified'>) => void;
  onClose?: () => void;
}

/**
 * Form component for adding a new ingredient to the inventory
 */
const AddIngredientForm: React.FC<AddIngredientFormProps> = ({ onSubmit, onClose }) => {
  const { t } = useTranslation();
  const { categories } = useInventory();
  
  // Form state
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Common units for dropdown
  const commonUnits = [
    'pieces', 'grams', 'kg', 'ml', 'liters', 'tablespoons', 
    'teaspoons', 'cups', 'ounces', 'pounds', 'bags', 'boxes'
  ];
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      setError(t('inventory.requiredField'));
      return;
    }
    
    if (quantity <= 0) {
      setError(t('inventory.enterValidNumber'));
      return;
    }
    
    if (!unit.trim()) {
      setError(t('inventory.selectUnit'));
      return;
    }
    
    // Determine which category to use (existing or new)
    const finalCategory = category === 'new' ? '' : category;
    
    if (!finalCategory.trim()) {
      setError(t('inventory.requiredField'));
      return;
    }
    
    const newIngredient = {
      name: name.trim(),
      quantity,
      unit: unit.trim(),
      category: finalCategory.trim(),
      expiryDate,
      notes: notes.trim() || undefined,
    };
    
    onSubmit(newIngredient);
    
    // Reset form
    setName('');
    setQuantity(1);
    setUnit('');
    setCategory('');
    setExpiryDate(undefined);
    setNotes('');
    
    // Close the form if onClose is provided
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">{t('inventory.ingredientName')}*</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Chicken Breast"
            required
          />
        </FormGroup>
        
        <Row>
          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="quantity">{t('inventory.quantity')}*</Label>
            <Input
              id="quantity"
              type="number"
              min="0.01"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              required
            />
          </FormGroup>
          
          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="unit">{t('inventory.unit')}*</Label>
            <Select 
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            >
              {commonUnits.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
              <option value="custom">{t('inventory.customUnit')}</option>
            </Select>
            {unit === 'custom' && (
              <Input
                type="text"
                placeholder={t('inventory.enterCustomUnit')}
                value={unit === 'custom' ? '' : unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{ marginTop: '8px' }}
              />
            )}
          </FormGroup>
        </Row>
        
        <Row>
          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="category">{t('inventory.category')}*</Label>
            <Select 
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">{t('inventory.selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="new">{t('inventory.newCategory')}</option>
            </Select>
            {category === 'new' && (
              <Input
                type="text"
                placeholder={t('inventory.enterNewCategory')}
                value={category === 'new' ? '' : category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ marginTop: '8px' }}
              />
            )}
          </FormGroup>
          
          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="expiryDate">{t('inventory.expiryDate')} {t('inventory.optional')}</Label>
            <Input
              id="expiryDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={expiryDate ? expiryDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setExpiryDate(e.target.value ? new Date(e.target.value) : undefined)}
            />
          </FormGroup>
        </Row>
        
        <FormGroup>
          <Label htmlFor="notes">{t('inventory.notes')} {t('inventory.optional')}</Label>
          <TextArea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional information about this ingredient..."
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonGroup>
          {onClose && (
            <Button variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
          )}
          <Button variant="primary" type="submit">
            {t('common.add')}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default AddIngredientForm;
