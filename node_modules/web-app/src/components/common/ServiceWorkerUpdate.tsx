/**
 * Service Worker Update Notification
 * 
 * Component that shows a notification when a new version of the app is available,
 * allowing users to refresh and get the latest version.
 */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Button from './Button';

// Styled components
const UpdateContainer = styled.div<{ show: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transform: translateY(${({ show }) => (show ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
`;

const UpdateMessage = styled.div`
  flex: 1;
`;

const UpdateTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UpdateDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ButtonContainer = styled.div`
  margin-left: ${({ theme }) => theme.spacing.md};
`;

interface ServiceWorkerUpdateProps {
  /**
   * Service Worker registration object from the update event
   */
  registration?: ServiceWorkerRegistration;
}

/**
 * Component that shows a notification when a service worker update is available
 */
const ServiceWorkerUpdate: React.FC<ServiceWorkerUpdateProps> = ({ registration }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    // Show the notification if a registration is provided
    if (registration) {
      setShow(true);
    }
    
    // Listen for service worker update events
    const handleServiceWorkerUpdate = (event: Event) => {
      if ((event as CustomEvent).detail?.registration) {
        setShow(true);
      }
    };
    
    window.addEventListener('serviceWorkerUpdate', handleServiceWorkerUpdate as EventListener);
    
    return () => {
      window.removeEventListener('serviceWorkerUpdate', handleServiceWorkerUpdate as EventListener);
    };
  }, [registration]);
  
  /**
   * Update the application by reloading the page
   */
  const updateApp = () => {
    if (registration && registration.waiting) {
      // Send a message to the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    
    // Reload the page to get the new version
    window.location.reload();
  };
  
  /**
   * Dismiss the notification
   */
  const dismissNotification = () => {
    setShow(false);
  };
  
  return (
    <UpdateContainer show={show}>
      <UpdateMessage>
        <UpdateTitle>{t('serviceWorker.updateAvailable')}</UpdateTitle>
        <UpdateDescription>{t('serviceWorker.updateDescription')}</UpdateDescription>
      </UpdateMessage>
      
      <ButtonContainer>
        <Button 
          variant="secondary" 
          onClick={updateApp}
        >
          {t('serviceWorker.update')}
        </Button>
        
        <Button 
          variant="text" 
          onClick={dismissNotification}
        >
          {t('serviceWorker.notNow')}
        </Button>
      </ButtonContainer>
    </UpdateContainer>
  );
};

export default ServiceWorkerUpdate;
