import React from 'react';
import styled from 'styled-components';
import { RecipeCardProps } from '../recipes/RecipeCard';
import { useNavigate } from 'react-router-dom';

interface MealItemProps {
  recipe: RecipeCardProps;
  onRemove: () => void;
  isSnack?: boolean;
}

const MealItemContainer = styled.div<{ isSnack?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme, isSnack }) => isSnack ? theme.spacing.xs : theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const RecipeInfo = styled.div`
  flex: 1;
  overflow: hidden;
`;

const RecipeTitle = styled.h4<{ isSnack?: boolean }>`
  font-size: ${({ theme, isSnack }) => isSnack ? theme.typography.fontSize.xs : theme.typography.fontSize.sm};
  margin: 0 0 ${({ theme, isSnack }) => isSnack ? '0' : theme.spacing.xs} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NutritionInfo = styled.div<{ isSnack?: boolean }>`
  display: ${({ isSnack }) => isSnack ? 'none' : 'flex'};
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NutritionItem = styled.span`
  display: flex;
  align-items: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-left: ${({ theme }) => theme.spacing.xs};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.dangerDark};
  }
`;

/**
 * MealItem Component
 * Displays a single recipe in the meal plan
 */
const MealItem: React.FC<MealItemProps> = ({ recipe, onRemove, isSnack = false }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when removing
    onRemove();
  };
  
  return (
    <MealItemContainer 
      isSnack={isSnack} 
      onClick={handleClick}
    >
      <RecipeInfo>
        <RecipeTitle isSnack={isSnack}>{recipe.title}</RecipeTitle>
        <NutritionInfo isSnack={isSnack}>
          <NutritionItem>{recipe.calories} kcal</NutritionItem>
          <NutritionItem>{recipe.prepTime + recipe.cookTime} min</NutritionItem>
        </NutritionInfo>
      </RecipeInfo>
      <RemoveButton onClick={handleRemove}>×</RemoveButton>
    </MealItemContainer>
  );
};

export default MealItem;
