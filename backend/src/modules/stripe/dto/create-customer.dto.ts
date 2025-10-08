import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Customer email', example: 'customer@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Customer name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Customer phone', example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, string>;
}