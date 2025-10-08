# 💅 Reservista - Beauty & Wellness Marketplace

A comprehensive **full-stack marketplace** platform connecting customers with beauty and wellness service providers. Built with modern tech stack for scalability, security, and user experience - similar to **Fresha.com**.

## 🌟 Platform Overview

**Reservista** is a Progressive Web App (PWA) marketplace that enables:
- 👥 **Customers**: Easy discovery and booking of beauty/wellness services
- 🏢 **Businesses/Partners**: Complete management toolkit for service providers  
- 👨‍💼 **Admins**: Platform oversight, analytics, and commission management

### 🎯 Target Services
- 💅 Nail salons and technicians
- 💇‍♀️ Hair salons and stylists  
- 💆‍♀️ Spa and massage services
- 🧴 Skincare and beauty treatments
- 🏋️‍♀️ Wellness and fitness services

## ✨ Complete Feature Set

### 🚀 **Core Platform Features**
- 💳 **Stripe Payment Integration** - Complete payment processing with webhooks & deposits
- 🗺️ **Google Maps Integration** - Geocoding, Places API, location search, and distance calculation
- 📱 **SMS Notifications** - Twilio integration for booking confirmations and reminders
- 🌍 **Internationalization** - Multi-language support (English/Chinese) with dynamic translations
- 🎯 **Promotional System** - Advanced discount, deals, and loyalty program management
- 📊 **Analytics & Reporting** - Business insights, revenue tracking, commission management
- ⭐ **Review System** - Customer ratings, comments, and photo reviews
- 📅 **Calendar Integration** - Real-time availability, Google Calendar sync, recurring appointments

### 👥 **Customer Features**
- 🔍 **Advanced Search** - Services, location, date/time with smart filters
- 📱 **Mobile-First Design** - PWA with app-like experience
- ⭐ **Favorites & Wishlists** - Save preferred businesses and services
- 💸 **Deals & Promotions** - Flash sales, loyalty points, gift cards
- 📝 **Booking Management** - Easy reschedule/cancel with policy enforcement
- 💳 **Payment Options** - Multiple methods, saved cards, secure processing

### 🏢 **Business/Partner Features**  
- 📊 **Complete Dashboard** - Bookings, revenue, analytics in one place
- 📅 **Calendar Management** - Block times, staff schedules, recurring availability
- 💰 **Financial Tools** - Revenue tracking, commission reports, payout management
- 📈 **Marketing Tools** - Promotions, premium listings, customer insights
- 👥 **Staff Management** - Individual calendars, bios, service assignments
- 🔔 **Real-time Notifications** - New bookings, cancellations, reviews

### 👨‍💼 **Admin Panel Features**
- 🛡️ **User Management** - Approve businesses, moderate content, handle disputes
- 📊 **Platform Analytics** - Users, bookings, revenue, commission tracking
- 💰 **Revenue Management** - Commission rates, listing fees, advertisement pricing
- 🔍 **Content Moderation** - Review approval, business verification, spam prevention

## 🛠️ Technical Architecture

### 🏗️ **Backend Architecture (NestJS)**
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with OAuth (Google/Facebook)
- **API Documentation**: Swagger/OpenAPI
- **Cloud**: AWS RDS, Cloudinary for media

### 🔗 **Key Integrations**
- **Payments**: Stripe (deposits, full payments, refunds)
- **Maps**: Google Maps API (geocoding, places, distance)
- **SMS**: Twilio (booking confirmations, reminders)
- **Email**: SMTP (automated notifications)
- **Calendar**: Google Calendar, iCal sync

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

The API will be available at: `http://localhost:8000`
Swagger documentation: `http://localhost:8000/api/docs`

## �️ Complete Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts             # Root module with all integrations
├── app.controller.ts         # Health check endpoints
├── app.service.ts            # Basic application service
├── config/                   # Configuration management
│   └── database.config.ts    # Database configuration
├── entities/                 # Database entities (25+ models)
│   ├── user.entity.ts        # Customer accounts
│   ├── provider.entity.ts    # Business/partner accounts
│   ├── service.entity.ts     # Service offerings
│   ├── booking.entity.ts     # Booking management
│   ├── payment.entity.ts     # Payment processing
│   ├── review.entity.ts      # Customer reviews
│   ├── promotion.entity.ts   # Deals and discounts
│   └── ...                   # 18+ more entities
├── modules/                  # Feature modules (COMPLETE)
│   ├── auth/                 # ✅ JWT authentication & OAuth
│   ├── users/                # ✅ Customer management
│   ├── providers/            # ✅ Business partner management
│   ├── services/             # ✅ Service catalog
│   ├── bookings/             # ✅ Booking lifecycle
│   ├── payments/             # ✅ Payment processing
│   ├── reviews/              # ✅ Rating & review system
│   ├── notifications/        # ✅ Email/SMS notifications
│   ├── calendar/             # ✅ Calendar integration
│   ├── analytics/            # ✅ Business intelligence
│   ├── stripe/               # ✅ Payment gateway integration
│   ├── maps/                 # ✅ Google Maps services
│   ├── sms/                  # ✅ Twilio SMS integration
│   ├── i18n/                 # ✅ Internationalization
│   ├── categories/           # ✅ Service categorization
│   ├── cart/                 # ✅ Shopping cart
│   ├── favorites/            # ✅ Customer wishlists
│   ├── support-tickets/      # ✅ Customer support
│   ├── cms/                  # ✅ Content management
│   ├── system-settings/      # ✅ Platform configuration
│   ├── cloudinary/           # ✅ Media management
│   └── upload/               # ✅ File upload handling
├── controllers/              # API endpoints
├── services/                 # Business logic
└── scripts/                  # Database utilities
```

## 📋 Development Status

### ✅ **COMPLETED - Production Ready**
- [x] **Core Infrastructure**: Database, authentication, API structure
- [x] **User Management**: Customer accounts, business profiles, admin panel
- [x] **Service Catalog**: Categories, services, pricing, availability
- [x] **Booking System**: Real-time scheduling, calendar integration, confirmations
- [x] **Payment Processing**: Stripe integration, deposits, refunds, commission tracking
- [x] **Review & Rating**: Customer feedback, photo reviews, business insights
- [x] **Notification System**: Email & SMS via Twilio, automated reminders
- [x] **Location Services**: Google Maps, geocoding, distance calculation
- [x] **Internationalization**: Multi-language support (EN/ZH)
- [x] **Promotional System**: Discounts, deals, loyalty programs
- [x] **Analytics Dashboard**: Revenue tracking, booking insights, user metrics
- [x] **Admin Tools**: User moderation, business verification, dispute resolution
- [x] **Mobile Optimization**: PWA-ready APIs, responsive design support

### � **Ready for Frontend Integration**
The backend is **100% complete** with all marketplace features implemented according to your requirements:

1. **Customer Journey**: Registration → Discovery → Booking → Payment → Reviews
2. **Business Tools**: Onboarding → Profile setup → Calendar management → Revenue tracking  
3. **Admin Platform**: User management → Analytics → Commission tracking → Content moderation
4. **Technical Features**: Security, scalability, compliance, and performance optimized

## 🧪 Testing & Quality

```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Test coverage
npm run test:cov

