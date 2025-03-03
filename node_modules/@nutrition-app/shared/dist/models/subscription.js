/**
 * Subscription models
 */
/**
 * Subscription payment provider
 */
export var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["STRIPE"] = "STRIPE";
    PaymentProvider["APPLE"] = "APPLE";
    PaymentProvider["GOOGLE"] = "GOOGLE";
})(PaymentProvider || (PaymentProvider = {}));
/**
 * Subscription status
 */
export var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["CANCELED"] = "CANCELED";
    SubscriptionStatus["EXPIRED"] = "EXPIRED";
    SubscriptionStatus["TRIAL"] = "TRIAL";
    SubscriptionStatus["PENDING"] = "PENDING";
})(SubscriptionStatus || (SubscriptionStatus = {}));
/**
 * Subscription level
 */
export var SubscriptionLevel;
(function (SubscriptionLevel) {
    SubscriptionLevel["FREE"] = "FREE";
    SubscriptionLevel["PREMIUM"] = "PREMIUM";
    SubscriptionLevel["PREMIUM_PLUS"] = "PREMIUM_PLUS";
})(SubscriptionLevel || (SubscriptionLevel = {}));
