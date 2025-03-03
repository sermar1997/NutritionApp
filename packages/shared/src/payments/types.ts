/**
 * Payment module types
 */

/**
 * Payment methods
 */
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  IN_APP_PURCHASE = 'IN_APP_PURCHASE',
}

/**
 * Payment providers
 */
export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  APPLE = 'APPLE',
  GOOGLE = 'GOOGLE',
  DIRECT = 'DIRECT',
}

/**
 * Payment status
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

/**
 * Transaction types
 */
export enum TransactionType {
  SUBSCRIPTION_PURCHASE = 'SUBSCRIPTION_PURCHASE',
  SUBSCRIPTION_RENEWAL = 'SUBSCRIPTION_RENEWAL',
  SUBSCRIPTION_CANCELLATION = 'SUBSCRIPTION_CANCELLATION',
  REFUND = 'REFUND',
}

/**
 * Currency codes
 */
export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  JPY = 'JPY',
  CNY = 'CNY',
  INR = 'INR',
}

/**
 * Price tier interface
 */
export interface PriceTier {
  id: string;                  // Unique identifier
  name: string;                // Name of the price tier
  amount: number;              // Price amount
  currency: CurrencyCode;      // Currency code
  description: string;         // Price tier description
  isDefault?: boolean;         // Whether this is the default tier
}

/**
 * Payment transaction interface
 */
export interface PaymentTransaction {
  id: string;                  // Unique identifier
  userId: string;              // User making the payment
  transactionType: TransactionType;  // Type of transaction
  paymentMethod: PaymentMethod; // Method used for payment
  paymentProvider: PaymentProvider; // Provider handling the payment
  amount: number;              // Transaction amount
  currency: CurrencyCode;      // Currency code
  status: PaymentStatus;       // Current status
  createdAt: Date;             // When the transaction was created
  updatedAt: Date;             // When the transaction was last updated
  completedAt?: Date;          // When the transaction was completed
  providerTransactionId?: string; // ID from the payment provider
  subscriptionId?: string;     // Related subscription ID if applicable
  planId?: string;             // Related plan ID if applicable
  metadata?: Record<string, string>; // Additional transaction data
  receiptUrl?: string;         // URL to transaction receipt
  failureReason?: string;      // Reason for failure if applicable
}

/**
 * Customer payment method interface
 */
export interface CustomerPaymentMethod {
  id: string;                  // Unique identifier
  userId: string;              // User this payment method belongs to
  type: PaymentMethod;         // Type of payment method
  provider: PaymentProvider;   // Provider for this payment method
  isDefault: boolean;          // Whether this is the default payment method
  lastFour?: string;           // Last four digits (for cards)
  expiryMonth?: number;        // Expiry month (for cards)
  expiryYear?: number;         // Expiry year (for cards)
  cardBrand?: string;          // Card brand (for cards)
  email?: string;              // Email (for PayPal)
  createdAt: Date;             // When the payment method was created
  updatedAt: Date;             // When the payment method was last updated
  providerPaymentMethodId: string; // ID from the payment provider
  billingAddress?: BillingAddress; // Billing address
}

/**
 * Billing address interface
 */
export interface BillingAddress {
  line1: string;               // Address line 1
  line2?: string;              // Address line 2
  city: string;                // City
  state?: string;              // State or province
  postalCode: string;          // Postal or ZIP code
  country: string;             // Country
}

/**
 * Payment receipt interface
 */
export interface PaymentReceipt {
  id: string;                  // Unique identifier
  transactionId: string;       // Related transaction ID
  userId: string;              // User ID
  receiptNumber: string;       // Receipt number
  items: Array<{               // Items on the receipt
    description: string;       // Item description
    quantity: number;          // Item quantity
    unitPrice: number;         // Price per unit
    amount: number;            // Total amount
  }>;
  subtotal: number;            // Subtotal amount
  tax?: number;                // Tax amount if applicable
  total: number;               // Total amount
  currency: CurrencyCode;      // Currency code
  issueDate: Date;             // When the receipt was issued
  pdfUrl?: string;             // URL to PDF version
  emailSent?: boolean;         // Whether receipt was emailed
}

/**
 * Payment provider configuration
 */
export interface PaymentProviderConfig {
  provider: PaymentProvider;   // Payment provider
  apiKey?: string;             // API key (server-side)
  publicKey?: string;          // Public key (client-side)
  webhookSecret?: string;      // Webhook secret
  isTestMode: boolean;         // Whether in test mode
  supportedMethods: PaymentMethod[]; // Supported payment methods
}

/**
 * Payment error interface
 */
export interface PaymentError {
  code: string;                // Error code
  message: string;             // Error message
  providerCode?: string;       // Provider-specific error code
  transactionId?: string;      // Related transaction ID
  timestamp: Date;             // When the error occurred
}
