/**
 * Payment utilities
 */
import { CurrencyCode, PaymentMethod, PaymentStatus, PaymentTransaction, PaymentProvider } from './types';
/**
 * Format an amount for display based on currency
 * @param amount Amount to format
 * @param currency Currency code
 * @returns Formatted amount string
 */
export declare function formatCurrency(amount: number, currency: CurrencyCode): string;
/**
 * Calculate tax amount based on subtotal and tax rate
 * @param subtotal Subtotal amount
 * @param taxRate Tax rate percentage
 * @returns Tax amount
 */
export declare function calculateTax(subtotal: number, taxRate: number): number;
/**
 * Calculate total amount including tax
 * @param subtotal Subtotal amount
 * @param taxAmount Tax amount
 * @returns Total amount
 */
export declare function calculateTotal(subtotal: number, taxAmount: number): number;
/**
 * Get friendly payment method name
 * @param method Payment method
 * @returns User-friendly payment method name
 */
export declare function getPaymentMethodName(method: PaymentMethod): string;
/**
 * Get payment status description
 * @param status Payment status
 * @returns User-friendly status description
 */
export declare function getPaymentStatusDescription(status: PaymentStatus): string;
/**
 * Check if a transaction can be refunded
 * @param transaction Payment transaction
 * @returns True if transaction can be refunded
 */
export declare function canBeRefunded(transaction: PaymentTransaction): boolean;
/**
 * Generate a transaction reference ID
 * @param prefix Optional prefix for the reference
 * @returns Unique transaction reference ID
 */
export declare function generateTransactionReference(prefix?: string): string;
/**
 * Get payment provider API configuration based on environment
 * @param provider Payment provider
 * @param isProduction Whether this is production environment
 * @returns API configuration object
 */
export declare function getProviderConfig(provider: PaymentProvider, isProduction: boolean): Record<string, any>;
