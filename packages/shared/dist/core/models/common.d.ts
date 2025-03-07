/**
 * Common models and interfaces
 *
 * Shared types used across multiple modules.
 */
/**
 * Base entity with common fields
 */
export interface BaseEntity {
    /** Unique identifier */
    id: string;
    /** Creation timestamp */
    createdAt: Date;
    /** Last update timestamp */
    updatedAt: Date;
}
/**
 * Response for paginated queries
 */
export interface PaginatedResponse<T> {
    /** Page items */
    items: T[];
    /** Total number of items */
    total: number;
    /** Current page number */
    page: number;
    /** Number of items per page */
    pageSize: number;
    /** Whether there are more pages */
    hasMore: boolean;
}
/**
 * Result type for asynchronous operations
 */
export type Result<T, E = Error> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
/**
 * Coordinates (latitude, longitude)
 */
export interface Coordinates {
    /** Latitude */
    latitude: number;
    /** Longitude */
    longitude: number;
}
/**
 * Type for representing an image in different contexts
 */
export type ImageSource = {
    type: 'url';
    value: string;
} | {
    type: 'blob';
    value: Blob;
} | {
    type: 'base64';
    value: string;
} | {
    type: 'file';
    value: File;
};
/**
 * Generic type for a data snapshot
 */
export interface Snapshot<T> {
    /** Data */
    data: T;
    /** Timestamp */
    timestamp: number;
    /** Version */
    version: string;
}
