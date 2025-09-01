import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Excellent service!', description: 'Review title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ 
    example: 'Great experience, highly recommend this service provider', 
    description: 'Review comment' 
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Booking ID' })
  @IsNotEmpty()
  @IsUUID()
  bookingId: string;

  @ApiPropertyOptional({ example: true, description: 'Whether review should be published' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
