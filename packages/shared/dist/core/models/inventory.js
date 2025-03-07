/**
 * Inventory Models
 *
 * Defines the data models for inventory management.
 */
/**
 * Inventory item status
 */
export var InventoryItemStatus;
(function (InventoryItemStatus) {
    InventoryItemStatus["AVAILABLE"] = "AVAILABLE";
    InventoryItemStatus["LOW"] = "LOW";
    InventoryItemStatus["EXPIRED"] = "EXPIRED";
    InventoryItemStatus["OUT_OF_STOCK"] = "OUT_OF_STOCK";
})(InventoryItemStatus || (InventoryItemStatus = {}));
/**
 * Inventory location in kitchen
 */
export var StorageLocation;
(function (StorageLocation) {
    StorageLocation["REFRIGERATOR"] = "REFRIGERATOR";
    StorageLocation["FREEZER"] = "FREEZER";
    StorageLocation["PANTRY"] = "PANTRY";
    StorageLocation["SPICE_RACK"] = "SPICE_RACK";
    StorageLocation["OTHER"] = "OTHER";
})(StorageLocation || (StorageLocation = {}));
/**
 * Inventory change type
 */
export var InventoryChangeType;
(function (InventoryChangeType) {
    InventoryChangeType["ADDED"] = "ADDED";
    InventoryChangeType["REMOVED"] = "REMOVED";
    InventoryChangeType["UPDATED"] = "UPDATED";
    InventoryChangeType["EXPIRED"] = "EXPIRED";
    InventoryChangeType["USED_IN_RECIPE"] = "USED_IN_RECIPE";
    InventoryChangeType["PURCHASED"] = "PURCHASED";
    InventoryChangeType["WASTED"] = "WASTED";
    InventoryChangeType["DONATED"] = "DONATED";
    InventoryChangeType["OTHER"] = "OTHER";
})(InventoryChangeType || (InventoryChangeType = {}));
/**
 * Inventory alert types
 */
export var InventoryAlertType;
(function (InventoryAlertType) {
    InventoryAlertType["EXPIRING_SOON"] = "EXPIRING_SOON";
    InventoryAlertType["EXPIRED"] = "EXPIRED";
    InventoryAlertType["LOW_STOCK"] = "LOW_STOCK";
    InventoryAlertType["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    InventoryAlertType["PRICE_DROP"] = "PRICE_DROP";
    InventoryAlertType["RESTOCKED"] = "RESTOCKED";
    InventoryAlertType["CONSUMPTION_TREND"] = "CONSUMPTION_TREND";
})(InventoryAlertType || (InventoryAlertType = {}));
