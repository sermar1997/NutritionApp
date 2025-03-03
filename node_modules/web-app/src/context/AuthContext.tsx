import React, { createContext, useState, useContext, useEffect } from 'react';
import localforage from 'localforage';

// Types
type User = {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  isPremium: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored user on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await localforage.getItem<User>('user');
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful login
      
      // Simulated API response
      const userData: User = {
        id: '123456',
        email,
        name: 'Sample User',
        isPremium: false,
      };
      
      await localforage.setItem('user', userData);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful registration
      
      // Simulated API response
      const userData: User = {
        id: '123456',
        email,
        name,
        isPremium: false,
      };
      
      await localforage.setItem('user', userData);
      setUser(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await localforage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const updatedUser = { ...user, ...userData };
      await localforage.setItem('user', updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Failed to update profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use the auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
