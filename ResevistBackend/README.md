# Reservista Backend

A comprehensive NestJS-based booking platform API for managing customers, providers, services, bookings, and payments.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL or MySQL
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your database and other configuration
```

3. **Set up database:**
```bash
# For PostgreSQL (recommended)
createdb reservista_db

# For MySQL, create database using your preferred tool
```

4. **Start development server:**
```bash
npm run start:dev
```

The API will be available at: `http://localhost:3001`
Swagger documentation: `http://localhost:3001/api/docs`

## 📚 API Documentation

Once the server is running, visit `http://localhost:3001/api/docs` for interactive Swagger documentation.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🏗️ Project Structure

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root application module
├── app.controller.ts    # Health check endpoints
├── app.service.ts       # Basic application service
├── config/              # Configuration files (planned)
├── common/              # Shared utilities (planned)
└── modules/             # Feature modules (planned)
    ├── auth/            # Authentication & authorization
    ├── users/           # User management
    ├── providers/       # Provider management
    ├── services/        # Service management
    ├── bookings/        # Booking lifecycle
    ├── payments/        # Payment processing
    ├── reviews/         # Reviews & ratings
    ├── admin/           # Admin panel features
    ├── notifications/   # Notification system
    └── calendar/        # Calendar integration
```

## 📋 Features Roadmap

### ✅ Phase 1: Basic Setup (Current)
- [x] Project scaffolding
- [x] Basic health endpoints
- [x] Swagger documentation setup
- [x] Environment configuration
- [x] Testing framework

### 🔄 Phase 2: Core Infrastructure (Next)
- [ ] Database setup & migrations
- [ ] Authentication & JWT
- [ ] Role-based access control
- [ ] Error handling & logging

### 📅 Phase 3: Core Features
- [ ] User management
- [ ] Provider onboarding
- [ ] Service management
- [ ] Booking system
- [ ] Payment integration

### 🚀 Phase 4: Advanced Features
- [ ] Review system
- [ ] Calendar integration
- [ ] Notification system
- [ ] Admin panel
- [ ] Analytics & reporting

## 🔧 Available Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start development server with debugging
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Generate test coverage report
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🌍 Environment Variables

Key environment variables (see `.env.example` for complete list):

```bash
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=reservista_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=reservista_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## 📄 License

MIT License - see LICENSE file for details.
