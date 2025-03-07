/**
 * Main entry point for shared package
 *
 * This file exports all the necessary modules for the application,
 * following the Clean Architecture pattern.
 */
export * from './core/models';
export * from './core/domain/repositories';
export * from './core/domain/services';
export * from './core/di/container';
export * from './infrastructure/repositories';
export * from './infrastructure/services';
export * from './infrastructure/storage';
export * from './infrastructure/helpers';
export * from './utils';
export * from './inventory';
export * from './ai';
