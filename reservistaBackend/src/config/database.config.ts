import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  User,
  Provider,
  Service,
  Booking,
  Payment,
  Refund,
  Review,
  Category,
  ProviderWorkingHours,
  ProviderTimeOff,
  Favorite,
  Role,
  Permission,
  RolePermission,
  OAuthAccount,
  Payout,
  CartItem,
  ContactMessage,
  SupportTicket,
  Analytics,
  SystemSetting,
  Log,
  CalendarEvent,
  Notification,
  Message,
  Reminder,
  UserNotificationPreferences,
  CmsPage
} from '../entities';export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: process.env.DATABASE_TYPE as any || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'ansar123',
    database: process.env.DATABASE_NAME || 'reservista',
    entities: [
      User, Provider, Service, Booking, Payment, Refund, Review, Category,
      ProviderWorkingHours, ProviderTimeOff, Favorite, Role, Permission, 
      RolePermission, OAuthAccount, Payout, CartItem, ContactMessage, SupportTicket,
      Analytics, SystemSetting, Log, CalendarEvent, Notification, Message, 
      Reminder, UserNotificationPreferences, CmsPage
    ],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false, // Temporarily disabled to avoid index conflicts
    logging: false, // Disabled for cleaner output
    ssl: process.env.DATABASE_SSL === 'true' ? { 
      rejectUnauthorized: false,
      // Allow connections from any IP
      servername: process.env.DATABASE_HOST
    } : false,
    // Connection pool configuration for better performance across IPs
    extra: {
      connectionLimit: 20,
      acquireTimeout: 60000,
      timeout: 60000,
      // Allow connections from any origin
      charset: 'utf8mb4_unicode_ci'
    },
  }),
);
