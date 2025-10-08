import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsDateString, Min, Max } from 'class-validator';
import { AddonType } from '../../../entities/service-addon.entity';

export class CreateServiceAddonDto {
  @ApiProperty({ 
    description: 'Addon name',
    example: 'Hot Stone Therapy'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Addon description',
    example: 'Relaxing hot stone treatment to enhance your massage experience'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Addon price',
    example: 25.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ 
    description: 'Additional duration in minutes',
    example: 15,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalDuration?: number;

  @ApiProperty({ 
    description: 'Addon type',
    enum: AddonType,
    example: AddonType.INDIVIDUAL
  })
  @IsEnum(AddonType)
  type: AddonType;

  @ApiPropertyOptional({ 
    description: 'Display order',
    example: 1,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum quantity per booking',
    example: 2,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxQuantity?: number;

  @ApiPropertyOptional({ 
    description: 'Addon image URL'
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Seasonal availability start date',
    example: '2025-06-01'
  })
  @IsOptional()
  @IsDateString()
  seasonalStartDate?: string;

  @ApiPropertyOptional({ 
    description: 'Seasonal availability end date',
    example: '2025-08-31'
  })
  @IsOptional()
  @IsDateString()
  seasonalEndDate?: string;

  @ApiPropertyOptional({ 
    description: 'Compatible service IDs',
    example: ['service1', 'service2']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  compatibleServiceIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Category IDs',
    example: ['category1', 'category2']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}

export class UpdateServiceAddonDto {
  @ApiPropertyOptional({ 
    description: 'Addon name'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Addon description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Addon price'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ 
    description: 'Additional duration in minutes'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalDuration?: number;

  @ApiPropertyOptional({ 
    description: 'Addon type',
    enum: AddonType
  })
  @IsOptional()
  @IsEnum(AddonType)
  type?: AddonType;

  @ApiPropertyOptional({ 
    description: 'Is addon active'
  })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Display order'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum quantity per booking'
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxQuantity?: number;

  @ApiPropertyOptional({ 
    description: 'Addon image URL'
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Seasonal availability start date'
  })
  @IsOptional()
  @IsDateString()
  seasonalStartDate?: string;

  @ApiPropertyOptional({ 
    description: 'Seasonal availability end date'
  })
  @IsOptional()
  @IsDateString()
  seasonalEndDate?: string;

  @ApiPropertyOptional({ 
    description: 'Compatible service IDs'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  compatibleServiceIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Category IDs'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}

export class CreateAddonPackageDto {
  @ApiProperty({ 
    description: 'Package name',
    example: 'Ultimate Relaxation Package'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Package description',
    example: 'Complete spa experience with all premium add-ons'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Package price (discounted)',
    example: 75.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  packagePrice: number;

  @ApiProperty({ 
    description: 'Addon IDs included in package',
    example: ['addon1', 'addon2', 'addon3']
  })
  @IsArray()
  @IsString({ each: true })
  addonIds: string[];

  @ApiPropertyOptional({ 
    description: 'Package validity start date',
    example: '2025-01-01T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiPropertyOptional({ 
    description: 'Package validity end date',
    example: '2025-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @IsDateString()
  validUntil?: string;
}

export class AddBookingAddonDto {
  @ApiProperty({ 
    description: 'Addon ID'
  })
  @IsString()
  addonId: string;

  @ApiPropertyOptional({ 
    description: 'Quantity',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ 
    description: 'Special instructions for addon'
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}