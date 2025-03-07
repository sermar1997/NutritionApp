import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '400px';
      case 'large':
        return '800px';
      default:
        return '600px';
    }
  }};
  max-height: 90vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 95%;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Modal component for displaying content in a popup
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Close when clicking outside of modal content
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return createPortal(
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer ref={modalRef} size={size} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="close">✕</CloseButton>
        </ModalHeader>
        {children}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

export default Modal;
