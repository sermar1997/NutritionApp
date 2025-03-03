import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { isRecipeFavorite, toggleFavoriteRecipe } from '../services/storageService';

// Types
interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  instructions: string[];
  tags: string[];
}

// Styled Components
const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RecipeHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RecipeTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RecipeDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.6;
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RecipeInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const InfoLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const RecipeContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const IngredientItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const IngredientName = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const IngredientAmount = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const InstructionsList = styled.ol`
  padding-left: ${({ theme }) => theme.spacing.lg};
  margin: 0;
`;

const InstructionItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

const NutritionSection = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const NutritionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const NutrientItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const NutrientValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const NutrientLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const FavoriteButton = styled(Button)<{ $isFavorite: boolean }>`
  background-color: ${({ $isFavorite, theme }) => 
    $isFavorite ? theme.colors.secondary : 'transparent'};
  color: ${({ $isFavorite, theme }) => 
    $isFavorite ? theme.colors.white : theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  
  &:hover {
    background-color: ${({ $isFavorite, theme }) => 
      $isFavorite ? theme.colors.secondaryDark : theme.colors.secondaryLight};
    color: ${({ $isFavorite, theme }) => 
      $isFavorite ? theme.colors.white : theme.colors.secondary};
  }
`;

