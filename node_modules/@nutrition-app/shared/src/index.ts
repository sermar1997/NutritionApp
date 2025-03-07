/**
 * Main entry point for shared package
 * 
 * This file exports all the necessary modules for the application,
 * following the Clean Architecture pattern.
 */

// Export core domain models
export * from './core/models';

// Export core domain interfaces
export * from './core/domain/repositories';
export * from './core/domain/services';

// Export dependency injection container
export * from './core/di/container';

// Export infrastructure implementations
export * from './infrastructure/repositories';
export * from './infrastructure/services';
export * from './infrastructure/storage';
export * from './infrastructure/helpers';
// AI components are exported through feature modules

// Export utilities
export * from './utils';

// Export feature modules
export * from './inventory';
export * from './ai';
