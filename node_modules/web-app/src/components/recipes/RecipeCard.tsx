import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Card from '../common/Card';
import { isRecipeFavorite, toggleFavoriteRecipe } from '../../services/storageService';

// Types
export interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  cookTime: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Styled Components
const RecipeCardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const RecipeImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${({ imageUrl }) => imageUrl});
  background-size: cover;
  background-position: center;
`;

const RecipeContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RecipeTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RecipeStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const RecipeTime = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const MacroInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
`;

const MacroItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MacroValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MacroLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DifficultyBadge = styled.span<{ difficulty: 'easy' | 'medium' | 'hard' }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: white;
  text-transform: capitalize;
  background-color: ${({ difficulty, theme }) => {
    switch (difficulty) {
      case 'easy':
        return theme.colors.success;
      case 'medium':
        return theme.colors.info;
      case 'hard':
        return theme.colors.secondary;
      default:
        return theme.colors.info;
    }
  }};
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

const FavoriteIcon = styled.div<{ isFavorite: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 1;
  color: ${({ isFavorite, theme }) => isFavorite ? theme.colors.secondary : theme.colors.grayMedium};
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background-color: ${({ theme }) => theme.colors.white};
  }
  
  &:active {
    transform: scale(0.9);
  }
`;

/**
 * Recipe card component to display recipe previews
 */
const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  image,
  prepTime,
  cookTime,
  calories,
  protein,
  carbs,
  fat,
  difficulty,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(isRecipeFavorite(id));

  useEffect(() => {
    setIsFavorite(isRecipeFavorite(id));
  }, [id]);

  const handleCardClick = () => {
    navigate(`/recipes/${id}`);
  };

  const handleFavoriteClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    toggleFavoriteRecipe(id);
    setIsFavorite(!isFavorite);
  };

  const getDifficultyTranslation = (diff: string) => {
    switch (diff) {
      case 'easy':
        return t('recipeDetail.difficulty.easy');
      case 'medium':
        return t('recipeDetail.difficulty.medium');
      case 'hard':
        return t('recipeDetail.difficulty.hard');
      default:
        return diff;
    }
  };

  return (
    <RecipeCardContainer 
      elevation="low" 
      padding="none" 
      borderRadius="medium"
      onClick={handleCardClick}
      hoverEffect
    >
      <div style={{ position: 'relative' }}>
        <RecipeImage imageUrl={image} />
        <FavoriteIcon isFavorite={isFavorite} onClick={handleFavoriteClick}>
          {isFavorite ? '★' : '☆'}
        </FavoriteIcon>
        <DifficultyBadge difficulty={difficulty}>
          {getDifficultyTranslation(difficulty)}
        </DifficultyBadge>
      </div>
      
      <RecipeContent>
        <RecipeTitle>{title}</RecipeTitle>
        
        <RecipeStats>
          <RecipeTime>
            <span>⏱️ {prepTime + cookTime} {t('recipeDetail.minutes')}</span>
          </RecipeTime>
          <RecipeTime>
            <span>🔥 {calories} kcal</span>
          </RecipeTime>
        </RecipeStats>
        
        <MacroInfo>
          <MacroItem>
            <MacroValue>{protein}g</MacroValue>
            <MacroLabel>{t('recipeDetail.protein')}</MacroLabel>
          </MacroItem>
          <MacroItem>
            <MacroValue>{carbs}g</MacroValue>
            <MacroLabel>{t('recipeDetail.carbs')}</MacroLabel>
          </MacroItem>
          <MacroItem>
            <MacroValue>{fat}g</MacroValue>
            <MacroLabel>{t('recipeDetail.fat')}</MacroLabel>
          </MacroItem>
        </MacroInfo>
      </RecipeContent>
    </RecipeCardContainer>
  );
};

export default RecipeCard;
