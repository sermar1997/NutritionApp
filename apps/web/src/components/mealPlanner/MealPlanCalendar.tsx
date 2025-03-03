import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { MealPlan, MealType } from '../../types/mealPlan';
import MealItem from './MealItem';

interface MealPlanCalendarProps {
  mealPlan: MealPlan;
  currentWeekStart: Date;
  onMealSelect: (day: string, mealType: MealType) => void;
  onRemoveMeal: (day: string, mealType: MealType, index?: number) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WeekNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NavButton = styled.button`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const CurrentWeekText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: ${({ theme }) => theme.spacing.xs};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const DayHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => theme.spacing.xs};
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 50vh;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

const MealSection = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const MealTypeHeader = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EmptyMealSlot = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLightest};
  }
`;

const SnacksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

/**
 * MealPlanCalendar Component
 * Displays the weekly meal plan in a calendar view
 */
const MealPlanCalendar: React.FC<MealPlanCalendarProps> = ({
  mealPlan,
  currentWeekStart,
  onMealSelect,
  onRemoveMeal,
  onPreviousWeek,
  onNextWeek
}) => {
  const { t } = useTranslation();
  
  // Generate an array of dates for the current week
  const generateWeekDays = (startDate: Date): { date: Date, key: string }[] => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push({
        date: currentDate,
        key: currentDate.toISOString().split('T')[0]
      });
    }
    return days;
  };
  
  const weekDays = generateWeekDays(currentWeekStart);
  
  // Format date range for display
  const formatWeekRange = (start: Date): string => {
    const endDate = new Date(start);
    endDate.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };
  
  // Day name headers (Sun, Mon, etc.)
  const dayNames = weekDays.map(day => 
    day.date.toLocaleDateString(undefined, { weekday: 'short' })
  );

  return (
    <div>
      <CalendarHeader>
        <h3>{t('mealPlanner.calendar')}</h3>
        <WeekNavigation>
          <NavButton onClick={onPreviousWeek}>
            &lt; {t('mealPlanner.previousWeek')}
          </NavButton>
          <CurrentWeekText>{formatWeekRange(currentWeekStart)}</CurrentWeekText>
          <NavButton onClick={onNextWeek}>
            {t('mealPlanner.nextWeek')} &gt;
          </NavButton>
        </WeekNavigation>
      </CalendarHeader>
      
      <GridContainer>
        {/* Day headers */}
        {dayNames.map((dayName, index) => (
          <DayHeader key={`header-${index}`}>
            {dayName}
          </DayHeader>
        ))}
        
        {/* Day columns */}
        {weekDays.map(({ date, key }) => (
          <DayColumn key={`day-${key}`}>
            <DayHeader>
              {date.getDate()}
            </DayHeader>
            
            {/* Breakfast */}
            <MealSection>
              <MealTypeHeader>{t('mealPlanner.breakfast')}</MealTypeHeader>
              {mealPlan[key]?.breakfast ? (
                <MealItem 
                  recipe={mealPlan[key].breakfast!} 
                  onRemove={() => onRemoveMeal(key, 'breakfast')}
                />
              ) : (
                <EmptyMealSlot onClick={() => onMealSelect(key, 'breakfast')}>
                  {t('mealPlanner.addMeal')}
                </EmptyMealSlot>
              )}
            </MealSection>
            
            {/* Lunch */}
            <MealSection>
              <MealTypeHeader>{t('mealPlanner.lunch')}</MealTypeHeader>
              {mealPlan[key]?.lunch ? (
                <MealItem 
                  recipe={mealPlan[key].lunch!} 
                  onRemove={() => onRemoveMeal(key, 'lunch')}
                />
              ) : (
                <EmptyMealSlot onClick={() => onMealSelect(key, 'lunch')}>
                  {t('mealPlanner.addMeal')}
                </EmptyMealSlot>
              )}
            </MealSection>
            
            {/* Dinner */}
            <MealSection>
              <MealTypeHeader>{t('mealPlanner.dinner')}</MealTypeHeader>
              {mealPlan[key]?.dinner ? (
                <MealItem 
                  recipe={mealPlan[key].dinner!} 
                  onRemove={() => onRemoveMeal(key, 'dinner')}
                />
              ) : (
                <EmptyMealSlot onClick={() => onMealSelect(key, 'dinner')}>
                  {t('mealPlanner.addMeal')}
                </EmptyMealSlot>
              )}
            </MealSection>
            
            {/* Snacks */}
            <MealSection>
              <MealTypeHeader>{t('mealPlanner.snacks')}</MealTypeHeader>
              {mealPlan[key]?.snacks && mealPlan[key].snacks.length > 0 ? (
                <SnacksList>
                  {mealPlan[key].snacks.map((snack, index) => (
                    <MealItem 
                      key={`snack-${index}`}
                      recipe={snack} 
                      onRemove={() => onRemoveMeal(key, 'snacks', index)}
                      isSnack
                    />
                  ))}
                  <EmptyMealSlot onClick={() => onMealSelect(key, 'snacks')}>
                    {t('mealPlanner.addSnack')}
                  </EmptyMealSlot>
                </SnacksList>
              ) : (
                <EmptyMealSlot onClick={() => onMealSelect(key, 'snacks')}>
                  {t('mealPlanner.addSnack')}
                </EmptyMealSlot>
              )}
            </MealSection>
          </DayColumn>
        ))}
      </GridContainer>
    </div>
  );
};

export default MealPlanCalendar;
