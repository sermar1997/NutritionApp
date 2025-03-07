/**
 * Payment utilities
 */
import { CurrencyCode, PaymentMethod, PaymentStatus, PaymentProvider, TransactionType } from './types';
/**
 * Format an amount for display based on currency
 * @param amount Amount to format
 * @param currency Currency code
 * @returns Formatted amount string
 */
export function formatCurrency(amount, currency) {
    // Different currencies have different formatting rules
    switch (currency) {
        case CurrencyCode.USD:
            return `$${amount.toFixed(2)}`;
        case CurrencyCode.EUR:
            return `€${amount.toFixed(2)}`;
        case CurrencyCode.GBP:
            return `£${amount.toFixed(2)}`;
        case CurrencyCode.JPY:
            return `¥${Math.round(amount)}`; // JPY doesn't typically use decimals
        case CurrencyCode.CAD:
            return `CA$${amount.toFixed(2)}`;
        case CurrencyCode.AUD:
            return `A$${amount.toFixed(2)}`;
        case CurrencyCode.CNY:
            return `CN¥${amount.toFixed(2)}`;
        case CurrencyCode.INR:
            return `₹${amount.toFixed(2)}`;
        default:
            return `${amount.toFixed(2)} ${currency}`;
    }
}
/**
 * Calculate tax amount based on subtotal and tax rate
 * @param subtotal Subtotal amount
 * @param taxRate Tax rate percentage
 * @returns Tax amount
 */
export function calculateTax(subtotal, taxRate) {
    return subtotal * (taxRate / 100);
}
/**
 * Calculate total amount including tax
 * @param subtotal Subtotal amount
 * @param taxAmount Tax amount
 * @returns Total amount
 */
export function calculateTotal(subtotal, taxAmount) {
    return subtotal + taxAmount;
}
/**
 * Get friendly payment method name
 * @param method Payment method
 * @returns User-friendly payment method name
 */
export function getPaymentMethodName(method) {
    switch (method) {
        case PaymentMethod.CREDIT_CARD:
            return 'Credit Card';
        case PaymentMethod.DEBIT_CARD:
            return 'Debit Card';
        case PaymentMethod.PAYPAL:
            return 'PayPal';
        case PaymentMethod.APPLE_PAY:
            return 'Apple Pay';
        case PaymentMethod.GOOGLE_PAY:
            return 'Google Pay';
        case PaymentMethod.BANK_TRANSFER:
            return 'Bank Transfer';
        case PaymentMethod.IN_APP_PURCHASE:
            return 'In-App Purchase';
        default:
            return 'Unknown Payment Method';
    }
}
/**
 * Get payment status description
 * @param status Payment status
 * @returns User-friendly status description
 */
export function getPaymentStatusDescription(status) {
    switch (status) {
        case PaymentStatus.PENDING:
            return 'Waiting for payment';
        case PaymentStatus.PROCESSING:
            return 'Processing payment';
        case PaymentStatus.COMPLETED:
            return 'Payment completed';
        case PaymentStatus.FAILED:
            return 'Payment failed';
        case PaymentStatus.REFUNDED:
            return 'Payment refunded';
        case PaymentStatus.CANCELLED:
            return 'Payment cancelled';
        default:
            return 'Unknown status';
    }
}
/**
 * Check if a transaction can be refunded
 * @param transaction Payment transaction
 * @returns True if transaction can be refunded
 */
export function canBeRefunded(transaction) {
    // We can only refund successful transactions
    if (transaction.status !== PaymentStatus.COMPLETED) {
        return false;
    }
    // Some transaction types cannot be refunded
    if (transaction.transactionType === TransactionType.REFUND) {
        return false;
    }
    // Check if the transaction is recent enough to be refunded
    // Many payment processors have a time limit for refunds
    const now = new Date();
    const completedAt = transaction.completedAt || transaction.updatedAt;
    const timeDiff = now.getTime() - completedAt.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    // Typical refund window is 30-90 days depending on provider
    return daysDiff <= 60; // Using 60 days as a reasonable default
}
/**
 * Generate a transaction reference ID
 * @param prefix Optional prefix for the reference
 * @returns Unique transaction reference ID
 */
export function generateTransactionReference(prefix = 'TXN') {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${randomStr}`;
}
/**
 * Get payment provider API configuration based on environment
 * @param provider Payment provider
 * @param isProduction Whether this is production environment
 * @returns API configuration object
 */
export function getProviderConfig(provider, isProduction) {
    // In a real application, these would be loaded from environment variables
    // This is just a simplified example
    switch (provider) {
        case PaymentProvider.STRIPE:
            return {
                apiKey: isProduction ? 'sk_prod_123456789' : 'sk_test_123456789',
                publicKey: isProduction ? 'pk_prod_123456789' : 'pk_test_123456789',
                apiVersion: '2022-11-15',
                webhookSecret: isProduction ? 'whsec_prod_123456789' : 'whsec_test_123456789',
            };
        case PaymentProvider.PAYPAL:
            return {
                clientId: isProduction ? 'client_prod_123456789' : 'client_test_123456789',
                secret: isProduction ? 'secret_prod_123456789' : 'secret_test_123456789',
                environment: isProduction ? 'live' : 'sandbox',
            };
        case PaymentProvider.APPLE:
            return {
                merchantId: 'merchant.com.nutritionapp.app',
                environment: isProduction ? 'Production' : 'Sandbox',
            };
        case PaymentProvider.GOOGLE:
            return {
                merchantId: isProduction ? 'prod_merchant_123456789' : 'test_merchant_123456789',
                merchantName: 'Nutrition App',
            };
        default:
            return {};
    }
}
