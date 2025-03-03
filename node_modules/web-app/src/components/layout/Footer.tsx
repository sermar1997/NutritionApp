import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Styled Components
const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-basis: 100%;
  }
`;

const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FooterLinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

/* Commented out as it's currently unused
const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;
*/

const Copyright = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  width: 100%;
`;

/**
 * Footer component for the application
 */
const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>{t('app.name')}</FooterTitle>
          <p>{t('app.tagline')}</p>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>{t('nav.quickLinks')}</FooterTitle>
          <FooterLinkList>
            <FooterLinkItem>
              <FooterLink to="/">{t('nav.home')}</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/recipes">{t('nav.recipes')}</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/inventory">{t('nav.inventory')}</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/profile">{t('nav.profile')}</FooterLink>
            </FooterLinkItem>
          </FooterLinkList>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>{t('footer.resources')}</FooterTitle>
          <FooterLinkList>
            <FooterLinkItem>
              <FooterLink to="/about">{t('footer.about')}</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/faq">{t('footer.faq')}</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/contact">{t('footer.contact')}</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/blog">{t('footer.blog')}</FooterLink>
            </FooterLinkItem>
          </FooterLinkList>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>{t('footer.legal')}</FooterTitle>
          <FooterLinkList>
            <FooterLinkItem>
              <FooterLink to="/terms">{t('footer.terms')}</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/privacy">{t('footer.privacy')}</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/cookies">{t('footer.cookiePolicy')}</FooterLink>
            </FooterLinkItem>
          </FooterLinkList>
        </FooterSection>
        
        <Copyright>
          {t('footer.copyright', { year: currentYear })}
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
