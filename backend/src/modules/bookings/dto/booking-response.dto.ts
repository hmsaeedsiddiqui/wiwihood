import { ApiProperty } from '@nestjs/swagger';

export class BookingResponseDto {
  @ApiProperty({
    description: 'Booking unique identifier',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Customer information',
  })
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };

  @ApiProperty({
    description: 'Service information',
  })
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };

  @ApiProperty({
    description: 'Provider information',
  })
  provider: {
    id: string;
    businessName: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };

  @ApiProperty({
    description: 'Booking start time',
    example: '2024-12-25T10:00:00Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'Booking end time',
    example: '2024-12-25T11:00:00Z',
  })
  endTime: Date;

  @ApiProperty({
    description: 'Total price',
    example: 50.00,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Platform fee',
    example: 5.00,
  })
  platformFee: number;

  @ApiProperty({
    description: 'Booking status',
    example: 'confirmed',
  })
  status: string;

  @ApiProperty({
    description: 'Customer notes',
    example: 'Please call before arrival',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Booking creation date',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Booking last update date',
  })
  updatedAt: Date;
}

export class BookingsListResponseDto {
  @ApiProperty({
    description: 'List of bookings',
    type: [BookingResponseDto],
  })
  bookings: BookingResponseDto[];

  @ApiProperty({
    description: 'Total number of bookings',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total pages',
    example: 10,
  })
  totalPages: number;
}
