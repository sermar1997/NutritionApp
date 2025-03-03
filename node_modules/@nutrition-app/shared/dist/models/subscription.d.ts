/**
 * Subscription models
 */
/**
 * Subscription payment provider
 */
export declare enum PaymentProvider {
    STRIPE = "STRIPE",
    APPLE = "APPLE",
    GOOGLE = "GOOGLE"
}
/**
 * Subscription status
 */
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    CANCELED = "CANCELED",
    EXPIRED = "EXPIRED",
    TRIAL = "TRIAL",
    PENDING = "PENDING"
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
export declare enum SubscriptionLevel {
    FREE = "FREE",
    PREMIUM = "PREMIUM",
    PREMIUM_PLUS = "PREMIUM_PLUS"
}
/**
 * User subscription
 */
export interface UserSubscription {
    id: string;
    userId: string;
    level: SubscriptionLevel;
    status: SubscriptionStatus;
    provider: PaymentProvider;
    providerSubscriptionId?: string;
    startDate: Date;
    endDate: Date;
    isAutoRenew: boolean;
    canceledAt?: Date;
    trialEndDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
