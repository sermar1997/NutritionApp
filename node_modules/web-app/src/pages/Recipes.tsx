import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import RecipeCard, { RecipeCardProps } from '../components/recipes/RecipeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { loadFavoriteRecipes, isRecipeFavorite } from '../services/storageService';

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
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

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  align-items: center;
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  flex: 1;
  min-width: 250px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const RecipesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RecipeItem = styled.div`
  height: 100%;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyStateTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EmptyStateDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const FilterTabs = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterTab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  cursor: pointer;
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.textSecondary};
  border-bottom: 2px solid ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  margin-right: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

/**
 * Recipes page component
 */
const Recipes: React.FC = () => {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState<RecipeCardProps[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeCardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  
  // Function to update favorites
  const updateFavorites = useCallback(() => {
    const favorites = loadFavoriteRecipes();
    setFavoriteIds(favorites);
  }, []);
  
  // Mock data fetch - in a real app, this would come from an API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockRecipes: RecipeCardProps[] = [
          {
            id: '1',
            title: t('recipe.grilledChickenSalad'),
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
            prepTime: 15,
            cookTime: 20,
            calories: 350,
            protein: 30,
            carbs: 25,
            fat: 12,
            difficulty: 'easy',
          },
          {
            id: '2',
            title: t('recipe.vegetableStirFry'),
            image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
            prepTime: 10,
            cookTime: 15,
            calories: 280,
            protein: 10,
            carbs: 35,
            fat: 10,
            difficulty: 'easy',
          },
          {
            id: '3',
            title: t('recipe.overnightOats'),
            image: 'https://images.unsplash.com/photo-1504387828636-abeb50778c0c',
            prepTime: 5,
            cookTime: 0,
            calories: 320,
            protein: 15,
            carbs: 45,
            fat: 8,
            difficulty: 'easy',
          },
          {
            id: '4',
            title: t('recipe.quinoaBuddhaBowl'),
            image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733',
            prepTime: 15,
            cookTime: 20,
            calories: 420,
            protein: 18,
            carbs: 60,
            fat: 15,
            difficulty: 'medium',
          },
          {
            id: '5',
            title: t('recipe.smoothieBowl'),
            image: 'https://images.unsplash.com/photo-1494932116522-d4e24b67800a',
            prepTime: 10,
            cookTime: 0,
            calories: 250,
            protein: 12,
            carbs: 40,
            fat: 6,
            difficulty: 'easy',
          },
          {
            id: '6',
            title: t('recipe.salmonWithVegetables'),
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
            prepTime: 10,
            cookTime: 25,
            calories: 450,
            protein: 35,
            carbs: 15,
            fat: 25,
            difficulty: 'medium',
          },
          {
            id: '7',
            title: t('recipe.beefStirFry'),
            image: 'https://images.unsplash.com/photo-1541173114274-e5450ae0031a',
            prepTime: 15,
            cookTime: 15,
            calories: 410,
            protein: 30,
            carbs: 30,
            fat: 20,
            difficulty: 'medium',
          },
          {
            id: '8',
            title: t('recipe.mediterraneanWrap'),
            image: 'https://images.unsplash.com/photo-1600367161489-c93166991de3',
            prepTime: 15,
            cookTime: 10,
            calories: 380,
            protein: 15,
            carbs: 45,
            fat: 18,
            difficulty: 'easy',
          },
        ];
        
        setRecipes(mockRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipes();
  }, [t]);
  
  // Update favorites when component mounts and periodically
  useEffect(() => {
    updateFavorites();
    
    // Check for favorites updates every 1 second
    const intervalId = setInterval(() => {
      updateFavorites();
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [updateFavorites]);
  
  // Filter recipes based on search term and favorites
  useEffect(() => {
    let filtered = [...recipes];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by favorites if enabled
    if (showOnlyFavorites) {
      filtered = filtered.filter(recipe => favoriteIds.includes(recipe.id));
    }
    
    setFilteredRecipes(filtered);
  }, [searchTerm, recipes, showOnlyFavorites, favoriteIds]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Toggle favorites filter
  const handleToggleFavorites = (showFavorites: boolean) => {
    setShowOnlyFavorites(showFavorites);
  };
  
  // Loading state
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
        <Title>{t('recipes.title')}</Title>
        <Description>
          {t('app.tagline')}
        </Description>
      </PageHeader>
      
      <FilterTabs>
        <FilterTab 
          active={!showOnlyFavorites} 
          onClick={() => handleToggleFavorites(false)}
        >
          {t('recipes.allRecipes')}
        </FilterTab>
        <FilterTab 
          active={showOnlyFavorites} 
          onClick={() => handleToggleFavorites(true)}
        >
          <span>★</span> {t('recipes.favorites')}
        </FilterTab>
      </FilterTabs>
      
      <FilterBar>
        <SearchInput
          type="text"
          placeholder={t('recipes.search')}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <Button variant="secondary">
          {t('recipes.filters')}
        </Button>
        
        <Button variant="secondary">
          {t('recipes.sort.newest')}
        </Button>
      </FilterBar>
      
      {filteredRecipes.length > 0 ? (
        <RecipesGrid>
          {filteredRecipes.map(recipe => (
            <RecipeItem key={recipe.id}>
              <RecipeCard {...recipe} />
            </RecipeItem>
          ))}
        </RecipesGrid>
      ) : (
        <EmptyState>
          <EmptyStateIcon>🍽️</EmptyStateIcon>
          <EmptyStateTitle>
            {showOnlyFavorites ? t('recipes.noFavorites') : t('recipes.noResults')}
          </EmptyStateTitle>
          <EmptyStateDescription>
            {showOnlyFavorites 
              ? t('recipes.addSomeFavorites') 
              : t('recipes.tryAgain')
            }
          </EmptyStateDescription>
          <Button onClick={() => {
            setSearchTerm('');
            if (showOnlyFavorites && recipes.length > 0) {
              setShowOnlyFavorites(false);
            }
          }}>
            {showOnlyFavorites ? t('recipes.viewAll') : t('common.clearFilters')}
          </Button>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default Recipes;
