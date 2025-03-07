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
export * from './models';
export * from './domain/repositories';
export * from './domain/services';
export { default as container } from './di/container';
