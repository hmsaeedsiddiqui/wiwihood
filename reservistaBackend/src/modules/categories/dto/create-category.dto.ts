import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Beauty & Wellness', description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'Beauty and wellness services including hair, nails, massage', 
    description: 'Category description' 
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'beauty-wellness', description: 'URL-friendly slug' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'https://example.com/category-icon.png', description: 'Category icon URL' })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/category-image.jpg', description: 'Category image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether category is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Whether category is featured' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: '#FF5722', description: 'Category color for UI' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ 
    example: ['beauty', 'wellness', 'spa'], 
    description: 'Search tags for the category' 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
