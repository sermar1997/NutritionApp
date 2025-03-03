/**
 * Payment module types
 */
/**
 * Payment methods
 */
export declare enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    PAYPAL = "PAYPAL",
    APPLE_PAY = "APPLE_PAY",
    GOOGLE_PAY = "GOOGLE_PAY",
    BANK_TRANSFER = "BANK_TRANSFER",
    IN_APP_PURCHASE = "IN_APP_PURCHASE"
}
/**
 * Payment providers
 */
export declare enum PaymentProvider {
    STRIPE = "STRIPE",
    PAYPAL = "PAYPAL",
    APPLE = "APPLE",
    GOOGLE = "GOOGLE",
    DIRECT = "DIRECT"
}
/**
 * Payment status
 */
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED"
}
/**
 * Transaction types
 */
export declare enum TransactionType {
    SUBSCRIPTION_PURCHASE = "SUBSCRIPTION_PURCHASE",
    SUBSCRIPTION_RENEWAL = "SUBSCRIPTION_RENEWAL",
    SUBSCRIPTION_CANCELLATION = "SUBSCRIPTION_CANCELLATION",
    REFUND = "REFUND"
}
/**
 * Currency codes
 */
export declare enum CurrencyCode {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    CAD = "CAD",
    AUD = "AUD",
    JPY = "JPY",
    CNY = "CNY",
    INR = "INR"
}
/**
 * Price tier interface
 */
export interface PriceTier {
    id: string;
    name: string;
    amount: number;
    currency: CurrencyCode;
    description: string;
    isDefault?: boolean;
}
/**
 * Payment transaction interface
 */
export interface PaymentTransaction {
    id: string;
    userId: string;
    transactionType: TransactionType;
    paymentMethod: PaymentMethod;
    paymentProvider: PaymentProvider;
    amount: number;
    currency: CurrencyCode;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    providerTransactionId?: string;
    subscriptionId?: string;
    planId?: string;
    metadata?: Record<string, string>;
    receiptUrl?: string;
    failureReason?: string;
}
/**
 * Customer payment method interface
 */
export interface CustomerPaymentMethod {
    id: string;
    userId: string;
    type: PaymentMethod;
    provider: PaymentProvider;
    isDefault: boolean;
    lastFour?: string;
    expiryMonth?: number;
    expiryYear?: number;
    cardBrand?: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
    providerPaymentMethodId: string;
    billingAddress?: BillingAddress;
}
/**
 * Billing address interface
 */
export interface BillingAddress {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
}
/**
 * Payment receipt interface
 */
export interface PaymentReceipt {
    id: string;
    transactionId: string;
    userId: string;
    receiptNumber: string;
    items: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }>;
    subtotal: number;
    tax?: number;
    total: number;
    currency: CurrencyCode;
    issueDate: Date;
    pdfUrl?: string;
    emailSent?: boolean;
}
/**
 * Payment provider configuration
 */
export interface PaymentProviderConfig {
    provider: PaymentProvider;
    apiKey?: string;
    publicKey?: string;
    webhookSecret?: string;
    isTestMode: boolean;
    supportedMethods: PaymentMethod[];
}
/**
 * Payment error interface
 */
export interface PaymentError {
    code: string;
    message: string;
    providerCode?: string;
    transactionId?: string;
    timestamp: Date;
}
