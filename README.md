# NutritionApp - AI-Powered Nutrition & Recipe Management

A multiplatform application for managing nutrition, ingredients inventory, and personalized recipe generation.

## Key Features

- 📸 Image-based ingredient recognition
- 📊 Macro and nutritional analysis
- 🍎 Digital ingredient inventory management
- 🍳 Personalized recipe generation
- 📱 Cross-platform (Web + Mobile)
- 🔄 Offline-first architecture
- 💳 Premium subscription features

## Tech Stack

- **Frontend**: React (Web), React Native (Mobile)
- **Language**: TypeScript
- **AI**: TensorFlow.js (Web), TensorFlow Lite (Mobile)
- **Storage**: IndexedDB/localForage (Web), AsyncStorage/SQLite (Mobile)
- **Offline Support**: Service Workers + Workbox (Web), Native mechanisms (Mobile)
- **Payment**: Stripe (Web), Platform-specific in-app purchases (Mobile)

## Project Structure

```
nutrition-app/
├── apps/
│   ├── web/          # React web application (Vite + PWA)
│   └── mobile/       # React Native mobile application
└── packages/
    └── shared/       # Shared TypeScript code, models and utilities
```

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn
- React Native setup (for mobile development)

### Installation

```bash
# Install dependencies
yarn install

# Start web development server
yarn web

# Start React Native development
yarn mobile
```

## License

This project is licensed under the MIT License.
