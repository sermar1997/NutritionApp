/**
 * Sync strategies implementation
 */
import { SyncConfig, SyncEntity, SyncEvent, SyncOperation, SyncProvider, SyncStats, SyncStatus, SyncStrategy } from './types';
/**
 * Base class for sync strategies
 */
export declare abstract class BaseSyncStrategy implements SyncProvider {
    protected config: SyncConfig;
    protected listeners: Array<(event: SyncEvent) => void>;
    protected stats: SyncStats;
    /**
     * Initialize the sync provider with configuration
     * @param config Sync configuration
     */
    initialize(config: SyncConfig): Promise<void>;
    /**
     * Abstract method to start sync process
     */
    abstract start(): Promise<void>;
    /**
     * Abstract method to stop sync process
     */
    abstract stop(): Promise<void>;
    /**
     * Abstract method to trigger manual sync
     */
    abstract sync(entities?: SyncEntity[]): Promise<void>;
    /**
     * Get current sync status and statistics
     */
    getStatus(): SyncStats;
    /**
     * Add a sync event listener
     * @param listener Callback function for sync events
     */
    addListener(listener: (event: SyncEvent) => void): void;
    /**
     * Remove a sync event listener
     * @param listener Listener to remove
     */
    removeListener(listener: (event: SyncEvent) => void): void;
    /**
     * Notify all listeners of a sync event
     * @param event Sync event
     */
    protected notifyListeners(event: SyncEvent): void;
    /**
     * Create a new sync event
     * @param entity Entity type
     * @param operation Operation type
     * @param entityId Entity ID
     * @param data Entity data
     * @param status Sync status
     * @param error Optional error message
     * @returns Sync event object
     */
    protected createEvent(entity: SyncEntity, operation: SyncOperation, entityId: string, data: any, status: SyncStatus, error?: string): SyncEvent;
}
/**
 * Real-time sync strategy implementation
 */
export declare class RealtimeSyncStrategy extends BaseSyncStrategy {
    private connection;
    /**
     * Start real-time sync
     */
    start(): Promise<void>;
    /**
     * Stop real-time sync
     */
    stop(): Promise<void>;
    /**
     * Force sync of specific entities
     */
    sync(entities?: SyncEntity[]): Promise<void>;
}
/**
 * Periodic sync strategy implementation
 */
export declare class PeriodicSyncStrategy extends BaseSyncStrategy {
    private intervalId;
    /**
     * Start periodic sync
     */
    start(): Promise<void>;
    /**
     * Stop periodic sync
     */
    stop(): Promise<void>;
    /**
     * Perform sync operation
     */
    sync(entities?: SyncEntity[]): Promise<void>;
}
/**
 * Connection-based sync strategy that syncs when the device comes online
 */
export declare class ConnectionBasedSyncStrategy extends BaseSyncStrategy {
    private isOnline;
    private pendingSyncRequired;
    /**
     * Start connection-based sync
     */
    start(): Promise<void>;
    /**
     * Stop connection-based sync
     */
    stop(): Promise<void>;
    /**
     * Handle coming online
     */
    private handleOnline;
    /**
     * Handle going offline
     */
    private handleOffline;
    /**
     * Perform sync if online or mark pending if offline
     */
    sync(entities?: SyncEntity[]): Promise<void>;
}
/**
 * Factory function to create the appropriate sync strategy
 * @param strategy Strategy type
 * @param config Sync configuration
 * @returns Sync provider instance
 */
export declare function createSyncStrategy(strategy: SyncStrategy, config: SyncConfig): SyncProvider;
