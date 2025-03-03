import React from 'react';
import styled, { keyframes } from 'styled-components';

// Types
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

// Animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const SpinnerContainer = styled.div<{ inline?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: ${({ inline }) => (inline ? 'auto' : '200px')};
`;

const SpinnerElement = styled.div<{ size?: 'small' | 'medium' | 'large' | 'xlarge' }>`
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '24px';
      case 'large':
        return '64px';
      case 'xlarge':
        return '96px';
      default:
        return '50px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'small':
        return '24px';
      case 'large':
        return '64px';
      case 'xlarge':
        return '96px';
      default:
        return '50px';
    }
  }};
  border: ${({ size }) => {
    switch (size) {
      case 'small':
        return '3px';
      case 'large':
        return '5px';
      case 'xlarge':
        return '7px';
      default:
        return '5px';
    }
  }} solid ${({ theme }) => theme.colors.primaryLight};
  border-top: ${({ size }) => {
    switch (size) {
      case 'small':
        return '3px';
      case 'large':
        return '5px';
      case 'xlarge':
        return '7px';
      default:
        return '5px';
    }
  }} solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const inline = size === 'small';
  
  return (
    <SpinnerContainer inline={inline}>
      <SpinnerElement size={size} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
