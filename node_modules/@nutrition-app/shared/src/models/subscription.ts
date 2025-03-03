/**
 * Subscription models
 */

/**
 * Subscription payment provider
 */
export enum SubscriptionPaymentProvider {
  STRIPE = 'STRIPE',
  APPLE = 'APPLE',
  GOOGLE = 'GOOGLE',
}

/**
 * Subscription status
 */
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL',
  PENDING = 'PENDING',
}

/**
 * Subscription feature
 */
export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  isAvailableInFreeTier: boolean;
}

/**
 * Subscription plan
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  level: SubscriptionLevel;
  priceMonthly: number;
  priceYearly: number;
  features: SubscriptionFeature[];
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  applePriceIdMonthly?: string;
  applePriceIdYearly?: string;
  googlePriceIdMonthly?: string;
  googlePriceIdYearly?: string;
}

/**
 * Subscription level
 */
export enum SubscriptionLevel {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  PREMIUM_PLUS = 'PREMIUM_PLUS',
}

/**
 * User subscription
 */
export interface UserSubscription {
  id: string;
  userId: string;
  level: SubscriptionLevel;
  status: SubscriptionStatus;
  provider: SubscriptionPaymentProvider;
  providerSubscriptionId?: string;
  startDate: Date;
  endDate: Date;
  isAutoRenew: boolean;
  canceledAt?: Date;
  trialEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
