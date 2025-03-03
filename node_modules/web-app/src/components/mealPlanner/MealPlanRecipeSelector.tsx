import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { RecipeCardProps } from '../recipes/RecipeCard';
import { MealType } from '../../types/mealPlan';

interface MealPlanRecipeSelectorProps {
  selectedDay: string | null;
  selectedMealType: MealType | null;
  onRecipeSelect: (recipe: RecipeCardProps) => void;
}

const RecipeSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SelectorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const RecipesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 400px;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.xs};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.backgroundLight};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 10px;
  }
`;

const RecipeItem = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transform: translateY(-2px);
  }
`;

const RecipeImage = styled.div<{ imageUrl: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const RecipeInfo = styled.div`
  flex: 1;
  overflow: hidden;
`;

const RecipeTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RecipeDetails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NoRecipesMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SelectionInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  span {
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

/**
 * MealPlanRecipeSelector Component
 * Allows users to select recipes to add to their meal plan
 */
const MealPlanRecipeSelector: React.FC<MealPlanRecipeSelectorProps> = ({
  selectedDay,
  selectedMealType,
  onRecipeSelect,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<RecipeCardProps[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeCardProps[]>([]);
  
  // Format a date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get meal type name for display
  const getMealTypeName = (type: MealType | null): string => {
    if (!type) return '';
    
    const mealTypeMap: { [key in MealType]: string } = {
      breakfast: t('mealPlanner.breakfast'),
      lunch: t('mealPlanner.lunch'),
      dinner: t('mealPlanner.dinner'),
      snacks: t('mealPlanner.snacks'),
    };
    
    return mealTypeMap[type];
  };
  
  // Load mock recipes
  useEffect(() => {
    const mockRecipes: RecipeCardProps[] = [
      {
        id: '1',
        title: t('recipe.grilledChickenSalad'),
        image: 'https://source.unsplash.com/random/300x200/?salad',
        prepTime: 15,
        cookTime: 20,
        calories: 320,
        protein: 28,
        carbs: 10,
        fat: 18,
        difficulty: 'easy',
      },
      {
        id: '2',
        title: t('recipe.vegetableStirFry'),
        image: 'https://source.unsplash.com/random/300x200/?stirfry',
        prepTime: 10,
        cookTime: 15,
        calories: 250,
        protein: 8,
        carbs: 30,
        fat: 12,
        difficulty: 'easy',
      },
      {
        id: '3',
        title: t('recipe.salmonRoastedVegetables'),
        image: 'https://source.unsplash.com/random/300x200/?salmon',
        prepTime: 20,
        cookTime: 25,
        calories: 420,
        protein: 35,
        carbs: 15,
        fat: 22,
        difficulty: 'medium',
      },
      {
        id: '4',
        title: t('recipe.mushroomRisotto'),
        image: 'https://source.unsplash.com/random/300x200/?risotto',
        prepTime: 10,
        cookTime: 30,
        calories: 380,
        protein: 10,
        carbs: 62,
        fat: 8,
        difficulty: 'medium',
      },
      {
        id: '5',
        title: t('recipe.beefWellington'),
        image: 'https://source.unsplash.com/random/300x200/?beef',
        prepTime: 45,
        cookTime: 90,
        calories: 650,
        protein: 40,
        carbs: 45,
        fat: 35,
        difficulty: 'hard',
      },
      {
        id: '6',
        title: t('recipe.quinoaBuddhaBowl'),
        image: 'https://source.unsplash.com/random/300x200/?quinoa',
        prepTime: 20,
        cookTime: 15,
        calories: 420,
        protein: 12,
        carbs: 70,
        fat: 10,
        difficulty: 'easy',
      },
    ];
    
    setRecipes(mockRecipes);
    setFilteredRecipes(mockRecipes);
  }, [t]);
  
  // Filter recipes based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes);
      return;
    }
    
    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredRecipes(filtered);
  }, [searchQuery, recipes]);
  
  // Handle recipe selection
  const handleRecipeSelect = (recipe: RecipeCardProps) => {
    onRecipeSelect(recipe);
  };
  
  return (
    <RecipeSelectorContainer>
      <SelectorHeader>
        <Title>{t('mealPlanner.addRecipe')}</Title>
      </SelectorHeader>
      
      {selectedDay && selectedMealType ? (
        <SelectionInfo>
          {t('mealPlanner.addingTo')} <span>{getMealTypeName(selectedMealType)}</span> {t('mealPlanner.onDate')} <span>{formatDate(selectedDay)}</span>
        </SelectionInfo>
      ) : (
        <SelectionInfo>
          {t('mealPlanner.selectDayAndMeal')}
        </SelectionInfo>
      )}
      
      <SearchInput
        type="text"
        placeholder={t('mealPlanner.searchRecipes')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <RecipesList>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <RecipeItem
              key={recipe.id}
              onClick={() => handleRecipeSelect(recipe)}
            >
              <RecipeImage imageUrl={recipe.image} />
              <RecipeInfo>
                <RecipeTitle>{recipe.title}</RecipeTitle>
                <RecipeDetails>
                  <span>{recipe.calories} kcal</span>
                  <span>{recipe.prepTime + recipe.cookTime} min</span>
                </RecipeDetails>
              </RecipeInfo>
            </RecipeItem>
          ))
        ) : (
          <NoRecipesMessage>
            {t('mealPlanner.noRecipesFound')}
          </NoRecipesMessage>
        )}
      </RecipesList>
    </RecipeSelectorContainer>
  );
};

export default MealPlanRecipeSelector;
