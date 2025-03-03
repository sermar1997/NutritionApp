import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ServiceWorkerUpdate from './components/common/ServiceWorkerUpdate';

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Recipes = lazy(() => import('./pages/Recipes'));
const Inventory = lazy(() => import('./pages/Inventory'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MealPlanner = lazy(() => import('./pages/MealPlanner'));

// Styled Components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

/**
 * Main Application Component
 */
const App: React.FC = () => {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | undefined>(undefined);

  // Listen for service worker updates
  useEffect(() => {
    const handleServiceWorkerUpdate = (event: Event) => {
      if ((event as CustomEvent).detail?.registration) {
        setSwRegistration((event as CustomEvent).detail.registration);
      }
    };
    
    window.addEventListener('serviceWorkerUpdate', handleServiceWorkerUpdate as EventListener);
    
    return () => {
      window.removeEventListener('serviceWorkerUpdate', handleServiceWorkerUpdate as EventListener);
    };
  }, []);

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </MainContent>
      <Footer />
      <ServiceWorkerUpdate registration={swRegistration} />
    </AppContainer>
  );
};

export default App;
