import { IsOptional, IsString, IsBoolean, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ServiceFilterDto {
  @ApiPropertyOptional({ example: 'Hair styling', description: 'Search term for service name or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'b8c4f8e0-7b6a-4e8d-9c3e-1f2a3b4c5d6e', description: 'Filter by category ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Filter by provider ID' })
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @ApiPropertyOptional({ example: 20.00, description: 'Minimum price filter' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  minPrice?: number;

  @ApiPropertyOptional({ example: 100.00, description: 'Maximum price filter' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  maxPrice?: number;

  @ApiPropertyOptional({ example: true, description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'active', description: 'Filter by service status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'appointment', description: 'Filter by service type' })
  @IsOptional()
  @IsString()
  serviceType?: string;

  @ApiPropertyOptional({ example: 'fixed', description: 'Filter by pricing type' })
  @IsOptional()
  @IsString()
  pricingType?: string;

  @ApiPropertyOptional({ example: 'beauty-wellness', description: 'Filter by category name/slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'top-rated', description: 'Filter by badge type (top-rated, best-seller, etc.)' })
  @IsOptional()
  @IsString()
  type?: string;
}
