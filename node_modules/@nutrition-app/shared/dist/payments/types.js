/**
 * Payment module types
 */
/**
 * Payment methods
 */
export var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethod["DEBIT_CARD"] = "DEBIT_CARD";
    PaymentMethod["PAYPAL"] = "PAYPAL";
    PaymentMethod["APPLE_PAY"] = "APPLE_PAY";
    PaymentMethod["GOOGLE_PAY"] = "GOOGLE_PAY";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["IN_APP_PURCHASE"] = "IN_APP_PURCHASE";
})(PaymentMethod || (PaymentMethod = {}));
/**
 * Payment providers
 */
export var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["STRIPE"] = "STRIPE";
    PaymentProvider["PAYPAL"] = "PAYPAL";
    PaymentProvider["APPLE"] = "APPLE";
    PaymentProvider["GOOGLE"] = "GOOGLE";
    PaymentProvider["DIRECT"] = "DIRECT";
})(PaymentProvider || (PaymentProvider = {}));
/**
 * Payment status
 */
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
})(PaymentStatus || (PaymentStatus = {}));
/**
 * Transaction types
 */
export var TransactionType;
(function (TransactionType) {
    TransactionType["SUBSCRIPTION_PURCHASE"] = "SUBSCRIPTION_PURCHASE";
    TransactionType["SUBSCRIPTION_RENEWAL"] = "SUBSCRIPTION_RENEWAL";
    TransactionType["SUBSCRIPTION_CANCELLATION"] = "SUBSCRIPTION_CANCELLATION";
    TransactionType["REFUND"] = "REFUND";
})(TransactionType || (TransactionType = {}));
/**
 * Currency codes
 */
export var CurrencyCode;
(function (CurrencyCode) {
    CurrencyCode["USD"] = "USD";
    CurrencyCode["EUR"] = "EUR";
    CurrencyCode["GBP"] = "GBP";
    CurrencyCode["CAD"] = "CAD";
    CurrencyCode["AUD"] = "AUD";
    CurrencyCode["JPY"] = "JPY";
    CurrencyCode["CNY"] = "CNY";
    CurrencyCode["INR"] = "INR";
})(CurrencyCode || (CurrencyCode = {}));
