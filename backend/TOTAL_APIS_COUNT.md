# RESERVISTA BACKEND - TOTAL API ENDPOINTS COUNT

## API Endpoints Summary by Module

Based on the search results and analysis of all controller files, here's the comprehensive count of API endpoints in your Reservista backend:

### 🎁 **Gift Cards Module** (9 APIs)
- `POST /gift-cards` - Purchase gift card
- `GET /gift-cards/my-cards` - Get user gift cards
- `GET /gift-cards/active` - Get active gift cards
- `POST /gift-cards/check-balance` - Check gift card balance
- `POST /gift-cards/redeem` - Redeem gift card
- `GET /gift-cards/:code` - Get gift card by code
- `GET /gift-cards/:code/usage-history` - Get usage history
- `PUT /gift-cards/:code/transfer` - Transfer gift card
- `DELETE /gift-cards/:code` - Deactivate gift card

### 🎯 **Loyalty Module** (12 APIs)
- `GET /loyalty/account` - Get loyalty account
- `POST /loyalty/add-points` - Add points (Admin)
- `POST /loyalty/redeem-points` - Redeem points
- `GET /loyalty/history` - Get transaction history
- `GET /loyalty/rewards` - Get user eligible rewards
- `GET /loyalty/rewards/eligible` - Get all eligible rewards
- `POST /loyalty/rewards` - Create reward (Admin)
- `GET /loyalty/rewards/all` - Get all rewards (Admin)
- `PATCH /loyalty/rewards/:id` - Update reward (Admin)
- `DELETE /loyalty/rewards/:id` - Delete reward (Admin)
- `POST /loyalty/review-bonus` - Award review bonus
- `POST /loyalty/birthday-bonus` - Award birthday bonus

### 👥 **Referrals Module** (12 APIs)
- `GET /referrals/my-code` - Get referral code
- `POST /referrals` - Create referral
- `POST /referrals/complete` - Complete referral
- `GET /referrals/my-referrals` - Get user referrals
- `GET /referrals/stats` - Get referral stats
- `POST /referrals/validate/:code` - Validate referral code
- `POST /referrals/campaigns` - Create campaign (Admin)
- `GET /referrals/campaigns` - Get campaigns (Admin)
- `GET /referrals/campaigns/active` - Get active campaigns
- `PATCH /referrals/campaigns/:id` - Update campaign (Admin)
- `DELETE /referrals/campaigns/:id` - Delete campaign (Admin)

### ➕ **Service Add-ons Module** (13 APIs)
- `POST /service-addons` - Create addon (Provider)
- `GET /service-addons/my-addons` - Get provider addons
- `PATCH /service-addons/:id` - Update addon
- `DELETE /service-addons/:id` - Delete addon
- `GET /service-addons/service/:serviceId` - Get addons for service
- `GET /service-addons/recommendations/:serviceId` - Get recommendations
- `GET /service-addons/:id` - Get addon details
- `POST /service-addons/booking/:bookingId/addons` - Add addons to booking
- `GET /service-addons/booking/:bookingId/addons` - Get booking addons
- `DELETE /service-addons/booking/:bookingId/addons/:addonId` - Remove booking addon
- `GET /service-addons/booking/:bookingId/total` - Get booking total
- `POST /service-addons/packages` - Create package (Provider)
- `GET /service-addons/packages/my-packages` - Get provider packages
- `GET /service-addons/packages/provider/:providerId` - Get provider packages

### 🔄 **Recurring Bookings Module** (11 APIs)
- `POST /recurring-bookings` - Create recurring booking
- `GET /recurring-bookings` - Get user recurring bookings
- `GET /recurring-bookings/:id` - Get recurring booking details
- `PATCH /recurring-bookings/:id` - Update recurring booking
- `PATCH /recurring-bookings/:id/pause` - Pause recurring booking
- `PATCH /recurring-bookings/:id/resume` - Resume recurring booking
- `DELETE /recurring-bookings/:id` - Cancel recurring booking
- `POST /recurring-bookings/:id/exceptions` - Create exception
- `GET /recurring-bookings/:id/exceptions` - Get exceptions
- `GET /recurring-bookings/:id/upcoming` - Get upcoming bookings
- `GET /recurring-bookings/:id/stats` - Get statistics

### 📅 **Calendar Module** (5 APIs)
- `POST /calendar` - Create calendar event
- `GET /calendar` - Get calendar events
- `GET /calendar/:id` - Get calendar event by ID
- `GET /calendar/bookings/ics` - Download user bookings ICS
- `GET /calendar/provider/bookings/ics` - Download provider bookings ICS

### 👤 **Users Module** (16 APIs)
- `POST /users` - Create user (Admin)
- `GET /users` - Get all users (Admin)
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID
- `PATCH /users/me` - Update own profile
- `PATCH /users/:id` - Update user (Admin)
- `DELETE /users/:id` - Delete user (Admin)
- `PUT /users/me/password` - Change password
- `PUT /users/me/profile` - Update profile image
- `GET /users/me/notifications` - Get notification preferences
- `PUT /users/me/notifications` - Update notification preferences
- `PUT /users/me/privacy` - Update privacy settings
- `POST /users/me/two-factor/enable` - Enable 2FA
- `POST /users/me/two-factor/disable` - Disable 2FA
- `DELETE /users/me/account` - Delete own account

