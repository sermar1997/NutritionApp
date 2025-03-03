import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from '../components/layout/Grid';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import MealPlanCalendar from '../components/mealPlanner/MealPlanCalendar';
import MealPlanRecipeSelector from '../components/mealPlanner/MealPlanRecipeSelector';
import { RecipeCardProps } from '../components/recipes/RecipeCard';
import { MealPlan, MealType, DayMealPlan } from '../types/mealPlan';
import { saveMealPlan, loadMealPlan } from '../services/storageService';

const PageContainer = styled(Container)`
  padding-top: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SubTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
  }
`;

const CalendarContainer = styled.div`
  flex: 3;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md};
`;

const RecipeSelectorContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md};
  height: fit-content;
`;

/**
 * MealPlanner Component
 * Allows users to plan their meals for the week
 */
const MealPlanner: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStartDate(new Date()));

  // Load saved meal plan on component mount
  useEffect(() => {
    const savedMealPlan = loadMealPlan();
    if (savedMealPlan) {
      setMealPlan(savedMealPlan);
    } else {
      // Initialize empty meal plan for the current week
      initializeWeekMealPlan(currentWeekStart);
    }
  }, []);

  // Save meal plan to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(mealPlan).length > 0) {
      saveMealPlan(mealPlan);
    }
  }, [mealPlan]);

  // Initialize meal plan for the current week if empty
  useEffect(() => {
    if (Object.keys(mealPlan).length === 0) {
      initializeWeekMealPlan(currentWeekStart);
    }
  }, [currentWeekStart]);

  // Get the start date of the week (Sunday)
  function getWeekStartDate(date: Date): Date {
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const diff = date.getDate() - dayOfWeek;
    const startDate = new Date(date);
    startDate.setDate(diff);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }

  // Initialize an empty meal plan for a week
  function initializeWeekMealPlan(startDate: Date) {
    const newMealPlan: MealPlan = {};
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateKey = formatDateKey(currentDate);
      
      if (!mealPlan[dateKey]) {
        newMealPlan[dateKey] = {
          breakfast: null,
          lunch: null,
          dinner: null,
          snacks: []
        };
      } else {
        newMealPlan[dateKey] = { ...mealPlan[dateKey] };
      }
    }
    
    setMealPlan(newMealPlan);
  }

  // Format date to YYYY-MM-DD for use as object keys
  function formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Navigate to the previous week
  const goToPreviousWeek = () => {
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeekStart);
  };

  // Navigate to the next week
  const goToNextWeek = () => {
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeekStart);
  };

  // Handle recipe selection for a meal
  const handleRecipeSelect = (recipe: RecipeCardProps) => {
    if (!selectedDay || !selectedMealType) return;

    const updatedMealPlan = { ...mealPlan };
    
    if (selectedMealType === 'snacks') {
      // For snacks, we add to an array
      if (!updatedMealPlan[selectedDay].snacks) {
        updatedMealPlan[selectedDay].snacks = [];
      }
      updatedMealPlan[selectedDay].snacks.push(recipe);
    } else {
      // For other meal types, we replace the current recipe
      updatedMealPlan[selectedDay][selectedMealType] = recipe;
    }
    
    setMealPlan(updatedMealPlan);
  };

  // Handle meal selection in the calendar
  const handleMealSelect = (day: string, mealType: MealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
  };

  // Handle meal removal
  const handleRemoveMeal = (day: string, mealType: MealType, index?: number) => {
    const updatedMealPlan = { ...mealPlan };
    
    if (mealType === 'snacks' && typeof index === 'number') {
      // Remove specific snack from array
      const snacks = [...(updatedMealPlan[day].snacks || [])];
      snacks.splice(index, 1);
      updatedMealPlan[day].snacks = snacks;
    } else {
      // Remove entire meal
      // Fix: TypeScript needs to know we're not trying to assign null to the snacks array
      if (mealType === 'breakfast' || mealType === 'lunch' || mealType === 'dinner') {
        updatedMealPlan[day][mealType] = null;
      }
    }
    
    setMealPlan(updatedMealPlan);
  };

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <PageContainer>
      <Row>
        <Col xs={12}>
          <Title>{t('mealPlanner.title')}</Title>
          <SubTitle>{t('mealPlanner.subtitle')}</SubTitle>
        </Col>
      </Row>
      
      <ContentContainer>
        <CalendarContainer>
          <MealPlanCalendar 
            mealPlan={mealPlan}
            currentWeekStart={currentWeekStart}
            onMealSelect={handleMealSelect}
            onRemoveMeal={handleRemoveMeal}
            onPreviousWeek={goToPreviousWeek}
            onNextWeek={goToNextWeek}
          />
        </CalendarContainer>
        
        <RecipeSelectorContainer>
          <MealPlanRecipeSelector 
            selectedDay={selectedDay}
            selectedMealType={selectedMealType}
            onRecipeSelect={handleRecipeSelect}
          />
        </RecipeSelectorContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default MealPlanner;
