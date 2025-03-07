/**
 * Ingredient models
 *
 * Types and interfaces for ingredients and inventory items.
 */
/**
 * Ingredient category
 */
export var IngredientCategory;
(function (IngredientCategory) {
    IngredientCategory["FRUIT"] = "FRUIT";
    IngredientCategory["VEGETABLE"] = "VEGETABLE";
    IngredientCategory["MEAT"] = "MEAT";
    IngredientCategory["FISH"] = "FISH";
    IngredientCategory["DAIRY"] = "DAIRY";
    IngredientCategory["GRAIN"] = "GRAIN";
    IngredientCategory["LEGUME"] = "LEGUME";
    IngredientCategory["NUT"] = "NUT";
    IngredientCategory["HERB"] = "HERB";
    IngredientCategory["SPICE"] = "SPICE";
    IngredientCategory["OIL"] = "OIL";
    IngredientCategory["CONDIMENT"] = "CONDIMENT";
    IngredientCategory["SWEETENER"] = "SWEETENER";
    IngredientCategory["BAKING"] = "BAKING";
    IngredientCategory["BEVERAGE"] = "BEVERAGE";
    IngredientCategory["OTHER"] = "OTHER";
})(IngredientCategory || (IngredientCategory = {}));
/**
 * Unit of measurement
 */
export var UnitOfMeasurement;
(function (UnitOfMeasurement) {
    // Metric
    UnitOfMeasurement["GRAM"] = "GRAM";
    UnitOfMeasurement["KILOGRAM"] = "KILOGRAM";
    UnitOfMeasurement["MILLILITER"] = "MILLILITER";
    UnitOfMeasurement["LITER"] = "LITER";
    // Imperial
    UnitOfMeasurement["TEASPOON"] = "TEASPOON";
    UnitOfMeasurement["TABLESPOON"] = "TABLESPOON";
    UnitOfMeasurement["CUP"] = "CUP";
    UnitOfMeasurement["OUNCE"] = "OUNCE";
    UnitOfMeasurement["POUND"] = "POUND";
    // Other
    UnitOfMeasurement["PINCH"] = "PINCH";
    UnitOfMeasurement["PIECE"] = "PIECE";
    UnitOfMeasurement["SLICE"] = "SLICE";
    UnitOfMeasurement["WHOLE"] = "WHOLE";
})(UnitOfMeasurement || (UnitOfMeasurement = {}));
