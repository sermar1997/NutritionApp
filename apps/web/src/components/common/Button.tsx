import React from 'react';
import styled, { css } from 'styled-components';

// Types
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: React.ElementType;
  to?: string;
}

// Styled Components
const StyledButton = styled.button<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  position: relative;
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Loading state */
  ${({ isLoading }) =>
    isLoading &&
    css`
      color: transparent !important;
      pointer-events: none;
      
      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid currentColor;
        border-right-color: transparent;
        animation: spin 0.75s linear infinite;
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}
  
  /* Size Variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return css`
          font-size: ${theme.typography.fontSize.sm};
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          min-height: 32px;
        `;
      case 'large':
        return css`
          font-size: ${theme.typography.fontSize.lg};
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          min-height: 48px;
        `;
      default: // medium
        return css`
          font-size: ${theme.typography.fontSize.md};
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          min-height: 40px;
        `;
    }
  }}
  
  /* Style Variants */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.white};
          border: none;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondaryDark};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.secondaryDark};
          }
        `;
      case 'tertiary':
        return css`
          background-color: ${theme.colors.tertiary};
          color: ${theme.colors.white};
          border: none;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.tertiaryDark};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.tertiaryDark};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.error};
          color: ${theme.colors.white};
          border: none;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.errorDark};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.errorDark};
          }
        `;
      case 'success':
        return css`
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
          border: none;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.successDark};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.successDark};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryLight};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.primaryLight};
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: none;
          padding-left: 0;
          padding-right: 0;
          
          &:hover:not(:disabled) {
            color: ${theme.colors.primaryDark};
            text-decoration: underline;
          }
          
          &:active:not(:disabled) {
            color: ${theme.colors.primaryDark};
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          border: none;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryDark};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.primaryDark};
          }
        `;
    }
  }}
`;

const IconContainer = styled.span<{ isLeft?: boolean; isRight?: boolean }>`
  display: flex;
  align-items: center;
  margin-left: ${({ isRight, theme }) => (isRight ? theme.spacing.xs : 0)};
  margin-right: ${({ isLeft, theme }) => (isLeft ? theme.spacing.xs : 0)};
`;

/**
 * Button component
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  as,
  to,
  ...rest
}) => {
  return (
    <StyledButton
      as={as}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      to={to}
      {...rest}
    >
      {leftIcon && <IconContainer isLeft>{leftIcon}</IconContainer>}
      {children}
      {rightIcon && <IconContainer isRight>{rightIcon}</IconContainer>}
    </StyledButton>
  );
};

export default Button;
