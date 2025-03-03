/**
 * Sync strategies implementation
 */

import { SyncConfig, SyncEntity, SyncEvent, SyncOperation, SyncProvider, SyncStats, SyncStatus, SyncStrategy } from './types';

/**
 * Base class for sync strategies
 */
export abstract class BaseSyncStrategy implements SyncProvider {
  protected config: SyncConfig = {} as SyncConfig;
  protected listeners: Array<(event: SyncEvent) => void> = [];
  protected stats: SyncStats = {
    entitiesSynced: 0,
    syncErrors: 0,
    totalSyncTime: 0,
    isCurrentlySyncing: false
  };

  /**
   * Initialize the sync provider with configuration
   * @param config Sync configuration
   */
  async initialize(config: SyncConfig): Promise<void> {
    this.config = config;
  }

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
  getStatus(): SyncStats {
    return { ...this.stats };
  }

  /**
   * Add a sync event listener
   * @param listener Callback function for sync events
   */
  addListener(listener: (event: SyncEvent) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove a sync event listener
   * @param listener Listener to remove
   */
  removeListener(listener: (event: SyncEvent) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners of a sync event
   * @param event Sync event
   */
  protected notifyListeners(event: SyncEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in sync event listener:', error);
      }
    });
  }

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
  protected createEvent(
    entity: SyncEntity,
    operation: SyncOperation,
    entityId: string,
    data: any,
    status: SyncStatus,
    error?: string
  ): SyncEvent {
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      timestamp: new Date(),
      entity,
      operation,
      entityId,
      data,
      status,
      error,
      retryCount: 0
    };
  }
}

/**
 * Real-time sync strategy implementation
 */
export class RealtimeSyncStrategy extends BaseSyncStrategy {
  private connection: any; // Would be the actual connection object in implementation

  /**
   * Start real-time sync
   */
  async start(): Promise<void> {
    // Implementation would connect to real-time service like WebSockets
    // and set up listeners for changes from server
    this.stats.isCurrentlySyncing = true;
  }

  /**
   * Stop real-time sync
   */
  async stop(): Promise<void> {
    if (this.connection) {
      // Disconnect from real-time service
      this.connection = null;
    }
    this.stats.isCurrentlySyncing = false;
  }

  /**
   * Force sync of specific entities
   */
  async sync(entities?: SyncEntity[]): Promise<void> {
    const entitiesToSync = entities || this.config.entities;
    
    // Implementation would fetch latest data for these entities
    // and then push local changes that haven't been synced
    
    this.stats.lastSyncTime = new Date();
    this.stats.entitiesSynced += entitiesToSync.length;
  }
}

/**
 * Periodic sync strategy implementation
 */
export class PeriodicSyncStrategy extends BaseSyncStrategy {
  private intervalId: any; // NodeJS.Timeout in browser/node

  /**
   * Start periodic sync
   */
  async start(): Promise<void> {
    const interval = this.config.intervalMs || 60000; // Default to 1 minute
    
    this.intervalId = setInterval(async () => {
      await this.sync();
    }, interval);
  }

  /**
   * Stop periodic sync
   */
  async stop(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.stats.isCurrentlySyncing = false;
  }

  /**
   * Perform sync operation
   */
  async sync(entities?: SyncEntity[]): Promise<void> {
    if (this.stats.isCurrentlySyncing) {
      return; // Already syncing
    }
    
    this.stats.isCurrentlySyncing = true;
    const startTime = Date.now();
    
    try {
      const entitiesToSync = entities || this.config.entities;
      
      // Implementation would sync each entity type
      // First download changes, then upload local changes
      
      this.stats.entitiesSynced += entitiesToSync.length;
      this.stats.lastSyncTime = new Date();
      
      // Notify success
      entitiesToSync.forEach(entity => {
        this.notifyListeners(
          this.createEvent(
            entity,
            SyncOperation.UPDATE,
            'batch',
            { synced: true },
            SyncStatus.SUCCESS
          )
        );
      });
    } catch (error) {
      this.stats.syncErrors += 1;
      
      // Notify error
      this.notifyListeners(
        this.createEvent(
          SyncEntity.USER, // Generic error
          SyncOperation.UPDATE,
          'batch',
          { error },
          SyncStatus.ERROR,
          error instanceof Error ? error.message : String(error)
        )
      );
    } finally {
      this.stats.isCurrentlySyncing = false;
      this.stats.totalSyncTime += Date.now() - startTime;
    }
  }
}

/**
 * Connection-based sync strategy that syncs when the device comes online
 */
export class ConnectionBasedSyncStrategy extends BaseSyncStrategy {
  private isOnline: boolean = true;
  private pendingSyncRequired: boolean = false;
  
  /**
   * Start connection-based sync
   */
  async start(): Promise<void> {
    // Add network status listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      
      // Initial check
      this.isOnline = navigator.onLine;
      
      if (this.isOnline) {
        await this.sync();
      } else {
        this.pendingSyncRequired = true;
      }
    }
  }
  
  /**
   * Stop connection-based sync
   */
  async stop(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }
  
  /**
   * Handle coming online
   */
  private handleOnline = async () => {
    this.isOnline = true;
    
    if (this.pendingSyncRequired) {
      await this.sync();
      this.pendingSyncRequired = false;
    }
  };
  
  /**
   * Handle going offline
   */
  private handleOffline = () => {
    this.isOnline = false;
  };
  
  /**
   * Perform sync if online or mark pending if offline
   */
  async sync(entities?: SyncEntity[]): Promise<void> {
    if (!this.isOnline) {
      this.pendingSyncRequired = true;
      return;
    }
    
    // Similar implementation to PeriodicSyncStrategy.sync()
    if (this.stats.isCurrentlySyncing) {
      return; // Already syncing
    }
    
    this.stats.isCurrentlySyncing = true;
    const startTime = Date.now();
    
    try {
      const entitiesToSync = entities || this.config.entities;
      
      // Implementation would sync each entity type
      
      this.stats.entitiesSynced += entitiesToSync.length;
      this.stats.lastSyncTime = new Date();
      
      // Notify success
      entitiesToSync.forEach(entity => {
        this.notifyListeners(
          this.createEvent(
            entity,
            SyncOperation.UPDATE,
            'batch',
            { synced: true },
            SyncStatus.SUCCESS
          )
        );
      });
    } catch (error) {
      this.stats.syncErrors += 1;
      
      // Notify error
      this.notifyListeners(
        this.createEvent(
          SyncEntity.USER, // Generic error
          SyncOperation.UPDATE,
          'batch',
          { error },
          SyncStatus.ERROR,
          error instanceof Error ? error.message : String(error)
        )
      );
    } finally {
      this.stats.isCurrentlySyncing = false;
      this.stats.totalSyncTime += Date.now() - startTime;
    }
  }
}

/**
 * Factory function to create the appropriate sync strategy
 * @param strategy Strategy type
 * @returns Sync provider instance
 */
export function createSyncStrategy(strategy: SyncStrategy): SyncProvider {
  switch (strategy) {
    case SyncStrategy.REALTIME:
      return new RealtimeSyncStrategy();
    
    case SyncStrategy.PERIODIC:
      return new PeriodicSyncStrategy();
    
    case SyncStrategy.CONNECTION_BASED:
      return new ConnectionBasedSyncStrategy();
    
    case SyncStrategy.MANUAL:
      // The base strategy is essentially manual since it does nothing automatically
      return new PeriodicSyncStrategy(); // We're reusing PeriodicSyncStrategy but won't start the interval
    
    default:
      throw new Error(`Unsupported sync strategy: ${strategy}`);
  }
}
