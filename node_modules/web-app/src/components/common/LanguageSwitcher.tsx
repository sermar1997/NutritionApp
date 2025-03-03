import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Types
interface Language {
  code: string;
  name: string;
  flag: string;
}

// Constants
const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
];

// Styled Components
const LanguageContainer = styled.div`
  position: relative;
  z-index: 100;
`;

const CurrentLanguage = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  span.flag {
    font-size: 1.2em;
  }
  
  span.arrow {
    margin-left: ${({ theme }) => theme.spacing.xs};
    transition: transform ${({ theme }) => theme.transitions.short};
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 180px;
  margin-top: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all ${({ theme }) => theme.transitions.medium};
  z-index: 100;
`;

const LanguageOption = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  background: ${({ isActive, theme }) => isActive ? theme.colors.primaryLight : 'transparent'};
  color: ${({ isActive, theme }) => isActive ? theme.colors.primary : theme.colors.textPrimary};
  text-align: left;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
  
  .flag {
    font-size: 1.2em;
  }
  
  .name {
    font-weight: ${({ isActive, theme }) => isActive ? theme.typography.fontWeight.medium : theme.typography.fontWeight.regular};
  }
`;

/**
 * Modern language switcher component with dropdown
 */
const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };
  
  // Close the dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <LanguageContainer onClick={handleContainerClick}>
      <CurrentLanguage 
        onClick={toggleDropdown}
        isOpen={isOpen}
      >
        <span className="flag">{currentLanguage.flag}</span>
        <span className="arrow">▼</span>
      </CurrentLanguage>
      
      <DropdownMenu isOpen={isOpen}>
        {LANGUAGES.map((language) => (
          <LanguageOption
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            isActive={i18n.language === language.code}
          >
            <span className="flag">{language.flag}</span>
            <span className="name">{language.name}</span>
          </LanguageOption>
        ))}
      </DropdownMenu>
    </LanguageContainer>
  );
};

export default LanguageSwitcher;
