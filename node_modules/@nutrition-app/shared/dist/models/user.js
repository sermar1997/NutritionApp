/**
 * User models
 */
/**
 * Dietary preferences
 */
export var DietaryPreference;
(function (DietaryPreference) {
    DietaryPreference["OMNIVORE"] = "OMNIVORE";
    DietaryPreference["VEGETARIAN"] = "VEGETARIAN";
    DietaryPreference["VEGAN"] = "VEGAN";
    DietaryPreference["PESCATARIAN"] = "PESCATARIAN";
    DietaryPreference["KETO"] = "KETO";
    DietaryPreference["PALEO"] = "PALEO";
    DietaryPreference["LOW_CARB"] = "LOW_CARB";
    DietaryPreference["LOW_FAT"] = "LOW_FAT";
    DietaryPreference["GLUTEN_FREE"] = "GLUTEN_FREE";
    DietaryPreference["DAIRY_FREE"] = "DAIRY_FREE";
})(DietaryPreference || (DietaryPreference = {}));
/**
 * User allergies
 */
export var Allergy;
(function (Allergy) {
    Allergy["GLUTEN"] = "GLUTEN";
    Allergy["DAIRY"] = "DAIRY";
    Allergy["NUTS"] = "NUTS";
    Allergy["EGGS"] = "EGGS";
    Allergy["SOY"] = "SOY";
    Allergy["FISH"] = "FISH";
    Allergy["SHELLFISH"] = "SHELLFISH";
    Allergy["WHEAT"] = "WHEAT";
    Allergy["PEANUTS"] = "PEANUTS";
    Allergy["TREE_NUTS"] = "TREE_NUTS";
})(Allergy || (Allergy = {}));
/**
 * User subscription level
 */
export var SubscriptionLevel;
(function (SubscriptionLevel) {
    SubscriptionLevel["FREE"] = "FREE";
    SubscriptionLevel["PREMIUM"] = "PREMIUM";
    SubscriptionLevel["PREMIUM_PLUS"] = "PREMIUM_PLUS";
})(SubscriptionLevel || (SubscriptionLevel = {}));
