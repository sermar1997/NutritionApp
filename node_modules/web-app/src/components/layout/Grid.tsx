import React from 'react';
import styled from 'styled-components';

// Props interface for Container component
interface ContainerProps {
  fluid?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Props interface for Row component
interface RowProps {
  className?: string;
  children: React.ReactNode;
}

// Props interface for Col component
interface ColProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Container component
 * Provides a centered, responsive container with proper padding
 */
export const Container = styled.div<ContainerProps>`
  width: 100%;
  padding-right: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.md};
  margin-right: auto;
  margin-left: auto;
  
  ${({ fluid, theme }) => !fluid && `
    @media (min-width: ${theme.breakpoints.sm}) {
      max-width: 540px;
    }
    
    @media (min-width: ${theme.breakpoints.md}) {
      max-width: 720px;
    }
    
    @media (min-width: ${theme.breakpoints.lg}) {
      max-width: 960px;
    }
    
    @media (min-width: ${theme.breakpoints.xl}) {
      max-width: 1140px;
    }
  `}
`;

/**
 * Row component
 * Creates a flexible row with negative margins to offset column padding
 */
export const Row = styled.div<RowProps>`
  display: flex;
  flex-wrap: wrap;
  margin-right: -${({ theme }) => theme.spacing.md};
  margin-left: -${({ theme }) => theme.spacing.md};
`;

/**
 * Col component
 * Creates a flexible column with responsive width
 */
export const Col = styled.div<ColProps>`
  position: relative;
  width: 100%;
  padding-right: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.md};
  
  ${({ xs }) => xs && `
    flex: 0 0 ${(xs / 12) * 100}%;
    max-width: ${(xs / 12) * 100}%;
  `}
  
  ${({ sm, theme }) => sm && `
    @media (min-width: ${theme.breakpoints.sm}) {
      flex: 0 0 ${(sm / 12) * 100}%;
      max-width: ${(sm / 12) * 100}%;
    }
  `}
  
  ${({ md, theme }) => md && `
    @media (min-width: ${theme.breakpoints.md}) {
      flex: 0 0 ${(md / 12) * 100}%;
      max-width: ${(md / 12) * 100}%;
    }
  `}
  
  ${({ lg, theme }) => lg && `
    @media (min-width: ${theme.breakpoints.lg}) {
      flex: 0 0 ${(lg / 12) * 100}%;
      max-width: ${(lg / 12) * 100}%;
    }
  `}
  
  ${({ xl, theme }) => xl && `
    @media (min-width: ${theme.breakpoints.xl}) {
      flex: 0 0 ${(xl / 12) * 100}%;
      max-width: ${(xl / 12) * 100}%;
    }
  `}
`;

export default {
  Container,
  Row,
  Col
};
