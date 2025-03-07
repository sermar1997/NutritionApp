/**
 * User models
 *
 * Types and interfaces for user data, preferences, and authentication.
 */
/**
 * User role
 */
export var UserRole;
(function (UserRole) {
    UserRole["GUEST"] = "GUEST";
    UserRole["USER"] = "USER";
    UserRole["PREMIUM"] = "PREMIUM";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
/**
 * Measurement system preference
 */
export var MeasurementSystem;
(function (MeasurementSystem) {
    MeasurementSystem["METRIC"] = "METRIC";
    MeasurementSystem["IMPERIAL"] = "IMPERIAL";
})(MeasurementSystem || (MeasurementSystem = {}));
/**
 * Theme preference
 */
export var Theme;
(function (Theme) {
    Theme["LIGHT"] = "LIGHT";
    Theme["DARK"] = "DARK";
    Theme["SYSTEM"] = "SYSTEM";
})(Theme || (Theme = {}));
/**
 * Subscription tier
 */
export var SubscriptionTier;
(function (SubscriptionTier) {
    SubscriptionTier["FREE"] = "FREE";
    SubscriptionTier["BASIC"] = "BASIC";
    SubscriptionTier["PREMIUM"] = "PREMIUM";
})(SubscriptionTier || (SubscriptionTier = {}));
/**
 * Subscription status
 */
export var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["CANCELED"] = "CANCELED";
    SubscriptionStatus["EXPIRED"] = "EXPIRED";
    SubscriptionStatus["TRIAL"] = "TRIAL";
})(SubscriptionStatus || (SubscriptionStatus = {}));
