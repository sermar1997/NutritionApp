/**
 * Inventory module types
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
    InventoryChangeType["USED"] = "USED";
    InventoryChangeType["EXPIRED"] = "EXPIRED";
    InventoryChangeType["PURCHASED"] = "PURCHASED";
})(InventoryChangeType || (InventoryChangeType = {}));
/**
 * Inventory alert types
 */
export var InventoryAlertType;
(function (InventoryAlertType) {
    InventoryAlertType["EXPIRATION"] = "EXPIRATION";
    InventoryAlertType["LOW_STOCK"] = "LOW_STOCK";
    InventoryAlertType["OUT_OF_STOCK"] = "OUT_OF_STOCK";
})(InventoryAlertType || (InventoryAlertType = {}));
