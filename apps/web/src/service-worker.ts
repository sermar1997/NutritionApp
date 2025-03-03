/// <reference lib="webworker" />
/**
 * Service Worker for Nutrition App
 * 
 * Provides offline capabilities and caching strategies using Workbox
 */
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare const self: ServiceWorkerGlobalScope;

// Claim clients immediately to enable faster updates
clientsClaim();

// Precache all assets generated by the build process
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

// Handle navigation requests with a Network-First strategy with fallback to index.html
const fileExtensionRegexp = /\.[^/]+$/;
registerRoute(
  // Return false for URLs with file extensions (these will be handled by other routes)
  // Return true for all navigation requests (URLs without file extensions)
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') {
      return false;
    }

    // If this is a URL that starts with /_, it's an API call and we don't want to cache it
    if (url.pathname.startsWith('/_')) {
      return false;
    }

    // If this looks like a URL for a resource with a file extension, let other routes handle it
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
  ({ url }) => 
    url.origin === self.location.origin &&
    (url.pathname.endsWith('.js') || 
     url.pathname.endsWith('.css') ||
     url.pathname.endsWith('.worker.js')),
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);

// Cache images with a Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache API responses with a Network First strategy
registerRoute(
  ({ url }) => 
    url.origin === self.location.origin && 
    url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-responses',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Cache external API resources (nutrition data, etc.)
registerRoute(
  ({ url }) => 
    url.hostname.includes('api.nutritionapp.example.com') ||
    url.hostname.includes('models.nutritionapp.example.com'),
  new StaleWhileRevalidate({
    cacheName: 'external-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// This allows the web app to update the service worker without reloading the page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Custom offline fallback page
const FALLBACK_HTML_URL = '/offline.html';
const CACHE_NAME = 'offline-fallbacks';

// Cache the offline page during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(FALLBACK_HTML_URL);
    })
  );
});

// Show fallback for navigation requests that fail
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      // Try to fetch from network first
      return await new NetworkFirst({
        cacheName: 'navigations',
        plugins: [
          new CacheableResponsePlugin({
            statuses: [200],
          }),
        ],
      }).handle({ event } as any);
    } catch (error) {
      // If network fetch fails, return the cached fallback page
      const cache = await caches.open(CACHE_NAME);
      const fallbackResponse = await cache.match(FALLBACK_HTML_URL);
      return fallbackResponse || Response.error();
    }
  }
);