### 🏪 **Providers Module** (9 APIs)
- `POST /providers` - Create provider
- `GET /providers` - Get all providers
- `GET /providers/me` - Get current provider
- `GET /providers/:id` - Get provider by ID
- `PATCH /providers/me` - Update own provider
- `PATCH /providers/:id` - Update provider (Admin)
- `DELETE /providers/:id` - Delete provider
- `GET /providers/me/availability` - Get availability
- `POST /providers/me/availability` - Set availability

### 📋 **Bookings Module** (15+ APIs)
- `POST /bookings` - Create booking
- `GET /bookings` - Get bookings
- `GET /bookings/me` - Get user bookings
- `GET /bookings/provider` - Get provider bookings
- `GET /bookings/:id` - Get booking details
- `PATCH /bookings/:id` - Update booking
- `PATCH /bookings/:id/status` - Update booking status
- `PATCH /bookings/:id/reschedule` - Reschedule booking
- `DELETE /bookings/:id` - Cancel booking
- `GET /bookings/availability/:providerId` - Check availability
- `POST /bookings/bulk` - Create bulk bookings
- `GET /bookings/stats` - Get booking statistics
- `POST /bookings/:id/review` - Add review
- `GET /bookings/:id/receipt` - Get booking receipt
- `POST /bookings/:id/refund` - Request refund

### 🛍️ **Services Module** (10 APIs)
- `POST /services/provider/:providerId` - Create service
- `GET /services` - Get all services
- `GET /services/search` - Search services
- `GET /services/popular` - Get popular services
- `GET /services/provider/:providerId` - Get provider services
- `GET /services/category/:categoryId` - Get services by category
- `GET /services/:id` - Get service details
- `PATCH /services/:id` - Update service
- `PATCH /services/:id/toggle-active` - Toggle service status
- `DELETE /services/:id` - Delete service

### 📂 **Categories Module** (12 APIs)
- `POST /categories` - Create category (Admin)
- `GET /categories` - Get all categories
- `GET /categories/featured` - Get featured categories
- `GET /categories/search` - Search categories
- `GET /categories/slug/:slug` - Get category by slug
- `GET /categories/:id` - Get category by ID
- `PATCH /categories/:id` - Update category (Admin)
- `PATCH /categories/:id/toggle-active` - Toggle category status
- `PATCH /categories/:id/toggle-featured` - Toggle featured status
- `PATCH /categories/sort-order` - Update sort order
- `DELETE /categories/:id` - Delete category

### ⭐ **Reviews Module** (13 APIs)
- `POST /reviews` - Create review
- `GET /reviews` - Get all reviews
- `GET /reviews/provider/:providerId` - Get provider reviews
- `GET /reviews/provider/:providerId/stats` - Get review stats
- `GET /reviews/my-reviews` - Get user reviews
- `GET /reviews/:id` - Get review details
- `PATCH /reviews/:id` - Update review
- `PATCH /reviews/:id/response` - Add provider response
- `PATCH /reviews/:id/toggle-published` - Toggle published status
- `PATCH /reviews/:id/toggle-verified` - Toggle verified status
- `POST /reviews/fix-orphan-reviews` - Fix orphan reviews
- `DELETE /reviews/:id` - Delete review

