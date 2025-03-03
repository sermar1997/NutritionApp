/**
 * Sync related types
 */
/**
 * Available sync strategies
 */
export declare enum SyncStrategy {
    REALTIME = "REALTIME",
    PERIODIC = "PERIODIC",
    MANUAL = "MANUAL",
    CONNECTION_BASED = "CONNECTION_BASED"
}
/**
 * Sync status
 */
export declare enum SyncStatus {
    IDLE = "IDLE",
    SYNCING = "SYNCING",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS"
}
/**
 * Sync direction
 */
export declare enum SyncDirection {
    UPLOAD = "UPLOAD",
    DOWNLOAD = "DOWNLOAD",
    BIDIRECTIONAL = "BIDIRECTIONAL"
}
/**
 * Entity to sync
 */
export declare enum SyncEntity {
    USER = "USER",
    INGREDIENT = "INGREDIENT",
    INVENTORY = "INVENTORY",
    RECIPE = "RECIPE",
    MEAL_PLAN = "MEAL_PLAN",
    NUTRITION = "NUTRITION",
    SUBSCRIPTION = "SUBSCRIPTION"
}
/**
 * Sync operation
 */
export declare enum SyncOperation {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
/**
 * Sync configuration
 */
export interface SyncConfig {
    strategy: SyncStrategy;
    entities: SyncEntity[];
    direction: SyncDirection;
    intervalMs?: number;
    maxRetries?: number;
    retryDelayMs?: number;
    conflictResolution: 'SERVER_WINS' | 'CLIENT_WINS' | 'NEWEST_WINS' | 'MANUAL';
}
/**
 * Sync event
 */
export interface SyncEvent {
    id: string;
    timestamp: Date;
    entity: SyncEntity;
    operation: SyncOperation;
    entityId: string;
    data: any;
    status: SyncStatus;
    error?: string;
    retryCount: number;
}
/**
 * Sync statistics
 */
export interface SyncStats {
    lastSyncTime?: Date;
    entitiesSynced: number;
    syncErrors: number;
    totalSyncTime: number;
    isCurrentlySyncing: boolean;
}
/**
 * Sync provider interface
 */
export interface SyncProvider {
    /**
     * Initialize the sync provider
     * @param config Sync configuration
     */
    initialize(config: SyncConfig): Promise<void>;
    /**
     * Start the sync process
     */
    start(): Promise<void>;
    /**
     * Stop the sync process
     */
    stop(): Promise<void>;
    /**
     * Trigger a manual sync
     * @param entities Optional entities to sync
     */
    sync(entities?: SyncEntity[]): Promise<void>;
    /**
     * Get current sync status and statistics
     */
    getStatus(): SyncStats;
    /**
     * Listen for sync events
     * @param listener Callback function for sync events
     */
    addListener(listener: (event: SyncEvent) => void): void;
    /**
     * Remove a sync event listener
     * @param listener Listener to remove
     */
    removeListener(listener: (event: SyncEvent) => void): void;
}
