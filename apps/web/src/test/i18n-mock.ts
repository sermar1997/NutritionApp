import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock translations
const resources = {
  en: {
    common: {
      // Common translations
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      remove: 'Remove',
      
      // Button texts
      apply: 'Apply',
      back: 'Back',
      next: 'Next',
      confirm: 'Confirm',
      close: 'Close',
      update: 'Update',
      
      // Form labels
      name: 'Name',
      description: 'Description',
      category: 'Category',
      quantity: 'Quantity',
      unit: 'Unit',
      date: 'Date',
      
      // Messages
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Operation successful',
      
      // Empty states
      noResults: 'No results found',
      noItems: 'No items to display',
    },
    
    // Inventory related translations
    inventory: {
      title: 'Inventory',
      description: 'Manage your food inventory',
      searchPlaceholder: 'Search ingredients...',
      addIngredient: 'Add Ingredient',
      scanIngredient: 'Scan Ingredient',
      ingredientName: 'Ingredient Name',
      quantity: 'Quantity',
      unit: 'Unit',
      category: 'Category',
      expiryDate: 'Expiry Date',
      notes: 'Notes',
      categories: 'Categories',
      expiringItems: 'Expiring Soon',
      allItems: 'All Items',
      emptyInventory: 'Your inventory is empty',
      ingredients: 'Ingredients',
      takePhoto: 'Take a Photo',
      uploadPhoto: 'Upload a Photo',
      capture: 'Capture',
      analyze: 'Analyze',
      detecting: 'Detecting ingredients...',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    // Disable suspense mode for tests
    react: {
      useSuspense: false,
    },
  });

export default i18n;
