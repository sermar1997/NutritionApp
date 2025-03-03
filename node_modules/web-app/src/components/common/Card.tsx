import React from 'react';
import styled from 'styled-components';

// Types
export interface CardProps {
  children: React.ReactNode;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  padding?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  width?: string;
  height?: string;
  onClick?: () => void;
  className?: string;
  hoverEffect?: boolean;
}

// Styled Components
const CardContainer = styled.div<{
  elevation: 'none' | 'low' | 'medium' | 'high';
  padding: 'none' | 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  width?: string;
  height?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}>`
  background-color: ${({ theme }) => theme.colors.white};
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  transition: transform ${({ theme }) => theme.transitions.medium}, 
              box-shadow ${({ theme }) => theme.transitions.medium};
  
  /* Elevation */
  box-shadow: ${({ elevation, theme }) => {
    switch (elevation) {
      case 'low':
        return theme.shadows.sm;
      case 'medium':
        return theme.shadows.md;
      case 'high':
        return theme.shadows.lg;
      default:
        return 'none';
    }
  }};
  
  /* Padding */
  padding: ${({ padding, theme }) => {
    switch (padding) {
      case 'small':
        return theme.spacing.sm;
      case 'medium':
        return theme.spacing.md;
      case 'large':
        return theme.spacing.lg;
      default:
        return '0';
    }
  }};
  
  /* Border Radius */
  border-radius: ${({ borderRadius, theme }) => {
    switch (borderRadius) {
      case 'small':
        return theme.borderRadius.sm;
      case 'medium':
        return theme.borderRadius.md;
      case 'large':
        return theme.borderRadius.lg;
      default:
        return '0';
    }
  }};
  
  /* Hover Effect */
  ${({ hoverEffect, theme }) => hoverEffect && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.lg};
    }
  `}
`;

/**
 * Card component
 */
const Card: React.FC<CardProps> = ({
  children,
  elevation = 'low',
  padding = 'medium',
  borderRadius = 'medium',
  width,
  height,
  onClick,
  className,
  hoverEffect = false,
}) => {
  return (
    <CardContainer
      elevation={elevation}
      padding={padding}
      borderRadius={borderRadius}
      width={width}
      height={height}
      onClick={onClick}
      className={className}
      hoverEffect={hoverEffect}
    >
      {children}
    </CardContainer>
  );
};

export default Card;
