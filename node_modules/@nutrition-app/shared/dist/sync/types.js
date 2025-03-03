/**
 * Sync related types
 */
/**
 * Available sync strategies
 */
export var SyncStrategy;
(function (SyncStrategy) {
    SyncStrategy["REALTIME"] = "REALTIME";
    SyncStrategy["PERIODIC"] = "PERIODIC";
    SyncStrategy["MANUAL"] = "MANUAL";
    SyncStrategy["CONNECTION_BASED"] = "CONNECTION_BASED";
})(SyncStrategy || (SyncStrategy = {}));
/**
 * Sync status
 */
export var SyncStatus;
(function (SyncStatus) {
    SyncStatus["IDLE"] = "IDLE";
    SyncStatus["SYNCING"] = "SYNCING";
    SyncStatus["ERROR"] = "ERROR";
    SyncStatus["SUCCESS"] = "SUCCESS";
})(SyncStatus || (SyncStatus = {}));
/**
 * Sync direction
 */
export var SyncDirection;
(function (SyncDirection) {
    SyncDirection["UPLOAD"] = "UPLOAD";
    SyncDirection["DOWNLOAD"] = "DOWNLOAD";
    SyncDirection["BIDIRECTIONAL"] = "BIDIRECTIONAL";
})(SyncDirection || (SyncDirection = {}));
/**
 * Entity to sync
 */
export var SyncEntity;
(function (SyncEntity) {
    SyncEntity["USER"] = "USER";
    SyncEntity["INGREDIENT"] = "INGREDIENT";
    SyncEntity["INVENTORY"] = "INVENTORY";
    SyncEntity["RECIPE"] = "RECIPE";
    SyncEntity["MEAL_PLAN"] = "MEAL_PLAN";
    SyncEntity["NUTRITION"] = "NUTRITION";
    SyncEntity["SUBSCRIPTION"] = "SUBSCRIPTION";
})(SyncEntity || (SyncEntity = {}));
/**
 * Sync operation
 */
export var SyncOperation;
(function (SyncOperation) {
    SyncOperation["CREATE"] = "CREATE";
    SyncOperation["UPDATE"] = "UPDATE";
    SyncOperation["DELETE"] = "DELETE";
})(SyncOperation || (SyncOperation = {}));
