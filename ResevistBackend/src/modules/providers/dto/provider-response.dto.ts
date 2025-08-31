import { ApiProperty } from '@nestjs/swagger';
import { ProviderType, ProviderStatus } from '../../../entities/provider.entity';

export class ProviderResponseDto {
  @ApiProperty({
    description: 'Provider unique identifier',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Business/provider name',
    example: 'John\'s Plumbing Services',
  })
  businessName: string;

  @ApiProperty({
    description: 'Provider type',
    enum: ProviderType,
    example: ProviderType.INDIVIDUAL,
  })
  providerType: ProviderType;

  @ApiProperty({
    description: 'Business description',
    example: 'Professional plumbing services with 10+ years experience',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Business address',
    example: '123 Main Street, Suite 100',
  })
  address: string;

  @ApiProperty({
    description: 'Business city',
    example: 'New York',
  })
  city: string;

  @ApiProperty({
    description: 'Business state/region',
    example: 'New York',
    required: false,
  })
  state?: string;

  @ApiProperty({
    description: 'Business country',
    example: 'United States',
  })
  country: string;

  @ApiProperty({
    description: 'Business postal code',
    example: '10001',
  })
  postalCode: string;

  @ApiProperty({
    description: 'Business latitude for mapping',
    example: 40.7128,
    required: false,
  })
  latitude?: number;

  @ApiProperty({
    description: 'Business longitude for mapping',
    example: -74.0060,
    required: false,
  })
  longitude?: number;

  @ApiProperty({
    description: 'Business phone number',
    example: '+1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'Business website URL',
    example: 'https://johnsplumbing.com',
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: 'Business license number',
    example: 'PL123456',
    required: false,
  })
  licenseNumber?: string;

  @ApiProperty({
    description: 'Tax identification number',
    example: '12-3456789',
    required: false,
  })
  taxId?: string;

  @ApiProperty({
    description: 'Business logo URL',
    example: 'https://example.com/logo.jpg',
    required: false,
  })
  logo?: string;

  @ApiProperty({
    description: 'Business cover image URL',
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  coverImage?: string;

  @ApiProperty({
    description: 'Provider status',
    enum: ProviderStatus,
    example: ProviderStatus.ACTIVE,
  })
  status: ProviderStatus;

  @ApiProperty({
    description: 'Provider verification status',
    example: true,
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'Provider accepts online payments',
    example: true,
  })
  acceptsOnlinePayments: boolean;

  @ApiProperty({
    description: 'Provider accepts cash payments',
    example: false,
  })
  acceptsCashPayments: boolean;

  @ApiProperty({
    description: 'Provider requires deposit',
    example: false,
  })
  requiresDeposit: boolean;

  @ApiProperty({
    description: 'Deposit percentage (0-100)',
    example: 25,
    required: false,
  })
  depositPercentage?: number;

  @ApiProperty({
    description: 'Cancellation policy hours',
    example: 24,
  })
  cancellationPolicyHours: number;

  @ApiProperty({
    description: 'Platform commission rate (0-100)',
    example: 10.00,
  })
  commissionRate: number;

  @ApiProperty({
    description: 'Average rating (1-5)',
    example: 4.5,
    required: false,
  })
  averageRating?: number;

  @ApiProperty({
    description: 'Total number of reviews',
    example: 125,
  })
  totalReviews: number;

  @ApiProperty({
    description: 'Total number of completed bookings',
    example: 250,
  })
  totalBookings: number;

  @ApiProperty({
    description: 'Provider verification notes',
    example: 'License verified, insurance confirmed',
    required: false,
  })
  verificationNotes?: string;

  @ApiProperty({
    description: 'Provider verification date',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  verifiedAt?: Date;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Associated user ID',
    example: 'user-uuid-string',
  })
  userId: string;

  @ApiProperty({
    description: 'Full business address',
    example: '123 Main Street, Suite 100, New York, NY, United States 10001',
  })
  fullAddress: string;
}
