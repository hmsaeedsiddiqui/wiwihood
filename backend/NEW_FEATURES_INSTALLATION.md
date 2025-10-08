# 🚀 RESERVISTA BACKEND - NEW FEATURES INSTALLATION GUIDE

## ✅ New Features Added

### 🔧 **1. Stripe Payment Integration**
- Complete payment processing with webhooks
- Support for one-time payments and subscriptions
- Automatic refund handling
- Customer management

### 🗺️ **2. Google Maps Integration**
- Address geocoding and reverse geocoding
- Nearby places search for beauty/wellness services
- Distance calculation between locations
- Place details retrieval

### 📱 **3. SMS Notifications (Twilio)**
- Booking confirmations and reminders
- Verification codes
- Bulk SMS capabilities
- Template-based messaging

### 🌍 **4. Internationalization (i18n)**
- Multi-language support (English & Chinese)
- Dynamic translation management
- Easy addition of new languages
- Template-based translations

### 🎁 **5. Promotional System**
- Discount codes and coupons
- Percentage and fixed amount discounts
- Usage limits and restrictions
- Provider-specific and platform-wide promotions

## 📦 Installation Steps

### Step 1: Install Dependencies
```bash
npm install stripe @googlemaps/google-maps-services-js twilio
```

### Step 2: Update Environment Variables
Add these to your `.env` file:

```env
# Google Maps Configuration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
DEFAULT_LATITUDE=40.7128
DEFAULT_LONGITUDE=-74.0060
DEFAULT_SEARCH_RADIUS=10
GEOCODING_ENABLED=true
PLACES_ENABLED=true

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SMS_ENABLED=true
DEFAULT_COUNTRY_CODE=+1

# Internationalization
FALLBACK_LANGUAGE=en
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,zh
I18N_PATH=src/i18n/
```

### Step 3: Database Migration
Run the new migrations for promotion system:
```bash
npm run migration:run
```

### Step 4: Test the Features

#### Test Stripe Integration
```bash
# Create payment intent
curl -X POST http://localhost:8000/api/v1/stripe/payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 29.99, "currency": "usd"}'
```

#### Test Maps Integration
```bash
# Geocode address
curl -X POST http://localhost:8000/api/v1/maps/geocode \
  -H "Content-Type: application/json" \
  -d '{"address": "1600 Amphitheatre Parkway, Mountain View, CA"}'
```

#### Test SMS Integration
```bash
# Send SMS
curl -X POST http://localhost:8000/api/v1/sms/send \
  -H "Content-Type: application/json" \
  -d '{"to": "+1234567890", "templateId": "WELCOME"}'
```

#### Test i18n
```bash
# Get translations
curl "http://localhost:8000/api/v1/i18n/translations?lang=en"

# Translate key
curl "http://localhost:8000/api/v1/i18n/translate?key=common.welcome&lang=zh"
```

## 🎯 API Endpoints Added

### Stripe Endpoints
- `POST /api/v1/stripe/payment-intent` - Create payment intent
- `POST /api/v1/stripe/customer` - Create customer
- `POST /api/v1/stripe/subscription` - Create subscription
- `POST /api/v1/stripe/webhook` - Handle webhooks

### Maps Endpoints
- `POST /api/v1/maps/geocode` - Geocode address
- `GET /api/v1/maps/reverse-geocode` - Reverse geocode
- `POST /api/v1/maps/search-nearby` - Search nearby places
- `POST /api/v1/maps/calculate-distance` - Calculate distance
- `GET /api/v1/maps/place/:placeId` - Get place details

### SMS Endpoints
- `POST /api/v1/sms/send` - Send single SMS
- `POST /api/v1/sms/send-bulk` - Send bulk SMS
- `POST /api/v1/sms/booking-confirmation` - Send booking confirmation
- `POST /api/v1/sms/verification-code` - Send verification code
- `GET /api/v1/sms/status/:messageId` - Get SMS status

### i18n Endpoints
- `GET /api/v1/i18n/languages` - Get supported languages
- `GET /api/v1/i18n/translations` - Get all translations
- `GET /api/v1/i18n/translate` - Translate specific key
- `POST /api/v1/i18n/translate` - Update translation

## 🔐 API Keys Setup

### 1. Stripe Setup
1. Go to https://dashboard.stripe.com/
2. Get your API keys from Developers > API keys
3. Set up webhooks in Developers > Webhooks
4. Add webhook endpoint: `your-domain.com/api/v1/stripe/webhook`

### 2. Google Maps Setup
1. Go to https://console.cloud.google.com/
2. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Distance Matrix API
3. Create API key and add restrictions

### 3. Twilio Setup
1. Go to https://console.twilio.com/
2. Get Account SID and Auth Token
3. Buy a phone number for sending SMS

## 🚀 Start Development Server
```bash
npm run start:dev
```

Your enhanced backend will be available at: `http://localhost:8000`
Swagger docs: `http://localhost:8000/api/docs`

## 🎉 Success!
All missing features have been successfully implemented following the same architecture patterns used in the original Reservista backend!