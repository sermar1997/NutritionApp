import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import IngredientItem from '../components/inventory/IngredientItem';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import AddIngredientForm from '../components/inventory/AddIngredientForm';
import ImageCapture from '../components/inventory/ImageCapture';
import { Ingredient, useInventory } from '../context/InventoryContext';

// Styled Components
const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InventoryControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  flex: 1;
  max-width: 300px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const InventoryContent = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const InventoryList = styled.div`
  flex: 3;
`;

const SidePanel = styled.div`
  flex: 1;
`;

const CategoryFilter = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CategoryFilterTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CategoryFilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CategoryFilterItem = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CategoryFilterCheckbox = styled.input`
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyStateDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

/**
 * Inventory page component
 */
const Inventory: React.FC = () => {
  const { t } = useTranslation();
  const { 
    ingredients, 
    categories, 
    deleteIngredient, 
    updateQuantity,
    addIngredients, 
    getExpiringIngredients,
    isLoading
  } = useInventory();
  
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [expiringIngredients, setExpiringIngredients] = useState<Ingredient[]>([]);
  
  // Filter ingredients based on search term and selected categories
  useEffect(() => {
    let filtered = ingredients;
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(ingredient => 
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(ingredient => 
        selectedCategories.includes(ingredient.category)
      );
    }
    
    setFilteredIngredients(filtered);
  }, [searchTerm, selectedCategories, ingredients]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  // Add new ingredient (open modal)
  const handleAddIngredient = () => {
    setIsAddModalOpen(true);
  };
  
  // Scan ingredient (open modal)
  const handleScanIngredient = () => {
    setIsScanModalOpen(true);
  };

  // Handle detected ingredients from image capture
  const handleIngredientsDetected = (detectedIngredients: any[]) => {
    // Convert detected ingredients to inventory ingredients
    const newIngredients = detectedIngredients.map(detected => ({
      name: detected.name,
      quantity: 1,
      unit: 'pieces',
      category: detected.category || 'Other',
      nutritionalInfo: detected.nutritionPer100g
    }));
    
    // Add ingredients
    addIngredients(newIngredients);
    setIsScanModalOpen(false);
  };
  
  // Get ingredients expiring in the next 5 days
  useEffect(() => {
    setExpiringIngredients(getExpiringIngredients(5));
  }, [getExpiringIngredients, ingredients]);
  
  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>{t('inventory.title')}</Title>
        <Description>
          {t('inventory.description')}
        </Description>
      </PageHeader>
      
      <InventoryControls>
        <SearchInput
          type="text"
          placeholder={t('inventory.searchPlaceholder')}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <ButtonGroup>
          <Button 
            variant="primary" 
            onClick={handleAddIngredient}
            rightIcon="+"
          >
            {t('inventory.addIngredient')}
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleScanIngredient}
            rightIcon="📷"
          >
            {t('inventory.scanIngredient')}
          </Button>
        </ButtonGroup>
      </InventoryControls>
      
      <InventoryContent>
        <InventoryList>
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map(ingredient => (
              <IngredientItem 
                key={ingredient.id} 
                ingredient={ingredient}
                onUpdate={updateQuantity}
                onDelete={deleteIngredient}
              />
            ))
          ) : (
            <EmptyState>
              <EmptyStateIcon>🥕</EmptyStateIcon>
              <EmptyStateTitle>{t('inventory.noIngredientsTitle')}</EmptyStateTitle>
              <EmptyStateDescription>
                {t('inventory.noIngredientsDescription')}
              </EmptyStateDescription>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategories([]);
              }}>
                {t('inventory.clearFilters')}
              </Button>
            </EmptyState>
          )}
        </InventoryList>
        
        <SidePanel>
          <CategoryFilter elevation="low" padding="medium" borderRadius="medium">
            <CategoryFilterTitle>{t('inventory.filterByCategory')}</CategoryFilterTitle>
            <CategoryFilterList>
              {categories.map(category => (
                <CategoryFilterItem key={category}>
                  <CategoryFilterCheckbox 
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </CategoryFilterItem>
              ))}
            </CategoryFilterList>
          </CategoryFilter>
          
          <Card elevation="low" padding="medium" borderRadius="medium">
            <CategoryFilterTitle>{t('inventory.expiringSoon')}</CategoryFilterTitle>
            {expiringIngredients.length > 0 ? (
              expiringIngredients.map(ingredient => {
                const daysUntilExpiry = Math.ceil(
                  (ingredient.expiryDate!.getTime() - Date.now()) / (1000 * 3600 * 24)
                );
                
                return (
                  <div key={ingredient.id} style={{ marginBottom: '8px' }}>
                    <strong>{ingredient.name}</strong>: 
                    {daysUntilExpiry === 1
                      ? t('inventory.expiresTomorrow')
                      : t('inventory.expiresInDays', { days: daysUntilExpiry })}
                  </div>
                );
              })
            ) : (
              <div>{t('inventory.noExpiringItems')}</div>
            )}
          </Card>
        </SidePanel>
      </InventoryContent>
      
      {/* Add Ingredient Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title={t('inventory.addNewIngredient')}
      >
        <AddIngredientForm 
          onSubmit={(ingredient) => {
            addIngredients([ingredient]);
            setIsAddModalOpen(false);
          }}
        />
      </Modal>
      
      {/* Scan Ingredient Modal */}
      <Modal 
        isOpen={isScanModalOpen} 
        onClose={() => setIsScanModalOpen(false)}
        title={t('inventory.scanIngredient')}
        size="large"
      >
        <ImageCapture 
          onIngredientsDetected={handleIngredientsDetected}
        />
      </Modal>
    </PageContainer>
  );
};

export default Inventory;
