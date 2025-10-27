// Export all entities for easy importing
export { User } from './user.entity';
export { OAuthAccount } from './oauth-account.entity';
export { Role } from './role.entity';
export { Permission } from './permission.entity';
export { RolePermission } from './role-permission.entity';
export { Provider } from './provider.entity';
export { Category } from './category.entity';
export { Service } from './service.entity';
export { ProviderWorkingHours } from './provider-working-hours.entity';
export { ProviderTimeOff } from './provider-time-off.entity';
export { Booking } from './booking.entity';
export { Payment } from './payment.entity';
export { Refund } from './refund.entity';
export { Review } from './review.entity';
export { Favorite } from './favorite.entity';
export { UserNotificationPreferences } from './user-notification-preferences.entity';

export { Payout } from './payout.entity';
export { Commission } from './commission.entity';

// TODO: Export remaining entities as they are created
export { Notification } from './notification.entity';
export { Message } from './message.entity';
export { Reminder } from './reminder.entity';
export { SupportTicket } from './support-ticket.entity';
// export { CalendarAccount } from './calendar-account.entity';
// export { Payout } from './payout.entity';
// export { EventsLog } from './events-log.entity';
// export { SystemLog } from './system-log.entity';
export { CmsPage } from './cms-page.entity';
export { Analytics } from './analytics.entity';
export { CalendarEvent } from './calendar-event.entity';
export { CartItem } from './cart-item.entity';
export { ContactMessage } from './contact-message.entity';
export { GoogleCalendarToken } from './google-calendar-token.entity';
export { Log } from './log.entity';
export { SystemSetting } from './system-setting.entity';
export { Promotion } from './promotion.entity';
export { PromotionUsage } from './promotion-usage.entity';
export { PaymentMethod } from './payment-method.entity';

// New feature entities
export { GiftCard, GiftCardUsage } from './gift-card.entity';
export { LoyaltyAccount, PointTransaction, LoyaltyReward } from './loyalty.entity';
export { ReferralCode, Referral, ReferralCampaign } from './referral.entity';
export { ServiceAddon, BookingAddon, AddonPackage } from './service-addon.entity';
export { RecurringBooking, RecurringBookingException } from './recurring-booking.entity';
export { Staff } from './staff.entity';
export { StaffAvailability } from './staff-availability.entity';
export { ExternalCalendarIntegration } from './external-calendar-integration.entity';

// Forms entities
export { FormTemplate } from './form-template.entity';
export { FormField } from './form-field.entity';
export { FormSubmission } from './form-submission.entity';
export { FormResponse } from './form-response.entity';
