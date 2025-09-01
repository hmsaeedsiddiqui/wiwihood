import { IsOptional, IsString, IsBoolean, IsNumber, IsUUID, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ReviewFilterDto {
  @ApiPropertyOptional({ example: 'b8c4f8e0-7b6a-4e8d-9c3e-1f2a3b4c5d6e', description: 'Filter by provider ID' })
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Filter by customer ID' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ example: 4, description: 'Minimum rating filter' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value))
  minRating?: number;

  @ApiPropertyOptional({ example: 5, description: 'Maximum rating filter' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value))
  maxRating?: number;

  @ApiPropertyOptional({ example: true, description: 'Filter by published status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isPublished?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Filter by verified status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isVerified?: boolean;

  @ApiPropertyOptional({ example: 'excellent service', description: 'Search term for review content' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class ProviderResponseDto {
  @ApiPropertyOptional({ 
    example: 'Thank you for your review! We appreciate your feedback.', 
    description: 'Provider response to the review' 
  })
  @IsNotEmpty()
  @IsString()
  providerResponse: string;
}
