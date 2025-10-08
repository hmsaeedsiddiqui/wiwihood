import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import databaseConfig from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ServicesModule } from './modules/services/services.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
import { CommissionModule } from './modules/commission/commission.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SupportTicketsModule } from './modules/support-tickets/support-tickets.module';
import { CmsModule } from './modules/cms/cms.module';
// import { LogsModule } from './modules/logs/logs.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { SystemSettingsModule } from './modules/system-settings/system-settings.module';
import { CartModule } from './modules/cart/cart.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { PaymentMethodsModule } from './modules/payment-methods/payment-methods.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { UploadModule } from './modules/upload/upload.module';
import { ContactModule } from './modules/contact/contact.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AdminModule } from './modules/admin/admin.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { MapsModule } from './modules/maps/maps.module';
import { SmsModule } from './modules/sms/sms.module';
import { I18nModule } from './modules/i18n/i18n.module';
import { GiftCardsModule } from './modules/gift-cards/gift-cards.module';
import { LoyaltyModule } from './modules/loyalty/loyalty.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { ServiceAddonsModule } from './modules/service-addons/service-addons.module';
import { RecurringBookingsModule } from './modules/recurring-bookings/recurring-bookings.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { StaffModule } from './modules/staff/staff.module';

@Module({
  imports: [
    // Configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Added missing comma
      load: [databaseConfig],
    }),

    // Database configuration
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Feature modules
    AuthModule,
    UsersModule,
    ProvidersModule,
    BookingsModule,
    ServicesModule,
    CategoriesModule,
    ReviewsModule,
    PayoutsModule,
    CommissionModule,
    NotificationsModule,
    MessagesModule, // Register MessagesModule
    SupportTicketsModule,
    CmsModule,
    // LogsModule,
    AnalyticsModule,
    CalendarModule,
    SystemSettingsModule,
    CartModule, // Register CartModule
    FavoritesModule, // Register FavoritesModule
    PaymentMethodsModule, // Register PaymentMethodsModule
    CloudinaryModule, // Register CloudinaryModule
    UploadModule, // Register UploadModule
    ContactModule, // Register ContactModule
    AdminModule, // Register AdminModule
    StripeModule, // Register StripeModule
    MapsModule, // Register MapsModule
    SmsModule, // Register SmsModule
    I18nModule, // Register I18nModule
    GiftCardsModule, // Register GiftCardsModule
    LoyaltyModule, // Register LoyaltyModule
    ReferralsModule, // Register ReferralsModule
    ServiceAddonsModule, // Register ServiceAddonsModule
    RecurringBookingsModule, // Register RecurringBookingsModule
    PromotionsModule, // Register PromotionsModule
    StaffModule, // Register StaffModule
  ],
  controllers: [AppController, PaymentController],
  providers: [AppService, PaymentService],
})
export class AppModule {}
