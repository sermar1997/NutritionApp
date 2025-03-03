import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';

// Styled Components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 100px;
`;

// Styled component para el Link
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: inline-block;
`;

/**
 * 404 Not Found page component
 */
const NotFound: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <PageContainer>
      <ImageContainer>🍽️</ImageContainer>
      <ErrorCode>{t('notFound.code')}</ErrorCode>
      <Title>{t('notFound.title')}</Title>
      <Description>{t('notFound.description')}</Description>
      
      <ButtonContainer>
        <StyledLink to="/">
          <Button 
            variant="primary"
            size="large"
          >
            {t('notFound.goHome')}
          </Button>
        </StyledLink>
        <StyledLink to="/recipes">
          <Button 
            variant="outline"
            size="large"
          >
            {t('notFound.browseRecipes')}
          </Button>
        </StyledLink>
      </ButtonContainer>
    </PageContainer>
  );
};

export default NotFound;
