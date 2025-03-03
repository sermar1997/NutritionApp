import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import { Ingredient } from '../../context/InventoryContext';

// Types
export interface IngredientItemProps {
  ingredient: Ingredient;
  onUpdate: (id: string, newQuantity: number) => void;
  onDelete: (id: string) => void;
}

// Styled Components
const IngredientContainer = styled(Card)`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const IngredientImage = styled.div<{ imageUrl?: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-image: ${({ imageUrl }) => (imageUrl ? `url(${imageUrl})` : 'none')};
  background-color: ${({ imageUrl, theme }) => (imageUrl ? 'transparent' : theme.colors.primaryLight)};
  background-size: cover;
  background-position: center;
  margin-right: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const IngredientIcon = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
`;

const IngredientInfo = styled.div`
  flex: 1;
`;

const IngredientName = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const IngredientDetails = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ExpiryWarning = styled.span<{ isExpiring: boolean; isExpired: boolean }>`
  color: ${({ isExpiring, isExpired, theme }) => {
    if (isExpired) return theme.colors.error;
    if (isExpiring) return theme.colors.warning;
    return theme.colors.textSecondary;
  }};
  font-weight: ${({ isExpiring, isExpired, theme }) => {
    if (isExpired || isExpiring) return theme.typography.fontWeight.medium;
    return theme.typography.fontWeight.regular;
  }};
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing.md};
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  width: 40px;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: ${({ theme }) => theme.spacing.md};
`;

const CategoryTag = styled.span`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 0 ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

/**
 * Ingredient item component for inventory
 */
const IngredientItem: React.FC<IngredientItemProps> = ({
  ingredient,
  onUpdate,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { id, name, quantity, unit, expiryDate, image, category } = ingredient;
  
  // Calculate days until expiry
  const today = new Date();
  let daysUntilExpiry: number | undefined;
  let isExpiring = false;
  let isExpired = false;
  
  if (expiryDate) {
    const timeDiff = expiryDate.getTime() - today.getTime();
    daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
    isExpiring = daysUntilExpiry > 0 && daysUntilExpiry <= 3;
    isExpired = daysUntilExpiry <= 0;
  }
  
  // Handle quantity change
  const handleIncrement = () => {
    onUpdate(id, quantity + 1);
  };
  
  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdate(id, quantity - 1);
    }
  };
  
  // Handle delete
  const handleDelete = () => {
    onDelete(id);
  };
  
  return (
    <IngredientContainer elevation="low" padding="medium" borderRadius="medium">
      <IngredientImage imageUrl={image}>
        {!image && <IngredientIcon>🥗</IngredientIcon>}
      </IngredientImage>
      
      <IngredientInfo>
        <IngredientName>{name}</IngredientName>
        <IngredientDetails>
          <CategoryTag>{category}</CategoryTag>
          <span>{quantity} {unit}</span>
          
          {expiryDate && (
            <ExpiryWarning isExpiring={isExpiring} isExpired={isExpired}>
              {isExpired 
                ? t('inventory.expired')
                : daysUntilExpiry === 1
                  ? t('inventory.expiresTomorrow')
                  : t('inventory.expiresInDays', { days: daysUntilExpiry })
              }
            </ExpiryWarning>
          )}
        </IngredientDetails>
      </IngredientInfo>
      
      <QuantityControls>
        <QuantityButton onClick={handleDecrement} disabled={quantity <= 0}>-</QuantityButton>
        <QuantityDisplay>{quantity}</QuantityDisplay>
        <QuantityButton onClick={handleIncrement}>+</QuantityButton>
      </QuantityControls>
      
      <ActionButtons>
        <Button 
          variant="danger" 
          size="small"
          onClick={handleDelete}
        >
          {t('common.remove')}
        </Button>
      </ActionButtons>
    </IngredientContainer>
  );
};

export default IngredientItem;
