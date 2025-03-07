/**
 * Core module index
 * 
 * The core module contains the essential elements of the application:
 * - Models: Domain entities and value objects
 * - Domain: Business logic, interfaces for repositories and services
 * - DI: Dependency injection container
 * 
 * This file exports everything from the core module for easier imports.
 */

// Models - Data structures and types
export * from './models';

// Domain - Business logic interfaces
export * from './domain/repositories';
export * from './domain/services';

// DI - Dependency injection
export { default as container } from './di/container';
