import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'CurrentPassword123!',
  })
  @IsString()
  @MinLength(1, { message: 'Current password is required' })
  currentPassword: string;

  @ApiProperty({
    description: 'New password (min 8 characters, must contain uppercase, lowercase, number)',
    example: 'NewPassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
  )
  newPassword: string;

  @ApiProperty({
    description: 'Confirm new password',
    example: 'NewPassword123!',
  })
  @IsString()
  @MinLength(8, { message: 'Password confirmation must be at least 8 characters long' })
  confirmPassword: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'User address',
    example: '123 Main St',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'User city',
    example: 'New York',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'User country',
    example: 'United States',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '10001',
    required: false,
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({
    description: 'User language preference',
    example: 'en',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    description: 'User timezone',
    example: 'America/New_York',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class NotificationPreferencesDto {
  @ApiProperty({
    description: 'Email notifications enabled',
    example: true,
    required: false,
  })
  @IsOptional()
  emailNotifications?: boolean;

  @ApiProperty({
    description: 'SMS notifications enabled',
    example: false,
    required: false,
  })
  @IsOptional()
  smsNotifications?: boolean;

  @ApiProperty({
    description: 'Push notifications enabled',
    example: true,
    required: false,
  })
  @IsOptional()
  pushNotifications?: boolean;

  @ApiProperty({
    description: 'Marketing emails enabled',
    example: false,
    required: false,
  })
  @IsOptional()
  marketingEmails?: boolean;

  @ApiProperty({
    description: 'Booking reminders enabled',
    example: true,
    required: false,
  })
  @IsOptional()
  bookingReminders?: boolean;

  @ApiProperty({
    description: 'Promotional offers enabled',
    example: false,
    required: false,
  })
  @IsOptional()
  promotionalOffers?: boolean;
}

export class PrivacySettingsDto {
  @ApiProperty({
    description: 'Profile visibility enabled',
    example: true,
    required: false,
  })
  @IsOptional()
  profileVisibility?: boolean;

  @ApiProperty({
    description: 'Data analytics consent',
    example: false,
    required: false,
  })
  @IsOptional()
  dataAnalytics?: boolean;

  @ApiProperty({
    description: 'GDPR consent',
    example: true,
    required: false,
  })
  @IsOptional()
  gdprConsent?: boolean;

  @ApiProperty({
    description: 'Marketing consent',
    example: false,
    required: false,
  })
  @IsOptional()
  marketingConsent?: boolean;
}
