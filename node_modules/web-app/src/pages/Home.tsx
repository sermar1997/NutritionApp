import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

// Styled Components
const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: calc(${({ theme }) => theme.typography.fontSize.xl} * 1.2);
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 700px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FeatureCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const CTASection = styled.section`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.md};
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const CTATitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
`;

const CTADescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textPrimary};
  max-width: 700px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

/**
 * Home page component
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  return (
    <HomeContainer>
      <HeroSection>
        <Title>{t('home.welcome')}</Title>
        <Subtitle>
          {t('home.subtitle')}
        </Subtitle>
        
        <ButtonGroup>
          {isAuthenticated ? (
            <>
              <Button 
                size="large" 
                onClick={() => navigate('/recipes')}
                rightIcon="🍽️"
              >
                {t('home.browseRecipes')}
              </Button>
              <Button 
                size="large" 
                variant="secondary"
                onClick={() => navigate('/inventory')}
                rightIcon="🥗"
              >
                {t('home.manageInventory')}
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="large" 
                onClick={() => navigate('/register')}
              >
                {t('home.getStarted')}
              </Button>
              <Button 
                size="large" 
                variant="outline"
                onClick={() => navigate('/login')}
              >
                {t('nav.login')}
              </Button>
            </>
          )}
        </ButtonGroup>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>{t('home.features.title')}</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📸</FeatureIcon>
            <FeatureTitle>{t('home.features.recognition')}</FeatureTitle>
            <FeatureDescription>
              {t('home.features.recognitionDesc')}
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>{t('home.features.analysis')}</FeatureTitle>
            <FeatureDescription>
              {t('home.features.analysisDesc')}
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🧠</FeatureIcon>
            <FeatureTitle>{t('home.features.recipes')}</FeatureTitle>
            <FeatureDescription>
              {t('home.features.recipesDesc')}
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📦</FeatureIcon>
            <FeatureTitle>{t('home.features.inventory')}</FeatureTitle>
            <FeatureDescription>
              {t('home.features.inventoryDesc')}
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔄</FeatureIcon>
            <FeatureTitle>{t('home.features.offline')}</FeatureTitle>
            <FeatureDescription>
              {t('home.features.offlineDesc')}
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>{t('home.features.crossPlatform')}</FeatureTitle>
            <FeatureDescription>
              {t('home.features.crossPlatformDesc')}
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <CTASection>
        <CTATitle>{t('home.cta.title')}</CTATitle>
        <CTADescription>
          {t('home.cta.description')}
        </CTADescription>
        
        <Button 
          size="large" 
          onClick={() => navigate(isAuthenticated ? '/recipes' : '/register')}
        >
          {isAuthenticated ? t('home.browseRecipes') : t('home.cta.button')}
        </Button>
      </CTASection>
    </HomeContainer>
  );
};

export default Home;
