import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class DashboardStatsDto {
  @ApiProperty({ description: 'Total number of users' })
  @IsNumber()
  totalUsers: number;

  @ApiProperty({ description: 'Total number of providers' })
  @IsNumber()
  totalProviders: number;

  @ApiProperty({ description: 'Total number of bookings' })
  @IsNumber()
  totalBookings: number;

  @ApiProperty({ description: 'Total revenue amount' })
  @IsNumber()
  totalRevenue: number;

  @ApiProperty({ description: 'Number of active users' })
  @IsNumber()
  activeUsers: number;

  @ApiProperty({ description: 'Number of pending bookings' })
  @IsNumber()
  pendingBookings: number;

  @ApiProperty({ description: 'New users registered this month' })
  @IsNumber()
  newUsersThisMonth: number;

  @ApiProperty({ description: 'New providers registered this month' })
  @IsNumber()
  newProvidersThisMonth: number;

  @ApiProperty({ description: 'Average booking value' })
  @IsNumber()
  averageBookingValue: number;
}