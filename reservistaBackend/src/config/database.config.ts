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
    username: process.env.DATABASE_USERNAME || 'reservista_user',
    password: process.env.DATABASE_PASSWORD || 'reservista_password',
    database: process.env.DATABASE_NAME || 'reservista_clean',
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
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }),
);