const Toast = styled.div<{ show: boolean, type: 'success' | 'info' }>`
  position: fixed;
  bottom: ${({ show }) => show ? '20px' : '-100px'};
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ type, theme }) => 
    type === 'success' ? theme.colors.success : theme.colors.info};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 1000;
  transition: bottom 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/**
 * Recipe detail page component
 */
const RecipeDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'info' });
  
  // Helper function to get the difficulty translation
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
  
  // Check if recipe is favorite
  useEffect(() => {
    if (id) {
      setIsFavorite(isRecipeFavorite(id));
    }
  }, [id]);
  
  // Mock data fetch - in a real app, this would come from an API
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock recipe data
        const mockRecipes: Record<string, Recipe> = {
          '1': {
            id: '1',
            title: t('recipe.grilledChickenSalad'),
            description: t('recipeDetail.grilledChickenSalad.description'),
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
            prepTime: 15,
            cookTime: 20,
            servings: 2,
            calories: 350,
            protein: 30,
            carbs: 25,
            fat: 12,
            difficulty: 'easy',
            ingredients: [
              { name: t('ingredient.chickenBreast'), quantity: 2, unit: t('unit.piece') },
              { name: t('ingredient.mixedGreens'), quantity: 2, unit: t('unit.cup') },
              { name: t('ingredient.cherryTomatoes'), quantity: 1, unit: t('unit.cup') },
              { name: t('ingredient.cucumber'), quantity: 1, unit: t('unit.medium') },
              { name: t('ingredient.redOnion'), quantity: 0.5, unit: t('unit.medium') },
              { name: t('ingredient.oliveOil'), quantity: 2, unit: t('unit.tablespoon') },
              { name: t('ingredient.lemonJuice'), quantity: 1, unit: t('unit.tablespoon') },
              { name: t('ingredient.salt'), quantity: 0.5, unit: t('unit.teaspoon') },
              { name: t('ingredient.blackPepper'), quantity: 0.25, unit: t('unit.teaspoon') },
            ],
            instructions: [
              t('recipeDetail.grilledChickenSalad.step1'),
              t('recipeDetail.grilledChickenSalad.step2'),
              t('recipeDetail.grilledChickenSalad.step3'),
              t('recipeDetail.grilledChickenSalad.step4'),
              t('recipeDetail.grilledChickenSalad.step5'),
              t('recipeDetail.grilledChickenSalad.step6'),
              t('recipeDetail.grilledChickenSalad.step7'),
            ],
            tags: ['chicken', 'salad', 'healthy', 'low-carb', 'high-protein'],
          },
          '2': {
            id: '2',
            title: t('recipe.vegetableStirFry'),
            description: t('recipeDetail.vegetableStirFry.description'),
            image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
            prepTime: 10,
            cookTime: 15,
            servings: 4,
            calories: 280,
            protein: 10,
            carbs: 35,
            fat: 10,
            difficulty: 'easy',
            ingredients: [
              { name: t('ingredient.broccoli'), quantity: 2, unit: t('unit.cup') },
              { name: t('ingredient.bellPepper'), quantity: 1, unit: t('unit.large') },
              { name: t('ingredient.carrot'), quantity: 2, unit: t('unit.medium') },
              { name: t('ingredient.snowPeas'), quantity: 1, unit: t('unit.cup') },
              { name: t('ingredient.tofu'), quantity: 200, unit: t('unit.gram') },
              { name: t('ingredient.soySauce'), quantity: 3, unit: t('unit.tablespoon') },
              { name: t('ingredient.garlic'), quantity: 2, unit: t('unit.clove') },
              { name: t('ingredient.ginger'), quantity: 1, unit: t('unit.tablespoon') },
              { name: t('ingredient.sesameSeed'), quantity: 1, unit: t('unit.teaspoon') },
            ],
            instructions: [
              t('recipeDetail.vegetableStirFry.step1'),
              t('recipeDetail.vegetableStirFry.step2'),
              t('recipeDetail.vegetableStirFry.step3'),
              t('recipeDetail.vegetableStirFry.step4'),
              t('recipeDetail.vegetableStirFry.step5'),
            ],
            tags: ['vegetarian', 'vegan', 'stir-fry', 'quick'],
          },
          '3': {
            id: '3',
            title: t('recipe.overnightOats'),
            description: t('recipeDetail.overnightOats.description'),
            image: 'https://images.unsplash.com/photo-1504387828636-abeb50778c0c',
            prepTime: 5,
            cookTime: 0,
            servings: 1,
            calories: 320,
            protein: 15,
            carbs: 45,
            fat: 8,
            difficulty: 'easy',
            ingredients: [
              { name: t('ingredient.oats'), quantity: 0.5, unit: t('unit.cup') },
              { name: t('ingredient.milk'), quantity: 0.5, unit: t('unit.cup') },
              { name: t('ingredient.yogurt'), quantity: 0.25, unit: t('unit.cup') },
              { name: t('ingredient.honey'), quantity: 1, unit: t('unit.tablespoon') },
              { name: t('ingredient.chia'), quantity: 1, unit: t('unit.tablespoon') },
              { name: t('ingredient.berries'), quantity: 0.25, unit: t('unit.cup') },
            ],
            instructions: [
              t('recipeDetail.overnightOats.step1'),
              t('recipeDetail.overnightOats.step2'),
              t('recipeDetail.overnightOats.step3'),
            ],
            tags: ['breakfast', 'meal-prep', 'no-cook', 'healthy'],
          },
          '4': {
            id: '4',
            title: t('recipe.quinoaBuddhaBowl'),
            description: t('recipeDetail.quinoaBuddhaBowl.description'),
            image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733',
            prepTime: 15,
            cookTime: 20,
            servings: 2,
            calories: 420,
            protein: 18,
            carbs: 60,
            fat: 15,
            difficulty: 'medium',
            ingredients: [
              { name: t('ingredient.quinoa'), quantity: 1, unit: t('unit.cup') },
              { name: t('ingredient.sweetPotato'), quantity: 1, unit: t('unit.medium') },
              { name: t('ingredient.kale'), quantity: 2, unit: t('unit.cup') },
              { name: t('ingredient.avocado'), quantity: 1, unit: t('unit.medium') },
              { name: t('ingredient.chickpeas'), quantity: 1, unit: t('unit.can') },
              { name: t('ingredient.lemon'), quantity: 1, unit: t('unit.medium') },
              { name: t('ingredient.tahini'), quantity: 2, unit: t('unit.tablespoon') },
            ],
            instructions: [
              t('recipeDetail.quinoaBuddhaBowl.step1'),
              t('recipeDetail.quinoaBuddhaBowl.step2'),
              t('recipeDetail.quinoaBuddhaBowl.step3'),
              t('recipeDetail.quinoaBuddhaBowl.step4'),
            ],
            tags: ['vegetarian', 'bowl', 'healthy', 'meal-prep'],
          },
          '5': {
            id: '5',
            title: t('recipe.smoothieBowl'),
            description: t('recipeDetail.smoothieBowl.description'),
            image: 'https://images.unsplash.com/photo-1494932116522-d4e24b67800a',
            prepTime: 10,
            cookTime: 0,
            servings: 1,
            calories: 250,
            protein: 12,
            carbs: 40,
            fat: 6,
            difficulty: 'easy',
            ingredients: [
              { name: t('ingredient.banana'), quantity: 1, unit: t('unit.medium') },
              { name: t('ingredient.berries'), quantity: 1, unit: t('unit.cup') },
              { name: t('ingredient.spinach'), quantity: 1, unit: t('unit.cup') },
              { name: t('ingredient.milk'), quantity: 0.5, unit: t('unit.cup') },
              { name: t('ingredient.proteinPowder'), quantity: 1, unit: t('unit.scoop') },
              { name: t('ingredient.granola'), quantity: 0.25, unit: t('unit.cup') },
            ],
            instructions: [
              t('recipeDetail.smoothieBowl.step1'),
              t('recipeDetail.smoothieBowl.step2'),
              t('recipeDetail.smoothieBowl.step3'),
            ],
            tags: ['breakfast', 'smoothie', 'quick', 'healthy'],
          },
          '6': {
            id: '6',
            title: t('recipe.salmonWithVegetables'),
            description: t('recipeDetail.salmonWithVegetables.description'),
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
            prepTime: 10,
            cookTime: 25,
            servings: 2,
            calories: 450,
            protein: 35,
            carbs: 20,
            fat: 25,
            difficulty: 'medium',
            ingredients: [
              { name: t('ingredient.salmonFillet'), quantity: 2, unit: t('unit.piece') },
              { name: t('ingredient.asparagus'), quantity: 1, unit: t('unit.bunch') },
              { name: t('ingredient.zucchini'), quantity: 1, unit: t('unit.medium') },
              { name: t('ingredient.lemon'), quantity: 1, unit: t('unit.medium') },
              { name: t('ingredient.dill'), quantity: 2, unit: t('unit.tablespoon') },
              { name: t('ingredient.oliveOil'), quantity: 2, unit: t('unit.tablespoon') },
            ],
            instructions: [
              t('recipeDetail.salmonWithVegetables.step1'),
              t('recipeDetail.salmonWithVegetables.step2'),
              t('recipeDetail.salmonWithVegetables.step3'),
              t('recipeDetail.salmonWithVegetables.step4'),
            ],
            tags: ['seafood', 'dinner', 'high-protein', 'low-carb'],
          },
          '7': {
            id: '7',
            title: t('recipe.beefStirFry'),
            description: t('recipeDetail.beefStirFry.description'),
            image: 'https://images.unsplash.com/photo-1541173114274-e5450ae0031a',
            prepTime: 15,
            cookTime: 15,
            servings: 3,
            calories: 410,
            protein: 30,
            carbs: 30,
            fat: 20,
            difficulty: 'medium',
            ingredients: [
              { name: t('ingredient.beefStrips'), quantity: 500, unit: t('unit.gram') },
              { name: t('ingredient.bellPepper'), quantity: 1, unit: t('unit.large') },
              { name: t('ingredient.broccoli'), quantity: 1, unit: t('unit.cup') },
              { name: t('ingredient.carrot'), quantity: 2, unit: t('unit.medium') },
              { name: t('ingredient.garlic'), quantity: 3, unit: t('unit.clove') },
              { name: t('ingredient.ginger'), quantity: 1, unit: t('unit.tablespoon') },
              { name: t('ingredient.soySauce'), quantity: 3, unit: t('unit.tablespoon') },
              { name: t('ingredient.sesameOil'), quantity: 1, unit: t('unit.tablespoon') },
              { name: t('ingredient.brownSugar'), quantity: 1, unit: t('unit.tablespoon') },
            ],
            instructions: [
              t('recipeDetail.beefStirFry.step1'),
              t('recipeDetail.beefStirFry.step2'),
              t('recipeDetail.beefStirFry.step3'),
              t('recipeDetail.beefStirFry.step4'),
              t('recipeDetail.beefStirFry.step5'),
            ],
            tags: ['beef', 'dinner', 'quick', 'high-protein'],
          },
          '8': {
            id: '8',
            title: t('recipe.mediterraneanWrap'),
            description: t('recipeDetail.mediterraneanWrap.description'),
            image: 'https://images.unsplash.com/photo-1600367161489-c93166991de3',
            prepTime: 15,
            cookTime: 10,
            servings: 1,
            calories: 380,
            protein: 15,
            carbs: 45,
            fat: 18,
            difficulty: 'easy',
            ingredients: [
              { name: t('ingredient.tortilla'), quantity: 1, unit: t('unit.piece') },
              { name: t('ingredient.hummus'), quantity: 3, unit: t('unit.tablespoon') },
              { name: t('ingredient.fetaCheese'), quantity: 30, unit: t('unit.gram') },
              { name: t('ingredient.kalamataOlives'), quantity: 6, unit: t('unit.piece') },
              { name: t('ingredient.redPepper'), quantity: 0.5, unit: t('unit.medium') },
              { name: t('ingredient.cucumber'), quantity: 0.5, unit: t('unit.medium') },
              { name: t('ingredient.oliveOil'), quantity: 1, unit: t('unit.teaspoon') },
              { name: t('ingredient.oregano'), quantity: 0.5, unit: t('unit.teaspoon') },
            ],
            instructions: [
              t('recipeDetail.mediterraneanWrap.step1'),
              t('recipeDetail.mediterraneanWrap.step2'),
              t('recipeDetail.mediterraneanWrap.step3'),
              t('recipeDetail.mediterraneanWrap.step4'),
              t('recipeDetail.mediterraneanWrap.step5'),
            ],
            tags: ['vegetarian', 'lunch', 'quick', 'mediterranean'],
          }
        };
        
        if (id && mockRecipes[id]) {
          setRecipe(mockRecipes[id]);
        } else {
          setError(t('recipeDetail.notFound'));
        }
      } catch (err) {
        setError(t('recipeDetail.errorLoading'));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchRecipe();
    } else {
      setError(t('recipeDetail.notFound'));
      setIsLoading(false);
    }
  }, [id, t]);
  
  const handleBackClick = () => {
    navigate('/recipes');
  };
  
  const handleToggleFavorite = () => {
    if (id) {
      const newFavoriteStatus = toggleFavoriteRecipe(id);
      setIsFavorite(newFavoriteStatus);
      
      // Show toast message
      if (newFavoriteStatus) {
        setToast({
          show: true,
          message: t('recipeDetail.addedToFavorites'),
          type: 'success'
        });
      } else {
        setToast({
          show: true,
          message: t('recipeDetail.removedFromFavorites'),
          type: 'info'
        });
      }
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }
  
  if (error || !recipe) {
    return (
      <PageContainer>
        <BackButton onClick={handleBackClick}>← {t('recipeDetail.backToRecipes')}</BackButton>
        <ErrorContainer>
          <h2>{error || t('recipeDetail.notFound')}</h2>
          <p>{t('recipeDetail.notFoundDescription')}</p>
        </ErrorContainer>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <BackButton onClick={handleBackClick}>← {t('recipeDetail.backToRecipes')}</BackButton>
      
      <RecipeHeader>
        <RecipeTitle>{recipe.title}</RecipeTitle>
        <RecipeDescription>{recipe.description}</RecipeDescription>
        <TagsContainer>
          {recipe.tags.map((tag, index) => (
            <Tag key={index}>#{tag}</Tag>
          ))}
        </TagsContainer>
      </RecipeHeader>
      
      <RecipeImage src={recipe.image} alt={recipe.title} />
      
      <RecipeInfo>
        <InfoItem>
          <InfoValue>{recipe.prepTime}</InfoValue>
          <InfoLabel>{t('recipeDetail.prepTime')} ({t('recipeDetail.minutes')})</InfoLabel>
        </InfoItem>
        <InfoItem>
          <InfoValue>{recipe.cookTime}</InfoValue>
          <InfoLabel>{t('recipeDetail.cookTime')} ({t('recipeDetail.minutes')})</InfoLabel>
        </InfoItem>
        <InfoItem>
          <InfoValue>{recipe.servings}</InfoValue>
          <InfoLabel>{t('recipeDetail.servings')}</InfoLabel>
        </InfoItem>
        <InfoItem>
          <InfoValue>{getDifficultyTranslation(recipe.difficulty)}</InfoValue>
          <InfoLabel>{t('recipeDetail.difficulty')}</InfoLabel>
        </InfoItem>
      </RecipeInfo>
      
      <RecipeContent>
        <div>
          <SectionTitle>{t('recipeDetail.ingredients')}</SectionTitle>
          <IngredientsList>
            {recipe.ingredients.map((ingredient, index) => (
              <IngredientItem key={index}>
                <IngredientName>{ingredient.name}</IngredientName>
                <IngredientAmount>
                  {ingredient.quantity} {ingredient.unit}
                </IngredientAmount>
              </IngredientItem>
            ))}
          </IngredientsList>
        </div>
        
        <div>
          <SectionTitle>{t('recipeDetail.instructions')}</SectionTitle>
          <InstructionsList>
            {recipe.instructions.map((instruction, index) => (
              <InstructionItem key={index}>{instruction}</InstructionItem>
            ))}
          </InstructionsList>
        </div>
      </RecipeContent>
      
      <NutritionSection>
        <NutritionTitle>{t('recipeDetail.nutritionFacts')}</NutritionTitle>
        <NutritionGrid>
          <NutrientItem>
            <NutrientValue>{recipe.calories}</NutrientValue>
            <NutrientLabel>{t('recipeDetail.calories')}</NutrientLabel>
          </NutrientItem>
          <NutrientItem>
            <NutrientValue>{recipe.protein}g</NutrientValue>
            <NutrientLabel>{t('recipeDetail.protein')}</NutrientLabel>
          </NutrientItem>
          <NutrientItem>
            <NutrientValue>{recipe.carbs}g</NutrientValue>
            <NutrientLabel>{t('recipeDetail.carbs')}</NutrientLabel>
          </NutrientItem>
          <NutrientItem>
            <NutrientValue>{recipe.fat}g</NutrientValue>
            <NutrientLabel>{t('recipeDetail.fat')}</NutrientLabel>
          </NutrientItem>
        </NutritionGrid>
      </NutritionSection>
      
      <ActionButtons>
        <FavoriteButton 
          variant={isFavorite ? "primary" : "outline"}
          size="large" 
          rightIcon={isFavorite ? "★" : "☆"}
          $isFavorite={isFavorite}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? t('recipeDetail.removeFromFavorites') : t('recipeDetail.addToFavorites')}
        </FavoriteButton>
        <Button 
          variant="primary" 
          size="large" 
          rightIcon="📝"
          onClick={() => navigate('/meal-planner')}
        >
          {t('recipeDetail.addToMealPlan')}
        </Button>
        <Button 
          variant="outline" 
          size="large" 
          rightIcon="🖨️"
          onClick={() => window.print()}
        >
          {t('recipeDetail.printRecipe')}
        </Button>
      </ActionButtons>
      
      {/* Toast notification */}
      <Toast show={toast.show} type={toast.type}>
        {toast.type === 'success' ? '✓' : 'ℹ️'} {toast.message}
      </Toast>
    </PageContainer>
  );
};

export default RecipeDetail;
