import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n-mock';
import { theme } from '../theme';
import { InventoryProvider } from '../context/InventoryContext';
import { AuthProvider } from '../context/AuthContext';

// Create a wrapper that provides all the necessary context providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <InventoryProvider>
              {children}
            </InventoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

// Custom render method that includes the providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method
export { customRender as render };
