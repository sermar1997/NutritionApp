import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// Import i18n configuration
import './i18n';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { theme } from './theme';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Initialize the query client for data fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Initialize TensorFlow.js
import * as tf from '@tensorflow/tfjs';
tf.ready().then(() => {
  console.log('TensorFlow.js initialized');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <InventoryProvider>
              <App />
            </InventoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);

// Register the service worker for offline support
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('Content is cached for offline use.');
  },
  onUpdate: (registration) => {
    console.log('New content is available; please refresh.');
    
    // Create a custom event to notify the app of an update
    const updateEvent = new CustomEvent('serviceWorkerUpdate', { 
      detail: { registration } 
    });
    window.dispatchEvent(updateEvent);
  }
});