# Code quality
npm run lint
npm run format
```

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

## 🌍 Environment Configuration

Complete environment setup for all features:

```bash
# ===============================================
# 🚀 APPLICATION CONFIGURATION
# ===============================================
NODE_ENV=development
PORT=8000
API_PREFIX=api/v1
FRONTEND_URL=http://localhost:7000

# ===============================================
# 🗄️ DATABASE (AWS RDS PostgreSQL)
# ===============================================
DATABASE_TYPE=postgres
DATABASE_HOST=your-aws-rds-endpoint
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-secure-password
DATABASE_NAME=postgres
DATABASE_SSL=true

# ===============================================
# 🔐 AUTHENTICATION & SECURITY
# ===============================================
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# OAuth Integration
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# ===============================================
# 💳 STRIPE PAYMENT INTEGRATION
# ===============================================
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CURRENCY=usd
STRIPE_SUCCESS_URL=http://localhost:7000/payment/success
STRIPE_CANCEL_URL=http://localhost:7000/payment/cancel

# ===============================================
# 🗺️ GOOGLE MAPS INTEGRATION
# ===============================================
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
DEFAULT_LATITUDE=40.7128
DEFAULT_LONGITUDE=-74.0060
DEFAULT_SEARCH_RADIUS=10
GEOCODING_ENABLED=true
PLACES_ENABLED=true

# ===============================================
# 📱 TWILIO SMS INTEGRATION
# ===============================================
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SMS_ENABLED=true
DEFAULT_COUNTRY_CODE=+1

# ===============================================
# 🌍 INTERNATIONALIZATION
# ===============================================
FALLBACK_LANGUAGE=en
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,zh
I18N_PATH=src/i18n/

# ===============================================
# 📧 EMAIL CONFIGURATION
# ===============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# ===============================================
# ☁️ CLOUDINARY MEDIA STORAGE
# ===============================================
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ===============================================
# 🔧 PERFORMANCE & SECURITY
# ===============================================
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
MAX_FILE_SIZE=5242880
UPLOAD_DEST=./uploads
```

## 📚 API Documentation

### 🔗 **Swagger Documentation**
Once the server is running, access complete API documentation at:
**http://localhost:8000/api/docs**

### 🛠️ **API Endpoints Overview**

#### 👥 **Customer APIs**
- `POST /auth/register` - Customer registration
- `GET /services/search` - Search services with filters
- `GET /providers/:id` - Business profile details
- `POST /bookings` - Create new booking
- `GET /bookings/customer/:id` - Customer booking history
- `POST /payments/stripe/create-intent` - Process payments
- `POST /reviews` - Submit service reviews

#### 🏢 **Business/Partner APIs**  
- `POST /auth/provider/register` - Business registration
- `GET /bookings/provider/:id` - Business booking management
- `PUT /providers/calendar` - Update availability
- `GET /analytics/revenue` - Revenue and performance metrics
- `POST /services` - Add/edit service offerings

#### 👨‍💼 **Admin APIs**
- `GET /admin/users` - User management
- `PUT /admin/providers/verify` - Business verification
- `GET /admin/analytics` - Platform-wide analytics
- `POST /admin/promotions` - Create promotional campaigns

#### 🔧 **Integration APIs**
- `POST /maps/geocode` - Location services
- `POST /sms/send` - SMS notifications  
- `GET /i18n/translations` - Multi-language support
- `POST /stripe/webhooks` - Payment processing webhooks

## 🚀 Deployment & Scaling

### � **Production Deployment**
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### ☁️ **Cloud Architecture**
- **Database**: AWS RDS PostgreSQL (configured)
- **Media Storage**: Cloudinary (configured)
- **API Hosting**: AWS EC2/ECS recommended
- **Frontend CDN**: AWS CloudFront recommended
- **Monitoring**: Built-in logging and analytics

### 🔒 **Security Features**
- JWT authentication with refresh tokens
- Rate limiting and DDoS protection
- Data encryption and secure payment processing
- GDPR compliance ready
- Input validation and sanitization
