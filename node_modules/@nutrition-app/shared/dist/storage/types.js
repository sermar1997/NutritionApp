/**
 * Storage types
 */
/**
 * Storage provider types
 */
export var StorageType;
(function (StorageType) {
    StorageType["INDEXED_DB"] = "INDEXED_DB";
    StorageType["LOCAL_STORAGE"] = "LOCAL_STORAGE";
    StorageType["ASYNC_STORAGE"] = "ASYNC_STORAGE";
    StorageType["SQLITE"] = "SQLITE";
    StorageType["MEMORY"] = "MEMORY";
})(StorageType || (StorageType = {}));
/**
 * Storage entity type
 */
export var StorageEntity;
(function (StorageEntity) {
    StorageEntity["USER"] = "USER";
    StorageEntity["INGREDIENT"] = "INGREDIENT";
    StorageEntity["INVENTORY"] = "INVENTORY";
    StorageEntity["RECIPE"] = "RECIPE";
    StorageEntity["MEAL_PLAN"] = "MEAL_PLAN";
    StorageEntity["NUTRITION"] = "NUTRITION";
    StorageEntity["SUBSCRIPTION"] = "SUBSCRIPTION";
    StorageEntity["IMAGE"] = "IMAGE";
    StorageEntity["SETTINGS"] = "SETTINGS";
})(StorageEntity || (StorageEntity = {}));
/**
 * Storage operation type
 */
export var StorageOperation;
(function (StorageOperation) {
    StorageOperation["CREATE"] = "CREATE";
    StorageOperation["READ"] = "READ";
    StorageOperation["UPDATE"] = "UPDATE";
    StorageOperation["DELETE"] = "DELETE";
    StorageOperation["QUERY"] = "QUERY";
})(StorageOperation || (StorageOperation = {}));