### 🔔 **Notifications Module** (18 APIs)
- `GET /notifications/test` - Test notifications
- `GET /notifications/messages/conversations` - Get conversations
- `GET /notifications/messages/:conversationId` - Get conversation messages
- `POST /notifications/messages` - Send message
- `GET /notifications` - Get notifications
- `GET /notifications/unread-count` - Get unread count
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/mark-all-read` - Mark all as read
- `POST /notifications` - Create notification
- `GET /notifications/messages` - Get messages
- `GET /notifications/messages/conversations` - Get conversations
- `GET /notifications/messages/conversation/:userId` - Get conversation with user
- `POST /notifications/messages` - Send message
- `PATCH /notifications/messages/:id/read` - Mark message as read
- `GET /notifications/reminders` - Get reminders
- `POST /notifications/reminders` - Create reminder
- `PUT /notifications/reminders/:id` - Update reminder
- `DELETE /notifications/reminders/:id` - Delete reminder

### 📧 **Contact Module** (6 APIs)
- `GET /contact` - Get contact messages (Admin)
- `GET /contact/:id` - Get contact message by ID
- `POST /contact` - Send contact message
- `PUT /contact/:id/mark-read` - Mark as read (Admin)
- `PUT /contact/:id/reply` - Reply to message (Admin)
- `DELETE /contact/:id` - Delete message (Admin)

### 🛒 **Cart Module** (5 APIs)
- `GET /cart` - Get cart items
- `POST /cart` - Add to cart
- `PATCH /cart/:id` - Update cart item
- `DELETE /cart/:id` - Remove cart item
- `DELETE /cart` - Clear cart

### ❤️ **Favorites Module** (6 APIs)
- `GET /favorites` - Get user favorites
- `GET /favorites/services` - Get favorite services
- `POST /favorites/:providerId` - Add to favorites
- `DELETE /favorites/:providerId` - Remove from favorites
- `GET /favorites/check/:providerId` - Check if favorited
- `DELETE /favorites` - Clear all favorites

### 📱 **SMS Module** (5 APIs)
- `POST /sms/send` - Send SMS
- `POST /sms/send-bulk` - Send bulk SMS
- `POST /sms/booking-confirmation` - Send booking confirmation
- `POST /sms/verification-code` - Send verification code
- `GET /sms/status/:messageId` - Get SMS status

### 💳 **Stripe Module** (4 APIs)
- `POST /stripe/payment-intent` - Create payment intent
- `POST /stripe/customer` - Create customer
- `POST /stripe/subscription` - Create subscription
- `POST /stripe/webhook` - Handle webhooks

### 📤 **Upload Module** (8 APIs)
- `POST /upload/profile-image` - Upload profile image
- `POST /upload/service-image` - Upload service image
- `POST /upload/service` - Upload service files
- `POST /upload/shop-logo` - Upload shop logo
- `POST /upload/shop-cover` - Upload shop cover
- `POST /upload/shop` - Upload shop files
- `POST /upload/upload-from-url` - Upload from URL
- `DELETE /upload/image/:publicId` - Delete image

### 🌐 **Maps Module** (5 APIs)
- `POST /maps/geocode` - Geocode address
- `GET /maps/reverse-geocode` - Reverse geocode
- `POST /maps/search-nearby` - Search nearby
- `POST /maps/calculate-distance` - Calculate distance
- `GET /maps/place/:placeId` - Get place details

### 🌍 **I18n Module** (4 APIs)
- `GET /i18n/languages` - Get supported languages
- `GET /i18n/translations` - Get translations
- `GET /i18n/translate` - Translate text
- `POST /i18n/translate` - Batch translate

### 📄 **CMS Module** (6 APIs)
- `GET /cms` - Get all pages
- `GET /cms/:id` - Get page by ID
- `GET /cms/slug/:slug` - Get page by slug
- `POST /cms` - Create page (Admin)
- `PUT /cms/:id` - Update page (Admin)
- `DELETE /cms/:id` - Delete page (Admin)

### 💰 **Payouts Module** (5 APIs)
- `GET /payouts` - Get payouts
- `GET /payouts/:id` - Get payout by ID
- `POST /payouts` - Create payout
- `PUT /payouts/:id` - Update payout
- `DELETE /payouts/:id` - Delete payout

### 🎫 **Support Tickets Module** (5 APIs)
- `GET /support-tickets` - Get tickets
- `GET /support-tickets/:id` - Get ticket by ID
- `POST /support-tickets` - Create ticket
- `PUT /support-tickets/:id` - Update ticket
- `DELETE /support-tickets/:id` - Delete ticket

### ⚙️ **System Settings Module** (4 APIs)
- `POST /system-settings` - Create setting
- `GET /system-settings` - Get all settings
- `GET /system-settings/:id` - Get setting by ID
- `GET /system-settings/key/:key` - Get setting by key

### 💬 **Messages Module** (5 APIs)
- `GET /messages/conversations` - Get conversations
- `GET /messages/conversations/:conversationId/messages` - Get messages
- `POST /messages/conversations/:conversationId/messages` - Send message
- `POST /messages/conversations` - Create conversation
- `GET /messages/conversations/:conversationId/mark-read` - Mark as read

### 📊 **Analytics Module** (APIs not fully counted)
- Multiple analytics endpoints for dashboard, reports, etc.

### 🔐 **Auth Module** (APIs not fully counted)
- Login, logout, register, password reset, verify email, etc.

### 🏢 **Admin Module** (APIs not fully counted)
- Various admin management endpoints

## **TOTAL API ENDPOINTS COUNT**

### **Confirmed Counted APIs**: 220+ APIs

### **Breakdown by Category**:
- **New Features (Added by me)**: 62 APIs
  - Gift Cards: 9 APIs
  - Loyalty: 12 APIs  
  - Referrals: 12 APIs
  - Service Add-ons: 14 APIs
  - Recurring Bookings: 11 APIs
  - Enhanced Calendar: 5 APIs (including ICS)

- **Existing Core Features**: 150+ APIs
  - Users, Providers, Bookings, Services, Categories
  - Reviews, Notifications, Contact, Cart, Favorites
  - SMS, Stripe, Upload, Maps, I18n, CMS
  - Payouts, Support, Settings, Messages
  - Analytics, Auth, Admin modules

### **GRAND TOTAL: 220+ APIs** 🎯

یہ آپ کے Reservista backend میں موجود تمام API endpoints کی تفصیلی گنتی ہے۔ نئے features کے ساتھ کل **220+ APIs** بن گئی ہیں جو ایک مکمل enterprise-level booking system کے لیے کافی comprehensive ہے!