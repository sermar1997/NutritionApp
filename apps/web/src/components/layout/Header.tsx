import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

// Styled Components
const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  
  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    display: flex;
    align-items: center;
    
    &:hover {
      text-decoration: none;
    }
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  cursor: pointer;
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  
  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    padding: ${({ theme }) => theme.spacing.sm} 0;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: opacity ${({ theme }) => theme.transitions.short};
  
  &:hover {
    opacity: 0.8;
    text-decoration: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AuthButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Button = styled.button`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    border-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

/**
 * Header component for the application
 */
const Header: React.FC = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <HeaderContainer>
      <NavContainer>
        <LogoContainer>
          <Link to="/">
            <span>{t('app.name')}</span>
          </Link>
        </LogoContainer>

        <NavLinks>
          <NavLink to="/recipes">{t('nav.recipes')}</NavLink>
          <NavLink to="/inventory">{t('nav.inventory')}</NavLink>
          {isAuthenticated && <NavLink to="/meal-planner">{t('nav.mealPlanner')}</NavLink>}
          {isAuthenticated && <NavLink to="/profile">{t('nav.profile')}</NavLink>}
        </NavLinks>

        <MobileMenuButton onClick={toggleMobileMenu}>
          ☰
        </MobileMenuButton>

        <MobileMenu isOpen={mobileMenuOpen}>
          <Link to="/recipes" onClick={() => setMobileMenuOpen(false)}>{t('nav.recipes')}</Link>
          <Link to="/inventory" onClick={() => setMobileMenuOpen(false)}>{t('nav.inventory')}</Link>
          {isAuthenticated && (
            <>
              <Link to="/meal-planner" onClick={() => setMobileMenuOpen(false)}>{t('nav.mealPlanner')}</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>{t('nav.profile')}</Link>
            </>
          )}
          {isAuthenticated ? (
            <Link to="/" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>{t('nav.logout')}</Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>{t('nav.login')}</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>{t('nav.register')}</Link>
            </>
          )}
        </MobileMenu>

        <RightSection>
          <LanguageSwitcher />
          
          {!isAuthenticated ? (
            <AuthButtons>
              <Button onClick={() => navigate('/login')}>{t('nav.login')}</Button>
              <PrimaryButton onClick={() => navigate('/register')}>{t('nav.register')}</PrimaryButton>
            </AuthButtons>
          ) : (
            <AuthButtons>
              <Button onClick={handleLogout}>{t('nav.logout')}</Button>
            </AuthButtons>
          )}
        </RightSection>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;
