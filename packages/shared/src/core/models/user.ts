/**
 * User models
 * 
 * Types and interfaces for user data, preferences, and authentication.
 */

import { DietaryPreference } from './recipe';

/**
 * User role
 */
export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN',
}

/**
 * Measurement system preference
 */
export enum MeasurementSystem {
  METRIC = 'METRIC',
  IMPERIAL = 'IMPERIAL',
}

/**
 * Theme preference
 */
export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

/**
 * User preferences
 */
export interface UserPreferences {
  /** Dietary preferences */
  dietary: DietaryPreference[];
  /** Measurement system */
  measurementSystem: MeasurementSystem;
  /** UI theme */
  theme: Theme;
  /** Whether to enable notifications */
  enableNotifications: boolean;
  /** Whether to enable offline mode */
  enableOfflineMode: boolean;
  /** Ingredients to exclude */
  excludedIngredients: string[];
  /** Kitchen equipment available */
  availableEquipment: string[];
}

/**
 * Nutrition goal
 */
export interface NutritionGoal {
  /** Daily calorie target */
  dailyCalories: number;
  /** Protein target (grams) */
  protein: number;
  /** Carbs target (grams) */
  carbs: number;
  /** Fat target (grams) */
  fat: number;
  /** Whether goals are active */
  active: boolean;
}

/**
 * User account
 */
export interface User {
  /** Unique identifier */
  id: string;
  /** Email address */
  email: string;
  /** Display name */
  displayName: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** User role */
  role: UserRole;
  /** User preferences */
  preferences: UserPreferences;
  /** Nutrition goals */
  nutritionGoals?: NutritionGoal;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Account verified */
  verified: boolean;
  /** Last login timestamp */
  lastLogin?: Date;
}

/**
 * Subscription tier
 */
export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
}

/**
 * Subscription status
 */
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL',
}

/**
 * User subscription
 */
export interface Subscription {
  /** Unique identifier */
  id: string;
  /** User ID */
  userId: string;
  /** Subscription tier */
  tier: SubscriptionTier;
  /** Subscription status */
  status: SubscriptionStatus;
  /** Start date */
  startDate: Date;
  /** End date */
  endDate: Date;
  /** Payment method */
  paymentMethod?: string;
  /** Auto-renew */
  autoRenew: boolean;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Session
 */
export interface Session {
  /** Session ID */
  id: string;
  /** User ID */
  userId: string;
  /** Token */
  token: string;
  /** Expiry date */
  expiresAt: Date;
  /** Device information */
  device?: string;
  /** IP address */
  ipAddress?: string;
  /** Creation timestamp */
  createdAt: Date;
}
